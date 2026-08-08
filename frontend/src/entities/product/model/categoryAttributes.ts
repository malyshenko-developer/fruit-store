interface AttributeFieldConfig {
  key: string;
  label: string;
  type: "color" | "attribute";
  inLabel: boolean;
}

export const categoryAttributesConfig: Record<string, AttributeFieldConfig[]> = {
  iphone: [
    { key: "storage", label: "Storage", type: "attribute", inLabel: true },
    { key: "color", label: "Color", type: "color", inLabel: true },
    { key: "series", label: "Series", type: "attribute", inLabel: false },
  ],
  mac: [
    { key: "chip", label: "Chip", type: "attribute", inLabel: true },
    { key: "ram", label: "RAM", type: "attribute", inLabel: true },
    { key: "storage", label: "Storage", type: "attribute", inLabel: true },
    { key: "color", label: "Color", type: "color", inLabel: true },
    { key: "series", label: "Series", type: "attribute", inLabel: false },
    { key: "display_type", label: "Display Type", type: "attribute", inLabel: false },
  ],
  watch: [
    { key: "series", label: "Series", type: "attribute", inLabel: false },
    { key: "case_color", label: "Case Color", type: "color", inLabel: true },
    { key: "band_color", label: "Band Color", type: "color", inLabel: true },
  ],
};
