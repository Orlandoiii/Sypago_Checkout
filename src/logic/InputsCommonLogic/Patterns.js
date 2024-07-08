const EmailPattern = /(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;
const AlphabeticCharsPattern = "[a-zA-Z]";
const NumericCharsPatttern = "\\d";
const AmountCharsPattern = "/[\d,.]/"
const SpaceCharPattern = "\\s";
const DotCharPattern = "\\.";

const BankPattern = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\-\ \(\)]+$/;

const PhoneValidPatter = /^(?:(?:0)?414|(?:0)?424|(?:0)?412|(?:0)?416|(?:0)?426)\d{7}$/

export const BankInputAllowPattern = new RegExp(BankPattern)

export function IsControlOrAltKey(event) {
    return (event.altKey && !event.ctrlKey) || (!event.altKey && event.ctrlKey)
}

export function ValidateCharacterOnKeyDown(event, regex) {


    if (event.keyCode === 13 || event.keyCode === 46 || event.keyCode === 8) {
        return true;
    }

    const character = String.fromCharCode(event.keyCode);

    if (regex.test(character)) {
        return true;
    } else {
        event.preventDefault();
        return false;
    }
}
