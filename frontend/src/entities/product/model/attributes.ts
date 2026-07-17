import {ProductVariant} from "./types";

function getString(attrs: Record<string, unknown>, key: string): string | null {
    const value = attrs[key];
    return typeof value === "string" ? value : null;
}

export interface IphoneAttributes {
    color: string | null;
    storage: string | null;
    connectivity: string | null;
}

export function getIphoneAttributes(variant: ProductVariant): IphoneAttributes {
    return {
        color: getString(variant.attributes, "color"),
        storage: getString(variant.attributes, "storage"),
        connectivity: getString(variant.attributes, "connectivity"),
    }
}

export interface MacAttributes {
    color: string | null;
    chip: string | null;
    ram: string | null;
    storage: string | null;
}

export function getMacAttributes(variant: ProductVariant): MacAttributes {
    return {
        color: getString(variant.attributes, "color"),
        chip: getString(variant.attributes, "chip"),
        ram: getString(variant.attributes, "ram"),
        storage: getString(variant.attributes, "storage"),
    }
}