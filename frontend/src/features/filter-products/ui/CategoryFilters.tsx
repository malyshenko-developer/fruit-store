import { categoryFilterConfig } from "../model/filterConfig";
import { AttributeFilter } from "./AttributeFilter";
import { ColorFilter } from "./ColorFilter";

interface Props {
    categorySlug: string;
    availableAttributes: Record<string, string[]>;
}

export function CategoryFilters({ categorySlug, availableAttributes }: Props) {
    const fields = categoryFilterConfig[categorySlug] ?? [];

    return (
        <div className="space-y-6">
            {fields.map((field) => {
                const options = availableAttributes[field.paramName] ?? [];

                if (field.type === "color") {
                    return (
                        <ColorFilter
                            key={field.paramName}
                            paramName={field.paramName}
                            label={field.label}
                            options={options}
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