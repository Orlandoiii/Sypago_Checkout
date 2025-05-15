const BankPattern = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\-\ \(\)]+$/;


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