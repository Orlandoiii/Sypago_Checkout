import React from 'react';
import Modal from '../../core/modal/Modal';
import CopyButton from '../CopyClipBoard/CopyButton';
import StepButton from '../../core/buttons/StepButton';


function DetailTitle({ open, onClick, title }) {
    return (
        <button className="w-full py-1 px-1" onClick={onClick}>
            <h4 className="text-left text-md font-bold text-black">{title}</h4>
        </button>
    )
}

function DetailField({ title, data, withCopyButton = false }) {
    return (
        <div className="w-full flex justify-between items-start text-sm">
            <h3 className='w-[45%] font-medium'>{`${title}:`}</h3>
            <div className={`flex justify-between items-center space-x-2 w-[55%]`}>
                <p className='overflow-hidden  text-black font-semibold text-sm md:text-md'>{data}</p>
                {withCopyButton && <div>
                    <CopyButton />
                </div>}
            </div>
        </div>
    )
}


function DetailData({ title, fields }) {
    return (
        <div className='space-y-2 '>
            <DetailTitle title={title} />
            <div className='space-y-2.5 px-1'>
                {fields.map((v, _) => {
                    return <DetailField key={v.name} title={v.name} data={v.data} withCopyButton={false} />
                })}
            </div>
        </div>
    )
}



function DetailConfirmation({ open, data, onConfirm, onBack }) {
    return (
        <Modal open={open} showX={true} onClose={onBack}>
            <h2 className='w-full mt-3  absolute left-1/2 transform -translate-x-1/2 top-0 py-2   text-xl 
           text-black font-medium   text-center'>Confirmar Datos</h2>
            <div className='w-full h-full mt-12 mb-2'>
                <div className='w-full px-6 space-y-4  py-2.5'>
                    {data && data.map((v, _) => {
                        return <DetailData key={v.section_name} title={v.section_name} fields={v.section_data} />
                    })}
                </div>
                <div className='flex w-full justify-center  p-4'>

                    <button
                        type="button"
                        className="text-center p-2 bg-primary  text-[whitesmoke] mb-[20px]  
                text-sm rounded-2xl  uppercase w-[100px] h-[40px] font-light "
                        onClick={onConfirm}
                    >Ok</button>
                </div>
            </div>
        </Modal>
    );
}

export default DetailConfirmation;