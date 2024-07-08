import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import SelectWithSearch from '../../../core/select/SelectWithSearch';
import ChipSelector from '../../../core/chip_selector/ChipSelector';
import InputBox from '../../../core/input/InputBox';
import Select from '../../../core/select/Select';
import logger from '../../../../logic/Logger/logger';

const requiredRule = {
    required: {
        value: true,
        message: "El campo es requerido",
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




function PayUserDataForm({ banks = [], receivingUser, amount, onSubmit }) {

    const { register, handleSubmit, formState, setValue, watch } = useForm({
        mode: "onChange",
    });

    logger.log("Renderizo PayForm", banks, receivingUser)

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

    const amtValue = amount?.amt.toString();


    const [phoneAccountSelector, setPhoneAccountSelector] = useState(accountPrefix &&
        accountPrefix == "CNTA" ? "Cuenta" : "Teléfono")

    const [docPrefix, setDocPrefix] = useState(docLetter ?
        docLetter : docsPrefix[0]);


    const bankCodeData = receivingUser?.account?.bank_code;



    const bankCodeName = referenceBankList.current.get(bankCodeData);



    const [bank, setBank] = useState(bankCodeName);

    const [bankErr, setBankErr] = useState(false);




    logger.log("PayForm", bank, bankCodeData, bankCodeName, amtValue, docLetter);





    return (
        <form className="bg-transparent px-1.5 w-full h-auto max-w-[360px] space-y-[1.2rem] mx-auto md:max-w-[440px] "
            noValidate
            onSubmit={
                handleSubmit((data) => {

                    if (bankErr)
                        return;

                    logger.log("Submit de Pago", data);
                    const newData = {
                        ...data,
                        doc_prefix: docPrefix,
                        bank_code: referenceBankListReverse.current.get(bank),
                        bank_name: bank,
                        acct_type: acctTypeDict[phoneAccountSelector],
                        acct_name: phoneAccountSelector,

                    }
                    logger.log("DATA RECEPTORA EN SUBMIT:", newData);
                    if (onSubmit) {
                        onSubmit(newData);
                    }

                })}>

            <SelectWithSearch
                value={bank}
                onChange={setBank}
                label={"Banco"}
                inputName={"bank"}
                options={showBanks}
                onError={setBankErr}
                useStrongErrColor={isSubmitted} />

            <div className=''>
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
                validationRules={requiredRule}
                watch={watch}

            />}

            {phoneAccountSelector === "Cuenta" && <InputBox
                label={"Cuenta"}
                value={accountValue}
                useDotLabel={false}
                inputName={"acct"}
                register={register}
                errMessage={errors.acct?.message}
                useStrongErrColor={isSubmitted}
                validationRules={requiredRule}
                watch={watch}

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
                    validationRules={requiredRule}
                    watch={watch}


                />

            </div>

            {amount?.type !== "NONE" &&
                <InputBox
                    label={"Monto"}
                    value={amtValue}
                    useDotLabel={false}
                    inputName={"amt"}
                    register={register}
                    errMessage={errors.amt?.message}
                    useStrongErrColor={isSubmitted}
                    validationRules={requiredRule}
                    watch={watch}
                />}

            <div className='mx-auto px-4 md:px-8 space-y-2 w-full'>
                <button className="w-full bg-primary  mx-auto text-white px-2 md:h-[75px] 
                    py-3 rounded-md shadow-md text-2xl transition-all ease-in-out hover:bg-secundary hover:scale-105  "
                    type="submit">Pagar</button>


                <div className="flex justify-end">
                    <a className='block text-white font-medium  bg-slate-500 
                    rounded-full px-4 py-2 text-sm text-center shadow-md cursor-pointer transition-all ease-in-out 
                    hover:bg-primary hover:scale-105 '>Entrar y pagar</a>
                </div>


            </div>


        </form>
    );
}


export default PayUserDataForm;