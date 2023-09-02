import React, { useEffect, useState } from 'react';

type Item = {
  id: number;
  table: string;
  [key: string]: any;  // This allows for additional fields
};

export default function Sidebar() {
  const [data, setData] = useState<Item[]>([]);
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetch('http://localhost:8080/api/sidebar-data')
      .then((res) => res.json())
      .then((allData) => {
        const mapToDisplayName = (item: any) => {
          if ('school' in item) return item.school;
          if ('subject' in item) return item.subject;
          // Add more conditions here for other tables
          // Example:
          // if ('grade' in item) return item.grade;
          // if ('subsection' in item) return item.subsection;
          return "Unnamed Item";
        };        

        const mappedData = allData.map((item: any) => ({
          ...item,
          displayName: mapToDisplayName(item),
        }));

        setData(mappedData);
      });
  }, []);

  const toggleExpand = (id: number) => {
    const newExpandedItems = new Set(expandedItems);
    if (newExpandedItems.has(id)) {
      newExpandedItems.delete(id);
    } else {
      newExpandedItems.add(id);
    }
    setExpandedItems(newExpandedItems);
  };

  const renderTree = (items: Item[], level: number = 0) => {
    if (level >= 2) return null;

    return (
      <ul>
        {items.map((item) => (
          <li key={`${item.id}-${item.table}`}>
            <button 
              className="text-sm text-base text-gray-400 font-normal hover:text-gray-100 font-bold block mb-2"
              onClick={() => toggleExpand(item.id)}
            >
              {item.displayName || "Unnamed Item"}
            </button>
            {expandedItems.has(item.id) && item.children && renderTree(item.children, level + 1)}
          </li>
        ))}
      </ul>
    );
  };

  return <aside className="bg-gray-800 text-white w-80 p-10">{renderTree(data)}</aside>;
}
