"use client";
import { Dispatch, SetStateAction, createContext } from "react";

interface ThemeContextType {
    theme: boolean;
    setTheme: Dispatch<SetStateAction<boolean>>;
}

const ThemeContext = createContext<ThemeContextType>({
    theme: false,
    setTheme: () => null
});

export default ThemeContext;