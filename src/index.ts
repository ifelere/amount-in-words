export enum CountryCodes {
  IND = "IND",
  USA = "USA",
  GBR = "GBR",
  NGR = "NGR",
}

export enum FormatImplementation {
  DEFAULT = "default",
  USE_AND_IN_NO_CHANGE_US_SYSTEM = "USE_AND_IN_NO_CHANGE_US_SYSTEM"
}


export interface ConvertOptions {
  implementation?: FormatImplementation
}


export class AmountToWords {
  private first = [
    "",
    "One ",
    "Two ",
    "Three ",
    "Four ",
    "Five ",
    "Six ",
    "Seven ",
    "Eight ",
    "Nine ",
    "Ten ",
    "Eleven ",
    "Twelve ",
    "Thirteen ",
    "Fourteen ",
    "Fifteen ",
    "Sixteen ",
    "Seventeen ",
    "Eighteen ",
    "Nineteen ",
  ];
  private tens = [
    "",
    "",
    "Twenty ",
    "Thirty ",
    "Forty ",
    "Fifty ",
    "Sixty ",
    "Seventy ",
    "Eighty ",
    "Ninety ",
  ];
  private numSys: { [currencyCode: string]: string[] } = {
    usNumSys: [
      "",
      "Hundred ",
      "Thousand ",
      "Million ",
      "Billion ",
      "Trillion ",
    ],
    inNumSys: ["", "Hundred ", "Thousand ", "Lakh ", "Crore "],

  };

  /**
   * Ifelere: Naira does not not have an 's' for plural therefore this map is adjusted to have currencies declare plural form
   */
  private curCodes: { [countryCode: string]: string[] } = {
    IND: ["Rupee", "Paisa", "Paise", "₹", "inNumSys", "Rupees"],
    USA: ["Dollar", "Cent", "Cents", "$", "usNumSys", "Dollars"],
    GBR: ["Pound", "Pence", "Pence", "£", "usNumSys", "Pounds"],
    NGR: ["Naira", "Kobo", "Kobo", "₦", "usNumSys", "Naira"]
  };

  private getCurrencyWhole = (
    countryCode: string = "IND",
    amount: number = 0
  ) => {
    // Ifelere: If the amount is more than one use index 5 of curCodes map
    const index = amount > 1 ? 5 : 0;

    const cur = this.curCodes[countryCode]
      ? this.curCodes[countryCode][index]
      : this.curCodes["IND"][index];

    // if (amount > 1) return cur + "s";
    // else return cur;
    return cur;
  };

  private getCurrencyChange = (countryCode: string, amount: number = 0) => {
    if (amount > 1)
      return this.curCodes[countryCode]
        ? this.curCodes[countryCode][2]
        : this.curCodes["IND"][2];
    else
      return this.curCodes[countryCode]
        ? this.curCodes[countryCode][1]
        : this.curCodes["IND"][1];
  };

  private getCurrencySymbol = (countryCode: string) => {
    return this.curCodes[countryCode]
      ? this.curCodes[countryCode][2]
      : this.curCodes["IND"][2];
  };

  private getNumSys = (countryCode: string) => {
    return this.curCodes[countryCode]
      ? this.curCodes[countryCode][4]
      : this.curCodes["IND"][4];
  };

  public convertInWord = (num: any, countryCode: string = "IND", options?: ConvertOptions) => {
    // console.log(num);
    options = options || {implementation: FormatImplementation.DEFAULT};

    const numSys = this.numSys[this.getNumSys(countryCode)];
    const nStr = num.toString().split(".");
    // Remove any other characters than numbers
    const wholeStr = Number(nStr[0].replace(/[^a-z\d\s]+/gi, ""));
    const decimalStr = nStr.length > 1 ? Number(nStr[1]) : 0;
    const wholeStrPart =
      this.getNumSys(countryCode) === "inNumSys"
        ? this.convert(wholeStr, numSys).trim()
        : this.convertInUS(wholeStr, numSys, options.implementation || FormatImplementation.DEFAULT, decimalStr).trim();
    const decimalPart = this.convert(decimalStr, numSys).trim();
    let valueInStr =
      wholeStrPart.length > 0
        ? `${wholeStrPart} ${this.getCurrencyWhole(countryCode, wholeStr)}`
        : `Zero ${this.getCurrencyWhole(countryCode, wholeStr)}`;
    valueInStr =
      decimalPart.length > 0
        ? `${valueInStr} And ${decimalPart} ${this.getCurrencyChange(
            countryCode,
            decimalStr
          )}`
        : valueInStr;
    // console.log(valueInStr);
    return valueInStr;
  };

  private convert = (num: number | string, numSys: string[]) => {
    const numStr = num.toString().split("");
    const finalStr = [];
    while (numStr.length > 0) {
      for (let i = 0; i < numSys.length - 1; ++i) {
        if (i === 1)
          finalStr.unshift(this.getUnits(numStr.splice(-1), numSys, i));
        else finalStr.unshift(this.getUnits(numStr.splice(-2), numSys, i));
      }
      if (numStr.length > 0) finalStr.unshift(...numSys.slice(-1));
    }
    return finalStr.join("");
  };

  private convertInUS = (num: number | string, numSys: string[], implementation: FormatImplementation, trailingFigure: number = 0) => {
    const numStr = num.toString().split("");
    const finalStr = [];
    while (numStr.length > 0) {
      // console.log(numSys.length);
      for (let i = 0, l = numSys.length * 2 - 1; i < l; ++i) {
        // console.log(numStr, i, (i/2)+1);
        if (i === 0) {
          let part = this.getUnits(numStr.splice(-2), numSys, 0);
          if (part && trailingFigure < 1 && implementation === FormatImplementation.USE_AND_IN_NO_CHANGE_US_SYSTEM) {
            part = `And ${part}`;
          }
          finalStr.unshift(part);
        }
        else if (i % 2 === 1)
          finalStr.unshift(this.getUnits(numStr.splice(-1), numSys, 1));
        else {
          finalStr.unshift(this.getUnits(numStr.splice(-2), numSys, i / 2 + 1));
        }
      }
      if (numStr.length > 0) finalStr.unshift(...numSys.slice(-1));
      else break;
    }
    return finalStr.join("");
  };

  private getUnits = (
    lastTwo: string[],
    numSys: string[],
    place?: number
  ): string => {
    if (!lastTwo || lastTwo.length === 0) return "";
    let numInStr = "";
    if (this.first[Number(lastTwo.join(""))])
      numInStr = this.first[Number(lastTwo.join(""))];
    else
      numInStr = `${this.tens[Number(lastTwo.shift())]}${this.getUnits(
        lastTwo.slice(-1),
        numSys
      )}`;
    if (numInStr && place) numInStr = `${numInStr}${numSys[place] ?? ""}`;
    return numInStr;
  };
}
