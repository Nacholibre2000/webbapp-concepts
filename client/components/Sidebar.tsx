import React, { useEffect, useState } from 'react';
import FunnelIcon from './FunnelIcon'; 

type Item = {
  id: number;
  table: string;
  status: 'detoggled' | 'toggled' | 'half-toggled';
  foreign_id?: number;
  parentTable?: string;
  [key: string]: any;  // This allows for additional fields
};

export default function Sidebar() {
  const [data, setData] = useState<Item[]>([]);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [expandedTextItems, setExpandedTextItems] = useState<Set<string>>(new Set());

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
            const newItem = { 
              ...item, 
              displayName: mapToDisplayName(item),
              foreign_id: item.foreign_id_school || item.foreign_id_subject || item.foreign_id_grade || item.foreign_id_subsection,
              parentTable: item.foreign_id_school ? 'schools' : item.foreign_id_subject ? 'subjects' : item.foreign_id_grade ? 'grades' : item.foreign_id_subsection ? 'subsections' : null
            };
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

  const toggleItemAndChildren = (id: number, table: string, items: Item[], newState: 'detoggled' | 'toggled') => {
    // Create a new copy of items
    const newItems = [...items];
    const compositeKey = `${id}-${table}`;
    const itemIndex = newItems.findIndex(i => `${i.id}-${i.table}` === compositeKey);
    
    if (itemIndex !== -1) {
      newItems[itemIndex] = { ...newItems[itemIndex], status: newState };
      if (newItems[itemIndex].children) {
        newItems[itemIndex].children.forEach(child => {
          toggleItemAndChildren(child.id, child.table, newItems, newState);
        });
      }
    }
    setData(newItems);  // Update the state
  };   
  
  const toggleBold = (id: number, table: string, items: Item[]) => {
    const compositeKey = `${id}-${table}`;
    const item = items.find(i => `${i.id}-${i.table}` === compositeKey);
    
    if (item) {
      const newState = item.status === 'toggled' ? 'detoggled' : 'toggled';
      toggleItemAndChildren(id, table, items, newState);
      
      let currentItem = item;
      while (currentItem) {
        updateParentStatus(currentItem, items);
        currentItem = items.find(i => i.id === currentItem.foreign_id && i.table === currentItem.parentTable);
      }
    }
  };
  

  const updateParentStatus = (item: Item, items: Item[]) => {
  if (!item.foreign_id || !item.parentTable) return;

  const parentItem = items.find(i => i.id === item.foreign_id && i.table === item.parentTable);
  if (!parentItem || !parentItem.children) return;

  const childStatuses = new Set(parentItem.children.map(child => child.status));
  
  if (childStatuses.size === 1 && childStatuses.has('toggled')) {
    parentItem.status = 'toggled';
  } else if (childStatuses.size === 1 && childStatuses.has('detoggled')) {
    parentItem.status = 'detoggled';
  } else {
    parentItem.status = 'half-toggled';
  }
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

  const toggleTextExpand = (id: number, table: string) => {
    const compositeKey = `${id}-${table}`;
    const newTextItems = new Set(expandedTextItems);
    if (newTextItems.has(compositeKey)) {
      newTextItems.delete(compositeKey);
    } else {
      newTextItems.add(compositeKey);
    }
    setExpandedTextItems(newTextItems);
  };

  const renderTree = (items: Item[], level: number = 0) => {
    const indent = 10 * level;  // 20 pixels of indentation per level
  
    return (
      <ul style={{ marginLeft: `${indent}px` }}>
        {items.map((item) => (
          <li key={`${item.id}-${item.table}`} className="w-full"> {/* Set width to 100% */}
            <div className={`hover:bg-gray-700 w-full p-2 rounded flex justify-between items-center`}>
              <button 
                className={`text-left text-sm text-base text-gray-400 ${toggledItems.has(`${item.id}-${item.table}`) ? 'font-bold' : 'font-normal'} hover:text-gray-100 block mb-2 w-full text-left`}  
                onClick={() => toggleExpand(item.id, item.table)}
              >
                {/* Updated text display logic */}
                {expandedTextItems.has(`${item.id}-${item.table}`) ? item.displayName : (item.displayName.length > 20 ? item.displayName.substring(0, 20) + '...' : item.displayName)}
              </button>
              {item.displayName.length > 20 && (
                <button onClick={() => toggleTextExpand(item.id, item.table)}>
                  ...
                </button>
              )}
              <button onClick={() => toggleBold(item.id, item.table, data)}>
                <FunnelIcon status={item.status} />
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