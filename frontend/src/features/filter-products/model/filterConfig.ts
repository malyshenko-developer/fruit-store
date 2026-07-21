interface FilterFieldConfig {
    paramName: string;
    label: string;
    type: "color" | "attribute";
}

export const categoryFilterConfig: Record<string, FilterFieldConfig[]> = {
    iphone: [
        { paramName: "color", label: "Color", type: "color" },
        { paramName: "series", label: "Series", type: "attribute" },
        { paramName: "storage", label: "Storage", type: "attribute" },
    ],
    mac: [
        { paramName: "color", label: "Color", type: "color" },
        { paramName: "series", label: "Series", type: "attribute" },
        { paramName: "chip", label: "Chip", type: "attribute" },
        { paramName: "ram", label: "RAM", type: "attribute" },
        { paramName: "display_type", label: "Display Type", type: "attribute" },
    ],
    watch: [
        { paramName: "case_color", label: "Case Color", type: "color" },
        { paramName: "band_color", label: "Band Color", type: "color" },
        { paramName: "series", label: "Series", type: "attribute" },
    ],
};