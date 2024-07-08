export default function CheckIcon({ width = 'w-[22px]', height = 'h-[22px]', isSelected = false }) {
    return (

        <svg className={`${width} ${height} ${isSelected ? "block" : "hidden"}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 12.6111L8.92308 17.5L20 6.5" stroke="#EEEEEF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

    )
}
