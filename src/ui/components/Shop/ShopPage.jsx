import React, { useState } from 'react';
import BuyBox from './BuyBox';
import Product from './Product';
import Logo from '../../core/logo/Logo';

export default function ShopPage({ onPay }) {
    // Sample product data - replace with your actual data source
    const products = [
        {
            id: 1,
            name: 'Factura 1',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum consequatur adipisci.',
            price: 15000.00,
            image: '/path-to-image-1.jpg'
        },
        {
            id: 2,
            name: 'Factura 2',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum consequatur adipisci.',
            price: 25000.00,
            image: '/path-to-image-2.jpg'
        },
        {
            id: 3,
            name: 'Factura 3',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum consequatur adipisci.',
            price: 35000.00,
            image: '/path-to-image-3.jpg'
        },
        {
            id: 4,
            name: 'Factura 4',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum consequatur adipisci.',
            price: 45000.00,
            image: '/path-to-image-4.jpg'
        },
        // ... add other products
    ];

    const [selectedProducts, setSelectedProducts] = useState([]);

    const handleProductSelect = (productId) => {
        setSelectedProducts(prev => {
            if (prev.includes(productId)) {
                return prev.filter(id => id !== productId);
            }
            return [...prev, productId];
        });
    };

    const totalAmount = products
        .filter(product => selectedProducts.includes(product.id))
        .reduce((sum, product) => sum + product.price, 0);

    return (
        <div className="md:flex  md:justify-center gap-4 w-full 
        max-w-[1400px] mx-auto px-4 py-8">



            <div className='flex flex-col items-center space-y-4 md:order-last md:w-1/2'>

                <div className='w-3/4'>
                    <Logo />
                </div>
                
                <BuyBox
                    invoiceCount={selectedProducts.length}
                    totalAmount={totalAmount}
                    onPay={onPay}
                />

            </div>

            <div className="md:order-first md:w-1/2">
                {products.map(product => (
                    <Product
                        key={product.id}
                        {...product}
                        isSelected={selectedProducts.includes(product.id)}
                        onSelect={() => handleProductSelect(product.id)}
                    />
                ))}
            </div>
        </div>
    );
}