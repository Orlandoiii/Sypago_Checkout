import { useForm } from 'react-hook-form';
import InputBox from '../../core/input/InputBox';
import { useState } from 'react';
import Logo from '../../core/logo/Logo';
import logger from '../../../logic/Logger/logger';

const usernameOrEmailValidator = {
    required: "Este campo es requerido",
    validate: (value) => {
        // Email regex pattern
        const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        // Username pattern (alphanumeric, underscore, dash, 3-30 characters)
        const usernamePattern = /^[a-zA-Z0-9_-]{3,30}$/;

        if (emailPattern.test(value) || usernamePattern.test(value)) {
            return true;
        }
        return "Ingrese un email o nombre de usuario válido";
    }
};

const passwordValidator = {
    required: "La contraseña es requerida",
    minLength: {
        value: 8,
        message: "La contraseña debe tener al menos 8 caracteres"
    },
    validate: (value) => {
        // Check for at least one uppercase letter

        return true;

 
    }
};


export default function LoginForm({onSubmit}) {

    const { register, handleSubmit, formState, setValue, watch, setError } = useForm({
        mode: "onChange",
    });

    const { errors, isSubmitted } = formState;


    const [userNameOrEmailValue, setUserNameOrEmailValue] = useState("");
    const [passwordValue, setPasswordValue] = useState("");


    const handleSubmitForm = async (data) => {
        try {
            onSubmit(data);
        } catch (error) {
            logger.error('Login failed:', error);
        }
    };

    return (
        <div className="h-screen w-full bg-slate-100 flex justify-center items-center mx-auto md:p-6">
            <form onSubmit={handleSubmit(handleSubmitForm)} className="w-full h-full md:h-auto flex flex-col justify-center  
            md:max-w-md px-4 py-8 space-y-6 border-2 
            border-main-bg-secundary bg-main-bg-secundary rounded-md shadow-lg ">
                {/* Email Field */}
                <div>
                    <Logo></Logo>
                </div>

                <InputBox
                    label={"Usuario o Email"}
                    value={userNameOrEmailValue}
                    useDotLabel={false}
                    inputName={"username"}
                    register={register}
                    errMessage={errors.username?.message}
                    useStrongErrColor={isSubmitted}
                    validationRules={usernameOrEmailValidator}
                    watch={watch}
                />

                <InputBox
                    label={"Contraseña"}
                    value={passwordValue}
                    useDotLabel={false}
                    inputName={"password"}
                    register={register}
                    errMessage={errors.password?.message}
                    useStrongErrColor={isSubmitted}
                    validationRules={passwordValidator}
                    watch={watch}
                />
                <button className="w-full bg-primary  mx-auto text-white px-2 h-[50px] 
                    py-1 rounded-md shadow-md text-xl transition-all ease-in-out hover:bg-secundary hover:scale-105  "
                    type="submit">Iniciar sesión</button>

            </form>
        </div>
    );
}