import { AmountToWords, CountryCodes } from '../src/index';

const atw = new AmountToWords();

// Indian Numbering System
test('basic', () => {
    expect(atw.convertInWord(123)).toEqual('One Hundred Twenty Three Rupees');
});
test('thousand', () => {
    expect(atw.convertInWord(1000)).toEqual('One Thousand Rupees');
});
test('lakh', () => {
    expect(atw.convertInWord(101010)).toEqual('One Lakh One Thousand Ten Rupees');
});
test('crore', () => {
    expect(atw.convertInWord('99,91,01,010')).toEqual('Ninety Nine Crore Ninety One Lakh One Thousand Ten Rupees');
});
test('paisa-paise', () => {
    expect(atw.convertInWord('99,91,01,010.01')).toEqual('Ninety Nine Crore Ninety One Lakh One Thousand Ten Rupees And One Paisa');
    expect(atw.convertInWord('99,91,01,010.23')).toEqual('Ninety Nine Crore Ninety One Lakh One Thousand Ten Rupees And Twenty Three Paise');
});

// International Numbering System
test('million', () => {
    expect(atw.convertInWord(1921000, CountryCodes.USA)).toEqual('One Million Nine Hundred Twenty One Thousand Dollars');
});
test('billion', () => {
    expect(atw.convertInWord(554272561010, CountryCodes.USA)).toEqual('Five Hundred Fifty Four Billion Two Hundred Seventy Two Million Five Hundred Sixty One Thousand Ten Dollars');
});
test('trillion', () => {
    expect(atw.convertInWord('632,362,999,101,001', CountryCodes.GBR)).toEqual('Six Hundred Thirty Two Trillion Three Hundred Sixty Two Billion Nine Hundred Ninety Nine Million One Hundred One Thousand One Pounds');
});
test('cent', () => {
    expect(atw.convertInWord('0.01', CountryCodes.USA)).toEqual('Zero Dollar And One Cent');
});
test('cents', () => {
    expect(atw.convertInWord('001.87', CountryCodes.USA)).toEqual('One Dollar And Eighty Seven Cents');
});
test('pence-1', () => {
    expect(atw.convertInWord('0.01', CountryCodes.GBR)).toEqual('Zero Pound And One Pence');
});
test('pence-55', () => {
    expect(atw.convertInWord('001.55', CountryCodes.GBR)).toEqual('One Pound And Fifty Five Pence');
});