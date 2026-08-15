interface AttributeFieldConfig {
  key: string;
  label: string;
  type: "color" | "attribute";
  inLabel: boolean;
}

export const categoryAttributesConfig: Record<string, AttributeFieldConfig[]> = {
  iphone: [
    { key: "series", label: "Серия", type: "attribute", inLabel: false },
    { key: "storage", label: "Память", type: "attribute", inLabel: true },
    { key: "color", label: "Цвет", type: "color", inLabel: true },
    { key: "screen_size", label: "Диагональ экрана", type: "attribute", inLabel: false },
  ],
  mac: [
    { key: "series", label: "Серия", type: "attribute", inLabel: false },
    { key: "screen_size", label: "Диагональ экрана", type: "attribute", inLabel: false },
    { key: "display_type", label: "Тип дисплея", type: "attribute", inLabel: false },
    { key: "chip", label: "Процессор", type: "attribute", inLabel: true },
    { key: "storage", label: "Память", type: "attribute", inLabel: true },
    { key: "ram", label: "Оперативная память", type: "attribute", inLabel: true },
    { key: "color", label: "Цвет", type: "color", inLabel: true },
  ],
  watch: [
    { key: "series", label: "Серия", type: "attribute", inLabel: false },
    { key: "screen_size", label: "Диагональ экрана (мм)", type: "attribute", inLabel: false },
    { key: "case_color", label: "Цвет корпуса", type: "color", inLabel: true },
    { key: "band_color", label: "Цвет ремешка", type: "color", inLabel: true },
  ],
  ipad: [
    { key: "series", label: "Серия", type: "attribute", inLabel: false },
    { key: "screen_size", label: "Диагональ экрана (дюймы)", type: "attribute", inLabel: false },
    { key: "display_type", label: "Тип дисплея", type: "attribute", inLabel: false },
    { key: "resolution", label: "Разрешение", type: "attribute", inLabel: false },
    { key: "storage", label: "Память", type: "attribute", inLabel: true },
    { key: "ram", label: "Объём оперативной памяти", type: "attribute", inLabel: true },
    { key: "color", label: "Цвет", type: "color", inLabel: true },
  ],
  airpods: [
    { key: "series", label: "Серия", type: "attribute", inLabel: false },
    { key: "color", label: "Цвет", type: "color", inLabel: true },
    { key: "type", label: "Тип наушников", type: "attribute", inLabel: false },
  ],
};
