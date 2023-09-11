import React, { useEffect, useState } from 'react';

const Sidebar = () => {
  const [data, setData] = useState(null); // Initialize with null

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('http://localhost:8080/api/sidebar-data');
      const result = await response.json();
      setData(result);
      console.log('Sidebar data fetched:', result); // Log the fetched data
    };

    fetchData();

    return () => {
      // Cleanup function
      console.log('Cleaning up...');
    };
  }, []);

  return (
    <div>
      <h1>Sidebar</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre> {/* Display the fetched data */}
    </div>
  );
};

export default Sidebar;




/* import React, { useEffect, useReducer } from 'react';
import FunnelIcon from './FunnelIcon';

type Item = {
  id: number;
  table: string;
  status: 'detoggled' | 'toggled' | 'half-toggled';
  expanded: boolean;
  foreign_id?: number;
  parentTable?: string;
  [key: string]: any;
};

type Action =
  | { type: 'INIT_DATA'; payload: Item[] }
  | { type: 'TOGGLE_STATUS'; id: number; table: string }
  | { type: 'TOGGLE_EXPAND'; id: number; table: string };

const sidebarReducer = (state: Item[], action: Action) => {
  console.log("Reducer called with action:", action);
  let newState: Item[] = [];
  switch (action.type) {
    case 'INIT_DATA':
      return action.payload;

    case 'TOGGLE_STATUS':
      newState = state.map((item) => {
        if (item.id === action.id && item.table === action.table) {
          return { ...item, status: item.status === 'toggled' ? 'detoggled' : 'toggled' };
        }
        if (item.children) {
          // Recursive call to update children
          item.children = toggleStatusRecursively(item.children, action.id, action.table, item.status);
        }
        return item;
      });
      // Here you can add logic to update the parent status
      newState.forEach((item) => {
        updateParentStatus(item, newState);
      });
      return newState;

      case 'TOGGLE_EXPAND':
        newState = state.map((item) => {
          if (item.id === action.id && item.table === action.table) {
            return { ...item, expanded: !item.expanded };
          }        
          return item;
        });
        return newState;
      

    default:
      return state;
  }
};

const toggleStatusRecursively = (data: Item[], id: number, table: string, newStatus: 'detoggled' | 'toggled' | 'half-toggled'): Item[] => {
  return data.map((item) => {
    if (item.id === id && item.table === table) {
      return { ...item, status: newStatus };
    }
    if (item.children) {
      return { ...item, children: toggleStatusRecursively(item.children, id, table, newStatus) };
    }
    return item;
  });
};


const updateParentStatus = (item: Item, items: Item[]) => {
  if (!item.foreign_id || !item.parentTable) return;

  const parentItem = items.find(i => i.id === item.foreign_id && i.table === item.parentTable);
  if (!parentItem || !parentItem.children) return;

  const childStatuses = new Set(parentItem.children.map((child: Item) => child.status));
  
  if (childStatuses.size === 1 && childStatuses.has('toggled')) {
    parentItem.status = 'toggled';
  } else if (childStatuses.size === 1 && childStatuses.has('detoggled')) {
    parentItem.status = 'detoggled';
  } else {
    parentItem.status = 'half-toggled';
  }
};

export default function Sidebar() {
  console.log("Sidebar component rendered");
  const [data, dispatch] = useReducer(sidebarReducer, []);

  useEffect(() => {
    console.log("Data state changed:", data);
    try {
      fetch('http://localhost:8080/api/sidebar-data')
        .then((res) => res.json())
        .then((allData) => {
          console.log("All data from API:", allData);  // Debugging line
    
          const mapToDisplayName = (item: any) => {
            return item.school || item.subject || item.grade || item.subsection || item.central_requirement || item.central_content || "Unnamed Item";
          };
    
          const mapDataRecursively = (data: any[]): any[] => {
            return data.map((item: any) => {
              const newItem = { 
                ...item, 
                status: 'detoggled',  
                expanded: false,  // Initialize here
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
          dispatch({ type: 'INIT_DATA', payload: mappedData });
        });
    } catch (error) {
      console.error("An error occurred:", error);
    }
    return () => {
      console.log('Component will unmount');
    };
  }, []); 
  
  const handleToggle = (id: number, table: string) => {
    console.log("handleToggle called with id and table:", id, table);
    dispatch({ type: 'TOGGLE_STATUS', id, table });
  };
  
  const handleExpand = (id: number, table: string) => {
    console.log("handleExpand called with id and table:", id, table);
    dispatch({ type: 'TOGGLE_EXPAND', id, table });
  };
  

  const renderTree = (items: Item[], level: number = 0) => {
    const indent = 10 * level;

    return (
      <ul style={{ marginLeft: `${indent}px` }}>
        {items.map((item) => (
          <li key={`${item.id}-${item.table}`} className="w-full">
            <div className={`hover:bg-gray-700 w-full p-2 rounded flex justify-between items-center`}>
              <button 
                className={`text-left text-sm text-base text-gray-400 ${item.status === 'toggled' ? 'font-bold' : 'font-normal'} hover:text-gray-100 block mb-2 w-full text-left`}  
                onClick={() => handleExpand(item.id, item.table)}
              >
                {item.expanded ? item.displayName : (item.displayName.length > 20 ? item.displayName.substring(0, 20) + '...' : item.displayName)}
              </button>
              <button onClick={() => handleToggle(item.id, item.table)}>
                <FunnelIcon status={item.status} />
              </button>
            </div>
            {item.expanded && item.children && renderTree(item.children, level + 1)}
          </li>
        ))}
      </ul>
    );
  };

  return <aside className="bg-gray-800 text-white w-80 p-10">{renderTree(data)}</aside>;
} */