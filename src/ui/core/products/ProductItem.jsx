function ProductItem({ title, subtitle = "Descripción", price, quantity = 1, image }) {
    return (
            
            <div className="bg-white p-3.5 rounded-lg flex justify-center items-center gap-3.5">
                
                <div className="w-16 h-16 rounded-lg overflow-hidden">
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="flex h-full w-full justify-between ">
                    <div className="flex flex-col ">
                        <h3 className="text-sm font-medium text-gray-800 uppercase">{title}</h3>
                        <p className="text-xs text-gray-700">{subtitle}</p>
                    </div>

                    <div className="flex h-full flex-col  items-end">
                        <p className="text-xs text-black">X{quantity}</p>
                        <span className="text-lg text-black  mt-1">${price.toFixed(2)}</span>
                    </div>

                </div>

            </div>

           
    );
}

export default ProductItem;