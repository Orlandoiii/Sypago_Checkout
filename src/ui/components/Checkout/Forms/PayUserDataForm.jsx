import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import SelectWithSearch from '../../../core/select/SelectWithSearch';
import ChipSelector from '../../../core/chip_selector/ChipSelector';
import InputBox, { FormatAsFloat, ParseToFloat } from '../../../core/input/InputBox';
import Select from '../../../core/select/Select';
import logger from '../../../../logic/Logger/logger';
import { useConfig } from '../../../contexts/ConfigContext';




function GetDigitValue(digits) {
    const Pesos = [3, 2, 7, 6, 5, 4, 3, 2, 7, 6, 5, 4, 3, 2];

    let loopCount = 0;
    let result = 0;

    for (let i = 0; i < digits.length; i++) {
        result += parseInt(digits[i]) * Pesos[loopCount];
        loopCount++;
    }

    result = 11 - (result % 11);
    return result >= 10 ? (result === 10 ? 0 : 1) : result;
}

function IsValidAccount(value) {
    if (value.length !== 20) return false;

    const BankCode = value.substring(0, 4);
    const Ofice = value.substring(4, 8);
    const ControlDigit = value.substring(8, 10);
    const Account = value.substring(10, 20);

    const firstDigit = GetDigitValue(BankCode + Ofice);
    const secondDigit = GetDigitValue(Ofice + Account);

    const isValid = parseInt(ControlDigit) === firstDigit * 10 + secondDigit;

    return isValid;
}

const amountValidatorRule = {
    required: {
        value: true,
        message: "El Monto es requerido",
    }
    // minLength: {
    //   value: 20,
    //   message: "Minimo de caracters"
    // },
    // maxLength: {
    //   value: 21,
    //   message: "Maximo de Caracteres"
    // }
}


const phoneValidatorRule = {
    required: {
        value: true,
        message: "El Teléfono es requerido",
    },
    minLength: {
        value: 10,
        message: "El Teléfono debe tener minimo 10 numeros"
    },
    maxLength: {
        value: 11,
        message: "El Teléfono debe tener maximo 11 numeros"
    },
    pattern: {
        value: /^(?:(?:0)?414|(?:0)?424|(?:0)?412|(?:0)?416|(?:0)?426)\d{7}$/,
        message: "Formato ejem:414/04141112233"
    }
}

const acctValidatorRule = {
    required: {
        value: true,
        message: "La Cuenta es requerida",
    },
    minLength: {
        value: 20,
        message: "La Cuenta debe tener minimo 20 numeros"
    },
    maxLength: {
        value: 20,
        message: "La Cuenta debe tener maximo 20 numeros"
    }
    // validate: {
    //     value: (v) => IsValidAccount(v),
    //     message: "La Cuenta no es valida"
    // }
}


const docValidatorRule = {
    required: {
        value: true,
        message: "El Nro de documento es requerido",
    },
    minLength: {
        value: 3,
        message: "El Nro de documento minimo 3 caracteres"
    },
    maxLength: {
        value: 16,
        message: "El Nro de documento maximo 16 caracteres"
    }
    // validate: {
    //     value: (v) => IsValidAccount(v),
    //     message: "La Cuenta no es valida"
    // }
}



const regexPatternForNumbers = /^\d$/;


const docsPrefix = [
    "V",
    "J",
    "E",
    "G",
    "P",
    "R",
    "C"
]
const acctTypeDict = {
    "Teléfono": "CELE",
    "Cuenta": "CNTA"
}

const acctTypeDictReverse = {
    "CELE": "Teléfono",
    "CNTA": "Cuenta"
}



export function validateAmount(amt, amtObject) {

    if (amtObject.type == "NONE")
        return "";

    if (amt <= 0) {
        return "El monto pagado debe ser mayor a cero";
    }

    if (amtObject.type == "ALMP") {
        return "";
    }

    if ((amtObject.type == "ALMM" || amtObject.type == "ALMX") && amt < amtObject.min_allow_amt) {
        return `Monto minimo permitido ${FormatAsFloat(amtObject.min_allow_amt)}`
    }

    if (amtObject.type == "ALMX" && amt > amtObject.max_allow_amt) {
        return `Monto maximo permitido ${FormatAsFloat(amtObject.max_allow_amt)}`
    }

    return "";
}




