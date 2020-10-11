# amount-in-words
Convert numeric amount in words

A very simple tool to convert amount in words.

**Conversion Examples**  
101 - One Hundred One Rupees  
1010101010.01 - One Billion Ten Million One Hundred One Thousand Ten Dollars And One Cent

#### Input Parameters
**amount:** number or string (e.g. 11022.27, '$657,798.54')  
**countryCode:** IND, GBR, USA (more will be added in future)  

#### Usage - Javascript
```
const atwp = require('amount-in-words');
const atw = new atwp.AmountToWords();

console.log(atw.toWords(111.11, atwp.CountryCodes.IND));
```

#### Usage - Typescript
```
import { AmountToWords, CountryCodes } from "amount-in-words";
const atw = new AmountToWords();

console.log(atw.toWords(123.45, CountryCodes.GBR));
```
