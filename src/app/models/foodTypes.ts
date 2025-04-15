// types.ts
export interface MenuItem {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    image?: string;
    ingredients?: string[];
    isVegetarian?: boolean;
    isVegan?: boolean;
    isGlutenFree?: boolean;
}