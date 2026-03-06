// src/types/header.ts
export interface HeaderProps {
    title: string;
    logoUrl: string;
    navLinks: NavLink[];
}

export interface NavLink {
    label: string;
    url: string;
}

// src/components/Header.tsx
import React from 'react';
import { HeaderProps } from '../types/header';

const Header: React.FC<HeaderProps> = ({ title, logoUrl, navLinks }) => {
    if (!title) {
        console.warn("Title must be a non-empty string.");
    }
    if (!/^https?:\/\/.+\.(jpg|jpeg|png|gif|svg)$/.test(logoUrl)) {
        throw new Error("logoUrl must be a valid image URL.");
    }
    if (!Array.isArray(navLinks) || navLinks.length === 0) {
        throw new Error("navLinks must be a non-empty array of objects with 'label' and 'url'.");
    }
    navLinks.forEach(link => {
        if (typeof link.label !== 'string' || typeof link.url !== 'string') {
            throw new Error("Each navLink must be an object with 'label' and 'url' as strings.");
        }
    });

    return (
        <header className="flex items-center justify-between p-4 bg-blue-500 text-white">
            <img src={logoUrl} alt={title} className="h-12" />
            <h1 className="text-2xl">{title}</h1>
            <nav>
                {navLinks.map(link => (
                    <a key={link.url} href={link.url} className="mr-4 hover:underline">{link.label}</a>
                ))}
            </nav>
        </header>
    );
};

export default Header;