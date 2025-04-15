// pages/Restaurant.tsx
import { MenuItem } from '@/app/models/foodTypes';
import getMenu from '@/libs/getMenu';
import { useState, useEffect } from 'react';
import MenuCard from './MenuCard';

const Restaurant = () => {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeCategory, setActiveCategory] = useState<string>('all');
    const [cart, setCart] = useState<MenuItem[]>([]);

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                setIsLoading(true);
                const data = await getMenu();
                setMenuItems(data || []);
            } catch (err) {
                setError('Failed to load menu. Please try again later.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMenu();
    }, []);

    // Get unique categories
    const categories = ['all', ...new Set(menuItems.map(item => item.category))];

    // Filter items by category
    const filteredItems = activeCategory === 'all'
        ? menuItems
        : menuItems.filter(item => item.category === activeCategory);

    const handleAddToCart = (item: MenuItem) => {
        setCart([...cart, item]);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border-l-4 border-red-500 p-4">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Our Menu</h1>

            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
                {categories.map(category => (
                    <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeCategory === category
                            ? 'bg-amber-600 text-white'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                            }`}
                    >
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                ))}
            </div>

            {/* Menu Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredItems.map(item => (
                    <MenuCard
                        key={item.id}
                        item={item}
                        onItemClick={setSelectedItem}
                        onAddToCart={handleAddToCart}
                    />
                ))}
            </div>

            {/* Cart Info */}
            {cart.length > 0 && (
                <div className="fixed bottom-8 right-8 bg-white p-4 rounded-lg shadow-lg">
                    <div className="flex items-center gap-2">
                        <span className="font-semibold">Cart: {cart.length} items</span>
                        <button
                            onClick={() => alert('Proceeding to checkout')}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                            Checkout
                        </button>
                    </div>
                </div>
            )}

            {/* Item Detail Modal */}
            {selectedItem && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="relative">
                            {selectedItem.image ? (
                                <img
                                    src={selectedItem.image}
                                    alt={selectedItem.name}
                                    className="w-full h-64 object-cover"
                                />
                            ) : (
                                <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                                    <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                    </svg>
                                </div>
                            )}
                            <button
                                onClick={() => setSelectedItem(null)}
                                className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
                            >
                                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="flex justify-between items-start">
                                <h2 className="text-2xl font-bold text-gray-900">{selectedItem.name}</h2>
                                <span className="text-xl font-bold text-amber-600">${selectedItem.price.toFixed(2)}</span>
                            </div>
                            <div className="mt-2 flex flex-wrap gap-2">
                                <span className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-800">
                                    {selectedItem.category}
                                </span>
                                {selectedItem.isVegetarian && (
                                    <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-800">Vegetarian</span>
                                )}
                                {selectedItem.isVegan && (
                                    <span className="px-3 py-1 text-sm rounded-full bg-emerald-100 text-emerald-800">Vegan</span>
                                )}
                                {selectedItem.isGlutenFree && (
                                    <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800">Gluten Free</span>
                                )}
                            </div>
                            <p className="mt-4 text-gray-700">{selectedItem.description}</p>

                            {selectedItem.ingredients && selectedItem.ingredients.length > 0 && (
                                <div className="mt-6">
                                    <h3 className="text-lg font-semibold text-gray-900">Ingredients</h3>
                                    <ul className="mt-2 list-disc list-inside text-gray-600">
                                        {selectedItem.ingredients.map((ingredient, index) => (
                                            <li key={index}>{ingredient}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div className="mt-8 flex justify-end">
                                <button
                                    onClick={() => {
                                        handleAddToCart(selectedItem);
                                        setSelectedItem(null);
                                    }}
                                    className="px-6 py-3 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 transition-colors"
                                >
                                    Add to Order
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Restaurant;