import React, { useEffect, useState } from 'react';

type Item = {
  id: number;
  table: string;
  [key: string]: any;  // This allows for additional fields
};

export default function Sidebar() {
  const [data, setData] = useState<Item[]>([]);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [toggledItems, setToggledItems] = useState<Set<string>>(new Set());

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

  const toggleBold = (id: number, table: string, items: Item[]) => {
    const compositeKey = `${id}-${table}`;
    const newToggledItems = new Set(toggledItems);
    if (newToggledItems.has(compositeKey)) {
      newToggledItems.delete(compositeKey);
    } else {
      newToggledItems.add(compositeKey);
    }
    setToggledItems(newToggledItems);
  };

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
    const indent = 10 * level;  // 20 pixels of indentation per level

    return (
      <ul style={{ marginLeft: `${indent}px` }}>
        {items.map((item) => (
          <li key={`${item.id}-${item.table}`}>
            <div className="hover:bg-gray-700 p-2 rounded flex justify-between items-center">
              <button 
                className={`text-left text-sm text-base text-gray-400 font-normal hover:text-gray-100 ${toggledItems.has(`${item.id}-${item.table}`) ? 'font-bold' : ''} block mb-2`}
                onClick={() => toggleExpand(item.id, item.table)}
              >
                {item.displayName.length > 20 ? item.displayName.substring(0, 20) + '...' : item.displayName || "Unnamed Item"}
              </button>
              {item.displayName.length > 20 && (
                <button onClick={() => toggleExpand(item.id, item.table)}>
                  ...
                </button>
              )}
              <button onClick={() => toggleBold(item.id, item.table, data)}>
                <i className={`far fa-circle ${toggledItems.has(`${item.id}-${item.table}`) ? 'fas fa-circle' : ''}`}></i>
              </button>
            </div>
            {expandedItems.has(`${item.id}-${item.table}`) && item.children && renderTree(item.children, level + 1)}
          </li>
        ))}
      </ul>
    );
  };

  return <aside className="bg-gray-800 text-white w-80 p-10">{renderTree(data)}</aside>;
}