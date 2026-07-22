interface HasAttributes {
    attributes: Record<string, unknown>;
}

function getString(attrs: Record<string, unknown>, key: string): string | null {
    const value = attrs[key];
    return typeof value === "string" ? value : null;
}

export interface IphoneAttributes {
    color: string | null;
    storage: string | null;
    connectivity: string | null;
}

export function getIphoneAttributes(variant: HasAttributes): IphoneAttributes {
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

export function getMacAttributes(variant: HasAttributes): MacAttributes {
    return {
        color: getString(variant.attributes, "color"),
        chip: getString(variant.attributes, "chip"),
        ram: getString(variant.attributes, "ram"),
        storage: getString(variant.attributes, "storage"),
    }
}

export interface WatchAttributes {
    seriesName: string | null;
    caseColor: string | null;
    bandColor: string | null;
}

export function getWatchAttributes(variant: HasAttributes): WatchAttributes {
    return {
        seriesName: getString(variant.attributes, "series"),
        caseColor: getString(variant.attributes, "case_color"),
        bandColor: getString(variant.attributes, "band_color"),
    };
}

export function getDisplayAttributes(categorySlug: string, variant: HasAttributes): Record<string, string> {
    let attrs: Record<string, string | null>;

    switch (categorySlug) {
        case "iphone":
            attrs = getIphoneAttributes(variant) as unknown as Record<string, string | null>;
            break;
        case "mac":
            attrs = getMacAttributes(variant) as unknown as Record<string, string | null>;
            break;
        case "watch":
            attrs = getWatchAttributes(variant) as unknown as Record<string, string | null>;
            break;
        default:
            attrs = {};
    }

    const result: Record<string, string> = {};
    for (const [key, value] of Object.entries(attrs)) {
        if (value !== null) {
            result[key] = value;
        }
    }

    return result;
}