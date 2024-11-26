import SypagoLogo from '../logo/SypagoLogo';
import TunnalLogo from '../logo/TunnalLogo';

import SyPagoLoadImage from '../img/SyPagoLoadImage';
import LoadTunnalImage from '../img/LoadTunnalImage';

import DigitelLogo from '../logo/DigitelLogo';

export const themeConfig = {

    colors: {
        //mainBg: '#24262B', //Tunnal
        //mainBg: '#0B416E', //Sypago

        mainBg: '#8C0414', //Digitel


        mainBgSecundary: '#F5F5F5', //Tunnal 




        //primary: '#C10000', //Tunnal
        //primary: '#0065BB', //Sypago
        primary: '#4D2680', //Digitel


        secondary: '#00BCF4', //Sypago


        tertiary: '#00BCF4', //Sypago

        error: '#C10000', //Sypago
        success: '#00BCF4', //Sypago

        //focus: '#0065BB', //Sypago
        focus: '#7669A9', //Digitel
    },

    logo: {
        // Reference to the SVG component
        //Component: SypagoLogo,

        Component: DigitelLogo,
        // Default props for the logo
       
    },

    company: {
        name: 'Soluciones Sycom',
    },

    loadImage: {
        Component: LoadTunnalImage,
    },
    activateLogin: true,
    activateShop: true,


}