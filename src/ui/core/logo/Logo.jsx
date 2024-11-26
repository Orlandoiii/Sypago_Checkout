import { themeConfig } from "../config/theme";

export default Logo;

function Logo({ negative = false, className = 'w-40' }) {
    return (

        <themeConfig.logo.Component
            negative={negative}
        />

    )
}


