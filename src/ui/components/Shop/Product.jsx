import React from 'react';
import { FormatAsFloat } from '../../core/input/InputBox';

import BillIcon from '../../core/icons/BillIcon';

const Product = ({ name, description, price, image, isSelected, onSelect }) => {


    const handleSelect = () => {
        onSelect();
    }

    return (
        <div className="flex items-center p-4 bg-white rounded-lg shadow-md mb-4">
            
            <input
                type="checkbox"
                className="w-5 h-5 mr-4 border-gray-300 rounded"
                checked={isSelected}
                onChange={handleSelect}
            />

            {/* <img
                src={image}
                alt={name}
                className="w-16 h-16 object-contain mr-4"
            /> */}


            <div className="flex-grow">
                <h3 className="text-primary font-medium text-lg">{name}</h3>
                <p className="text-main-bg  text-sm">{description}</p>
            </div>

            <div className="text-right">
                <span className="text-lg font-medium">{FormatAsFloat(price)} Bs</span>
            </div>
        </div>
    );
};

export default Product;