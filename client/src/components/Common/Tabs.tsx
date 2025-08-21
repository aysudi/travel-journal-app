import { useState } from "react";

export interface TabItem {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  items: TabItem[];
  children: React.ReactNode[];
  defaultValue?: string;
}

const Tabs = ({ items, children, defaultValue }: TabsProps) => {
  const [active, setActive] = useState(defaultValue || items[0].value);

  return (
    <div>
      <div className="flex gap-2 border-b border-gray-200 mb-6 overflow-x-auto">
        {items.map((item) => (
          <button
            key={item.value}
            className={`flex items-center gap-2 px-4 py-2 text-base font-medium rounded-t-lg transition-all duration-200 focus:outline-none border-b-2 -mb-px whitespace-nowrap cursor-pointer ${
              active === item.value
                ? "border-indigo-500 text-indigo-700 bg-indigo-50 shadow"
                : "border-transparent text-gray-500 hover:text-indigo-600 hover:bg-gray-50"
            }`}
            onClick={() => setActive(item.value)}
            type="button"
          >
            {item.icon && <span>{item.icon}</span>}
            {item.label}
          </button>
        ))}
      </div>
      <div>
        {children.map((child, idx) =>
          items[idx].value === active ? (
            <div key={items[idx].value}>{child}</div>
          ) : null
        )}
      </div>
    </div>
  );
};

export default Tabs;
