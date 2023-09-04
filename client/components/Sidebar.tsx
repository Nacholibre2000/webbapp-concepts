import React, { useEffect, useState } from 'react';

type Item = {
  id: number;
  table: string;
  [key: string]: any;  // This allows for additional fields
};

export default function Sidebar() {
  const [data, setData] = useState<Item[]>([]);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    //console.log("Running useEffect");  // Debugging line
    fetch('http://localhost:8080/api/sidebar-data')
      .then((res) => res.json())
      .then((allData) => {
        //console.log("All data from API:", allData);  // Debugging line
  
        const mapToDisplayName = (item: any) => {
          return item.school || item.subject || item.grade || item.subsection || item.central_requirement || item.central_content || "Unnamed Item";
        };
  
        const mapDataRecursively = (data: any[]): any[] => {
          return data.map((item: any) => {
            //console.log("Mapping item:", item);  // Debugging line
            const newItem = { ...item, displayName: mapToDisplayName(item) };
            if (item.children) {
              newItem.children = mapDataRecursively(item.children);
            }
            return newItem;
          });
        };        
  
        const mappedData = mapDataRecursively(allData);
        setData(mappedData);
        setExpandedItems(new Set());  // Reset the expanded items
      });
  }, []);  

  const toggleExpand = (id: number, table: string) => {
    //console.log("Toggling item with id and table:", id, table);  // Debugging line
    const compositeKey = `${id}-${table}`;
    const newExpandedItems = new Set(expandedItems);
    if (newExpandedItems.has(compositeKey)) {
      newExpandedItems.delete(compositeKey);
    } else {
      newExpandedItems.add(compositeKey);
    }
    //console.log("New expanded items:", newExpandedItems);  // Debugging line
    setExpandedItems(newExpandedItems);
  };

  const renderTree = (items: Item[], level: number = 0) => {
    //console.log("Items at level", level, ":", items);
  
    const indent = 10 * level;  // 20 pixels of indentation per level
  
    return (
      <ul style={{ marginLeft: `${indent}px` }}>
        {items.map((item) => (
          <li key={`${item.id}-${item.table}`}>
            {/* Update onClick handler to pass both id and table */}
            <button 
              className="text-sm text-base text-gray-400 font-normal hover:text-gray-100 font-bold block mb-2"
              onClick={() => toggleExpand(item.id, item.table)}
            >
              {item.displayName || "Unnamed Item"}
              {item.displayName || "Unnamed Item"}
            </button>
            {/* Update condition to check for expanded items */}
            {expandedItems.has(`${item.id}-${item.table}`) && item.children && renderTree(item.children, level + 1)}
          </li>
        ))}
      </ul>
    );
  };
  

  return <aside className="bg-gray-800 text-white w-80 p-10">{renderTree(data)}</aside>;
}
