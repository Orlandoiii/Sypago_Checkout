import SypagoLogo from '../logo/SypagoLogo';
import TunnalLogo from '../logo/TunnalLogo';

import SyPagoLoadImage from '../img/SyPagoLoadImage';
import LoadTunnalImage from '../img/LoadTunnalImage';

import DigitelLogo from '../logo/DigitelLogo';
import BitMercadoDigitalLogo, { EmptyLoadImage } from '../logo/BitMercadoDigitalLogo';



export const themeConfig = {

    colors: {
        //mainBg: '#24262B', //Tunnal
        mainBg: '#0A7356', //Sypago

        //mainBg: '#8C0414', //Digitel


        mainBgSecundary: '#F5F5F5', //Tunnal 




        //primary: '#C10000', //Tunnal
        //primary: '#4D2680', //Digitel


        primary: '#0A7356', //Sypago


        secondary: '#00BCF4', //Sypago

        tertiary: '#00BCF4', //Sypago

        error: '#C10000', //Sypago

        success: '#00BCF4', //Sypago

        focus: '#0A7356', //Sypago



        //focus: '#7669A9', //Digitel
    },

    logo: {
        // Reference to the SVG component
        //Component: SypagoLogo,

        Component: BitMercadoDigitalLogo,
        // Default props for the logo

    },

    company: {
        name: 'Bit Mercado Digital',
    },

    loadImage: {
        Component: EmptyLoadImage,
    },
    activateLogin: false,
    activateShop: false,





}