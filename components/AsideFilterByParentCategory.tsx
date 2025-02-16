import { Checkbox } from "@/components/ui/checkbox";

const TYPE_FILTERS = [
  { id: 'food', label: 'Food' },
  { id: 'beverages', label: 'Beverages' },
  { id: 'condiments', label: 'Condiments' },
] as const;

export type ParentCategory = typeof TYPE_FILTERS[number]['id'];

interface AsideFilterByTypesProps {
  selectedTypes: ParentCategory[];
  onChange: (types: ParentCategory[]) => void;
}

export const AsideFilterByParentCategory = ({ 
  selectedTypes, 
  onChange 
}: AsideFilterByTypesProps) => {
  const handleTypeToggle = (typeId: ParentCategory) => {
    if (selectedTypes.includes(typeId)) {
      onChange(selectedTypes.filter(id => id !== typeId));
    } else {
      onChange([...selectedTypes, typeId]);
    }
  };

  return (
    <section className="mt-6">
      <h3 className="text-stone-900 text-sm font-bold mb-2">Show</h3>
      
      <div className="flex flex-col space-y-0">
        {TYPE_FILTERS.map(({ id, label }) => (
          <label
            key={id}
            htmlFor={id}
            className="flex items-center space-x-2 px-1 py-1 rounded-md hover:bg-stone-200 cursor-pointer"
          >
            <Checkbox
              id={id}
              checked={selectedTypes.includes(id)}
              onCheckedChange={() => handleTypeToggle(id)}
            />
            <span className="text-sm font-medium leading-none">
              {label}
            </span>
          </label>
        ))}
      </div>
    </section>
  );
};