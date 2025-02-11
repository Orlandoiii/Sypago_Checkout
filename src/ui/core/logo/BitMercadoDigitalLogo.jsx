import blackLogo from "../../../assets/bitmercado_digital/logo_negro.png"
import whiteLogo from "../../../assets/bitmercado_digital/logo_blanco.png"
import colorLogo from "../../../assets/bitmercado_digital/logo_color.png"

export function EmptyLoadImage() {
    return <div className="flex items-center justify-center">
        <svg className="animate-spin-slow border-white"
            xmlns="http://www.w3.org/2000/svg" width="70" height="70"
            viewBox="0 0 30 30" fill="none">
            <path
                d="M0 15C0 16.9698 0.387987 18.9204 1.14181 20.7403C1.89563 22.5601 3.00052 24.2137 4.3934 25.6066C5.78628 26.9995 7.43987 28.1044 9.25975 28.8582C11.0796 29.612 13.0302 30 15 30L15 15H0Z"
                fill="black" />
            <path
                d="M30 15C30 13.0302 29.612 11.0796 28.8582 9.25975C28.1044 7.43986 26.9995 5.78628 25.6066 4.3934C24.2137 3.00052 22.5601 1.89563 20.7402 1.14181C18.9204 0.387985 16.9698 -1.48355e-06 15 -1.31134e-06L15 15L30 15Z"
                fill="#75AD01" />
            <path
                d="M15 30C16.9698 30 18.9204 29.612 20.7403 28.8582C22.5601 28.1044 24.2137 26.9995 25.6066 25.6066C26.9995 24.2137 28.1044 22.5601 28.8582 20.7403C29.612 18.9204 30 16.9698 30 15L15 15L15 30Z"
                fill="" />
            <path
                d="M15 1.96701e-06C13.0302 2.22532e-06 11.0796 0.38799 9.25974 1.14181C7.43986 1.89563 5.78627 3.00052 4.39339 4.3934C3.00052 5.78628 1.89563 7.43987 1.1418 9.25975C0.387985 11.0796 -2.22532e-06 13.0302 -1.96701e-06 15L15 15L15 1.96701e-06Z"
                fill="" />
        </svg>
    </div>
}

function BitMercadoDigitalLogo({ mainColor = "black" }) {

    let logo = mainColor === "black" ? blackLogo : whiteLogo

    if (mainColor === "color") logo = colorLogo

    return <>
        <div className="w-full h-full flex justify-center items-center">
            <img className="w-full h-full" src={logo}
                alt="Bit mercado digital"
                //sizes="(max-width: 200px) 100vw, 200px" 
                />
        </div>
    </>
}

export default BitMercadoDigitalLogo;