import { useState } from 'react';
import ProductItem from './ProductItem';
import { isMobile } from 'react-device-detect';

function ProductList({ products }) {

    const [showAll, setShowAll] = useState(false);

    const displayedItems = showAll ? products : (products.length > 3 ? products.slice(0, 3) : products);

    return (
        <div className="space-y-4 p-4 max-w-2xl mx-auto">
            <div className="flex justify-between items-center ">
                <h2 className="text-2xl font-bold text-white">Total de Productos: {products.length}</h2>
                {!isMobile && products.length > 3 && (
                    <button
                        onClick={() => setShowAll(!showAll)}
                        className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:bg-gray-100 transition-all duration-300"
                    >
                        <svg
                            className={`absolute transition-opacity duration-300 ${showAll ? 'opacity-100' : 'opacity-0'}`}
                            width='12'
                            height='12'
                            viewBox='0 0 10 10'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                        >
                            <path d='M1.22229 5.00019H8.77785' stroke='black' strokeWidth='1.6' strokeLinecap='round' strokeLinejoin='round'></path>
                        </svg>
                        <svg
                            className={`absolute transition-opacity duration-300 ${showAll ? 'opacity-0' : 'opacity-100'}`}
                            width='12'
                            height='12'
                            viewBox='0 0 10 10'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                        >
                            <path d='M1.22229 5.00019H8.77785M5.00007 8.77797V1.22241' stroke='black' strokeWidth='1.6' strokeLinecap='round' strokeLinejoin='round'></path>
                        </svg>
                    </button>
                )}
            </div>

            {isMobile ? (
                <div className='flex flex-col gap-2 p-1 max-h-[300px] overflow-y-auto'>
                    {products.map(item => (
                        <ProductItem
                            key={item.id}
                            title={item.title}
                            price={item.price}
                            quantity={item.quantity}
                            image={item.image}
                        />
                    ))}
                </div>
            ) : (
                <div className='flex flex-col gap-2 p-1 max-h-[500px] overflow-y-auto'>
                    {displayedItems.map(item => (
                        <ProductItem
                            key={item.id}
                            title={item.title}
                            price={item.price}
                            quantity={item.quantity}
                            image={item.image}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default ProductList;



