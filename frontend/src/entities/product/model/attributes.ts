import {Product} from "./types";

function getString(attrs: Record<string, unknown>, key: string): string | null {
    const value = attrs[key];
    return typeof value === "string" ? value : null;
}

export interface IphoneAttributes {
    color: string | null;
    storage: string | null;
    connectivity: string | null;
}

export function getIphoneAttributes(product: Product): IphoneAttributes {
    return {
        color: getString(product.attributes, "color"),
        storage: getString(product.attributes, "storage"),
        connectivity: getString(product.attributes, "connectivity"),
    }
}

export interface MacAttributes {
    color: string | null;
    chip: string | null;
    ram: string | null;
    storage: string | null;
}

export function getMacAttributes(product: Product): MacAttributes {
    return {
        color: getString(product.attributes, "color"),
        chip: getString(product.attributes, "chip"),
        ram: getString(product.attributes, "ram"),
        storage: getString(product.attributes, "storage"),
    }
}