function PayUserDataForm({ banks = [], receivingUser, amount, onSubmit, transactionId, isBlueprint }) {

    const { register, handleSubmit, formState, setValue, watch, setError } = useForm({
        mode: "onChange",
    });


    const { errors, isSubmitted } = formState;

    const referenceBankList = useRef(new Map());


    const referenceBankListReverse = useRef(new Map());


    const showBanks = banks.map((v) => {

        const largeName = `${v.code} - ${v.name}`;
        referenceBankList.current.set(v.code, largeName);
        referenceBankListReverse.current.set(largeName, v.code)
        return largeName;
    })


    const accountPrefix = receivingUser?.account?.type

    const accountValue = receivingUser?.account?.number

    const docLetter = receivingUser?.document_info?.type

    const docValue = receivingUser?.document_info?.number

    const [amt, setAmt] = useState(FormatAsFloat(amount.amt));

    const [amtErrMessage, setAmtErrMessage] = useState("");

    const [phoneAccountSelector, setPhoneAccountSelector] = useState(accountPrefix &&
        accountPrefix == "CNTA" ? "Cuenta" : "Teléfono")

    const [docPrefix, setDocPrefix] = useState(docLetter ?
        docLetter : docsPrefix[0]);


    const bankCodeData = receivingUser?.account?.bank_code;

    const bankCodeName = referenceBankList.current.get(bankCodeData);

    const [bank, setBank] = useState(bankCodeName);

    const [bankErr, setBankErr] = useState(false);


    logger.log("Renderizando PayUserDataForm", bank, bankCodeData, bankCodeName, amt, docLetter);

    useEffect(() => {
        const convertAmt = ParseToFloat(amt);
        setAmtErrMessage(validateAmount(convertAmt, amount));
    }, [amt])

    return (
        <form className="bg-transparent px-1.5 w-full h-auto max-w-[360px] space-y-8 mx-auto md:max-w-[440px] "
            noValidate
            onSubmit={
                handleSubmit((data) => {


                    if (bankErr)
                        return;

                    const bankCode = referenceBankListReverse.current.get(bank);

                    const acctType = acctTypeDict[phoneAccountSelector];

                    if (acctType == "CNTA") {
                        if (data.acct.substring(0, 4) !== bankCode) {
                            setError("acct",
                                {
                                    type: "acct_wrong_account",
                                    message: "La Cuenta debe iniciar con el codigo de Banco"
                                })
                            return;
                        }
                        if (!IsValidAccount(data.acct)) {
                            setError("acct",
                                {
                                    type: "acct_wrong_account",
                                    message: "La Cuenta no es valida digito de control"
                                })
                            return;
                        }
                    }



                    logger.log("Submit de Pago", data);

                    const convertAmt = ParseToFloat(amt);

                    if (amount.type != "NONE" && amtErrMessage.length > 0)
                        return;


                    const newData = {
                        ...data,
                        doc_prefix: docPrefix,
                        bank_code: bankCode,
                        bank_name: bank,
                        acct_type: acctType,
                        acct_name: phoneAccountSelector,
                        amt: convertAmt

                    }
                    logger.log("DATA RECEPTORA EN SUBMIT:", newData);
                    if (onSubmit) {
                        onSubmit(newData);
                    }

                })}>

            <h1 className='text-xl  font-bold'>Datos del Pagador</h1>
            <p className='text-md text-main-bg font-bold md:text-lg'>Ingrese sus datos para realizar la compra</p>
            <SelectWithSearch
                value={bank}
                onChange={setBank}
                label={"Banco"}
                inputName={"bank"}
                options={showBanks}
                onError={setBankErr}
                useStrongErrColor={isSubmitted} 
                description={"Banco desde el que se realiza el pago."}
                />

            <div className='pt-1'>
                <ChipSelector selectedOption={phoneAccountSelector} onSelectedOption={(opt) => {

                    if (opt != phoneAccountSelector) {
                        setValue("acct", "");
                        setValue("phone", "");
                    }

                    setPhoneAccountSelector(opt);

                }} />

            </div>



            {phoneAccountSelector === "Teléfono" && <InputBox
                label={"Teléfono"}
                value={accountValue}
                useDotLabel={false}
                inputName={"phone"}
                register={register}
                errMessage={errors.phone?.message}
                useStrongErrColor={isSubmitted}
                validationRules={phoneValidatorRule}
                watch={watch}
                inputMode='tel'
                characterValidationPattern={regexPatternForNumbers}
                description={"Teléfono asociado a la cuenta del pagador."}

            />}

            {phoneAccountSelector === "Cuenta" && <InputBox
                label={"Cuenta"}
                value={accountValue}
                useDotLabel={false}
                inputName={"acct"}
                register={register}
                errMessage={errors.acct?.message}
                useStrongErrColor={isSubmitted}
                validationRules={acctValidatorRule}
                watch={watch}
                inputMode='numeric'
                characterValidationPattern={regexPatternForNumbers}
                description={"Número de cuenta asociada al banco."}

            />}

            <div className="flex space-x-2">


                <div className='w-[100px]'>
                    <Select
                        controlled={true}
                        value={docPrefix}
                        onSelected={setDocPrefix}

                        label={"Doc"}
                        inputName={"doc_prefix"}
                        options={docsPrefix}
                        openUp={true}
                    />
                </div>


                <InputBox
                    label={"Nro Documento"}
                    value={docValue}
                    useDotLabel={false}
                    inputName={"doc_number"}
                    register={register}
                    errMessage={errors.doc_number?.message}
                    useStrongErrColor={isSubmitted}
                    validationRules={docValidatorRule}
                    watch={watch}
                    inputMode='numeric'
                    characterValidationPattern={regexPatternForNumbers}
                    description={"Número de documento de identidad asociado a la cuenta."}


                />

            </div>

            {amount?.type !== "NONE" &&
                <InputBox
                    label={"Monto"}
                    value={amt}
                    useDotLabel={false}
                    inputName={"amt"}
                    controlled={true}
                    errMessage={amtErrMessage}
                    useStrongErrColor={isSubmitted}
                    onChangeEvent={(e) => {
                        setAmt(FormatAsFloat(ParseToFloat(e.target.value)))
                    }}
                    inputMode='decimal'

                />}

            <div className='mx-auto pt-6 px-4 md:px-8 space-y-2 w-full'>
                <button className="w-full bg-primary  mx-auto text-black px-2 md:h-[75px] 
                    py-3 rounded-md shadow-md text-2xl transition-all ease-in-out hover:bg-secundary hover:scale-105  "
                    type="submit">Pagar</button>


                {/* <div className="flex justify-end">
                    <a className='block text-primary 
                     px-4 py-2  text-center  cursor-pointer transition-all ease-in-out 
                    hover:scale-110 hover:text-secundary ' href={loginAndPayUrl}>Entrar y pagar con SyPago</a>
                </div> */}


            </div>


        </form>
    );
}


export default PayUserDataForm;