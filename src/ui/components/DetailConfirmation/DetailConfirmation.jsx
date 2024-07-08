import React from 'react';
import Modal from '../../core/modal/Modal';
import CopyButton from '../CopyClipBoard/CopyButton';
import StepButton from '../../core/buttons/StepButton';


function DetailTitle({ open, onClick, title }) {
    return (
        <button className="w-full  py-1 px-1   " onClick={onClick}>
            <h4 className="text-left text-md font-bold text-black ">{title}</h4>
        </button>
    )
}

function DetailField({ title, data, withCopyButton = false }) {
    return (
        <div className="w-full flex justify-between items-center text-sm">
            <h3 className='w-[45%] font-medium'>{`${title}:`}</h3>
            <div className={`flex justify-between items-center space-x-2 w-[55%]`}>
                <p className='overflow-hidden text-ellipsis whitespace-nowrap text-primary font-medium text-sm md:text-md'>{data}</p>
                {withCopyButton && <div>
                    <CopyButton />
                </div>}
            </div>
        </div>
    )
}


function DetailData({ title, fields }) {
    return (
        <div className='space-y-1.5 '>
            <DetailTitle title={title} />
            <div className='space-y-2.5 px-1'>
                {fields.map((v, _) => {
                    return <DetailField key={v.name} title={v.name} data={v.data} withCopyButton={false} />
                })}
            </div>
        </div>
    )
}



function DetailConfirmation({ open, onClose, data, onConfirm, onBack }) {
    return (
        <Modal open={open} showX={false} onClose={onClose}>
            <h2 className='w-full   absolute left-1/2 transform -translate-x-1/2 top-0 py-2   text-xl 
           text-black font-medium   text-center'>Datos de la Operacion</h2>
            <div className='w-full h-full mt-12 mb-2'>
                <div className='w-full px-3 space-y-3 border-y-2 border-slate-200 py-2.5'>
                    {data && data.map((v, _) => {
                        return <DetailData key={v.section_name} title={v.section_name} fields={v.section_data} />
                    })}
                </div>
                <div className='flex w-full justify-between  p-4'>
                    <StepButton nextButton={false} onClick={onBack}>Regresar</StepButton>
                    <StepButton nextButton={true} onClick={onConfirm}>Siguiente</StepButton>
                </div>
            </div>
        </Modal>
    );
}

export default DetailConfirmation;