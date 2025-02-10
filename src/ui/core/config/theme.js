import SypagoLogo from '../logo/SypagoLogo';
import TunnalLogo from '../logo/TunnalLogo';

import SyPagoLoadImage from '../img/SyPagoLoadImage';
import LoadTunnalImage from '../img/LoadTunnalImage';

import DigitelLogo from '../logo/DigitelLogo';
import BitMercadoDigitalLogo, { EmptyLoadImage } from '../logo/BitMercadoDigitalLogo';



export const themeConfig = {

    colors: {
        mainBg: '#94D500', //Sypago

        mainBgSecundary: '#F5F5F5', //Tunnal 

        primary: '#94D500', //Sypago

        secondary: '#00BCF4', //Sypago

        tertiary: '#00BCF4', //Sypago

        error: '#C10000', //Sypago

        success: '#00BCF4', //Sypago

        focus: '#94D500', //Sypago

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