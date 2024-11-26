import React from 'react';

import { FormatAsFloat } from '../../core/input/InputBox';

const BuyBox = ({ invoiceCount, totalAmount, onPay }) => {
    return (
        <div className="border border-primary rounded-lg p-6 w-full">
            <h2 className="text-primary text-xl font-medium text-center mb-4">
                Facturación de Productos
            </h2>

            <div className="flex justify-between mb-3">
                <span>Cantidad de facturas:</span>
                <span>{invoiceCount}</span>
            </div>

            <div className="flex justify-between mb-4 text-lg">
                <span>Total a pagar:</span>
                <span className='font-bold'>{FormatAsFloat(totalAmount)} Bs</span>
            </div>

            <button className="w-full bg-primary text-white py-3 rounded-md 
        transition-colors uppercase" onClick={(e) => {
                    if (invoiceCount <= 0 || totalAmount <= 0) {
                        alert("No hay productos seleccionados");
                        return;
                    }
                    onPay(totalAmount);
                }}>
                Ir a pagar
            </button>
        </div>
    );
};

export default BuyBox;