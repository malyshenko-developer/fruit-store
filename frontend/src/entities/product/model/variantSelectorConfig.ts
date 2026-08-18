interface VariantSelectorField {
  key: string;
  label: string;
  type: "color" | "attribute";
}

export const variantSelectorConfig: Record<string, VariantSelectorField[]> = {
  iphone: [
    { key: "color", label: "Цвет", type: "color" },
    { key: "storage", label: "Память", type: "attribute" },
  ],
  mac: [
    { key: "color", label: "Цвет", type: "color" },
    { key: "storage", label: "Объём SSD", type: "attribute" },
  ],
  watch: [{ key: "case_color", label: "Цвет", type: "color" }],
  ipad: [
    { key: "color", label: "Цвет", type: "color" },
    { key: "storage", label: "Память", type: "attribute" },
  ],
  airpods: [{ key: "color", label: "Цвет", type: "color" }],
};
