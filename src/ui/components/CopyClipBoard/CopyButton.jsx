import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useState } from 'react';


function CopyButton({ textToCopy }) {

    const [copyCompleted, setCopyCompleted] = useState(false);

    const handleCopy = () => {
        setCopyCompleted(true);
        setTimeout(() => setCopyCompleted(false), 2200);
    };
    return (

        <CopyToClipboard text={textToCopy} onCopy={handleCopy}>
            <button role='button' className={`w-4 h-4 ${copyCompleted ? "fill-green-400" : "fill-black"} 
                  relative flex justify-center items-center transition-all duration-100`}>
                {copyCompleted ?
                    <svg className="w-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                        <path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-111 111-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l64 64c9.4 9.4 24.6 9.4 33.9 0L369 209z" />
                    </svg>
                    :
                    <svg className="w-10/12" viewBox="0 0 15 18" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.14706 18C1.69412 18 1.30637 17.8237 0.983824 17.4713C0.661275 17.1187 0.5 16.695 0.5 16.2V3.6H2.14706V16.2H11.2059V18H2.14706ZM5.44118 14.4C4.98824 14.4 4.60049 14.2238 4.27794 13.8713C3.95539 13.5188 3.79412 13.095 3.79412 12.6V1.8C3.79412 1.305 3.95539 0.88125 4.27794 0.52875C4.60049 0.17625 4.98824 0 5.44118 0H12.8529C13.3059 0 13.6936 0.17625 14.0162 0.52875C14.3387 0.88125 14.5 1.305 14.5 1.8V12.6C14.5 13.095 14.3387 13.5188 14.0162 13.8713C13.6936 14.2238 13.3059 14.4 12.8529 14.4H5.44118ZM5.44118 12.6H12.8529V1.8H5.44118V12.6Z" />
                    </svg>
                }
            </button>
        </CopyToClipboard>

    )
}

export default CopyButton;