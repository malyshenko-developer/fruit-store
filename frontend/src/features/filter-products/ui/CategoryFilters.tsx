import { categoryFilterConfig } from "../model/filterConfig";
import { AttributeFilter } from "./AttributeFilter";
import { ColorFilter } from "./ColorFilter";
import { RangeFilter } from "./RangeFilter";

interface Props {
  categorySlug: string;
  availableAttributes: Record<string, string[]>;
  colors: Record<string, string>;
  priceRange: { min: number; max: number };
}

export function CategoryFilters({ categorySlug, availableAttributes, colors, priceRange }: Props) {
  const fields = categoryFilterConfig[categorySlug] ?? [];

  return (
    <div className="space-y-6">
      <RangeFilter
        minParam="min_price"
        maxParam="max_price"
        label="Цена"
        absoluteMin={priceRange.min}
        absoluteMax={priceRange.max}
      />
      {/*<RangeFilter minParam="min_screen_size" maxParam="max_screen_size" label="Screen Size" unit="inches" />*/}

      {fields.map((field) => {
        const options = availableAttributes[field.paramName] ?? [];

        if (field.type === "color") {
          return (
            <ColorFilter
              key={field.paramName}
              paramName={field.paramName}
              label={field.label}
              options={options}
              colors={colors}
            />
          );
        }

        return (
          <AttributeFilter
            key={field.paramName}
            paramName={field.paramName}
            label={field.label}
            options={options}
          />
        );
      })}
    </div>
  );
}
