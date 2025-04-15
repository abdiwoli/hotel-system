// components/MenuCard.tsx

import { MenuItem } from "@/app/models/foodTypes";

interface MenuCardProps {
    item: MenuItem;
    onItemClick: (item: MenuItem) => void;
    onAddToCart: (item: MenuItem) => void;
}

const MenuCard = ({ item, onItemClick, onAddToCart }: MenuCardProps) => {
    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation();
        onAddToCart(item);
    };

    return (
        <div
            className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => onItemClick(item)}
        >
            {item.image ? (
                <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-48 object-cover"
                />
            ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                </div>
            )}
            <div className="p-6">
                <div className="flex justify-between items-start">
                    <h3 className="text-xl font-semibold text-gray-900">{item.name}</h3>
                    <span className="text-lg font-bold text-amber-600">${item.price.toFixed(2)}</span>
                </div>
                <p className="mt-2 text-gray-600 line-clamp-2">{item.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                    {item.isVegetarian && (
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Vegetarian</span>
                    )}
                    {item.isVegan && (
                        <span className="px-2 py-1 text-xs rounded-full bg-emerald-100 text-emerald-800">Vegan</span>
                    )}
                    {item.isGlutenFree && (
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">Gluten Free</span>
                    )}
                </div>
                <button
                    onClick={handleAddToCart}
                    className="mt-4 px-4 py-2 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 transition-colors w-full"
                >
                    Add to the order
                </button>
            </div>
        </div>
    );
};

export default MenuCard;