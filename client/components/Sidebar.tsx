import React, { useEffect, useReducer } from 'react';
import axios from 'axios';
import FunnelIcon from './FunnelIcon';

type Item = {
  id: number;
  table: string;
  status: 'detoggled' | 'toggled' | 'half-toggled';
  expanded: boolean;
  displayName?: string;  // Add this line if displayName is supposed to be there
  foreign_id?: number;
  parentTable?: string;
  [key: string]: any;
  children?: Item[];
};


type Action =
  | { type: 'INIT_DATA'; payload: Item[] }
  | { type: 'TOGGLE_STATUS'; id: number; table: string }
  | { type: 'TOGGLE_EXPAND'; id: number; table: string };

  const mapToDisplayName = (item: any) => {
    return item.school || item.subject || item.grade || item.subsection || item.central_requirement || item.central_content || "Unnamed Item";
  };
  
  const mapFlatData = (data: any[]): any[] => {
    return data.map((item: any) => {
      return { 
        ...item, 
        displayName: mapToDisplayName(item),
        foreign_id: item.foreign_id_school || item.foreign_id_subject || item.foreign_id_grade || item.foreign_id_subsection,
        parentTable: item.foreign_id_school ? 'schools' : item.foreign_id_subject ? 'subjects' : item.foreign_id_grade ? 'grades' : item.foreign_id_subsection ? 'subsections' : null
      };
    });
  };
  

  const transformFlatToNested = (flatData: Item[]): Item[] => {
    const map = new Map<number, Item>();
    const roots: Item[] = [];
  
    flatData.forEach((item) => {
      map.set(item.id, { ...item, children: [] });
    });
  
    flatData.forEach((item) => {
      const parent = map.get(item.foreign_id);
      if (parent) {
        parent.children.push(map.get(item.id));
      } else {
        roots.push(map.get(item.id));
      }
    });
  
    return roots;
  };
  

  const handleInitData = (state: Item[], action: { type: 'INIT_DATA'; payload: Item[] }): Item[] => {
    return action.payload;
  };

  const handleToggleStatus = (state: Item[], action: { type: 'TOGGLE_STATUS'; id: number; table: string }): Item[] => {
  return state.map((item) => {
    if (item.id === action.id && item.table === action.table) {
      return { ...item, status: item.status === 'toggled' ? 'detoggled' : 'toggled' };
    }
    if (item.children) {
      item.children = toggleStatusRecursively(item.children, action.id, action.table, item.status);
    }
    return item;
  });
};

const handleToggleExpand = (state: Item[], action: { type: 'TOGGLE_EXPAND'; id: number; table: string }): Item[] => {
  return state.map((item) => {
    if (item.id === action.id && item.table === action.table) {
      return { ...item, expanded: !item.expanded };
    }
    return item;
  });
};


const sidebarReducer = (state: Item[], action: Action): Item[] => {
  switch (action.type) {
    case 'INIT_DATA':
      return handleInitData(state, action);
    case 'TOGGLE_STATUS':
      return handleToggleStatus(state, action);
    case 'TOGGLE_EXPAND':
      return handleToggleExpand(state, action);
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

export default function Sidebar() {
  const [data, dispatch] = useReducer(sidebarReducer, [] as Item[]);

  useEffect(() => {
    axios.get('http://localhost:8080/api/sidebar-data')
      .then(response => {
        const flatData = response.data;
        const mappedData = mapFlatData(flatData);  // Use the new function here
        const nestedData = transformFlatToNested(mappedData);  // If you still want to transform it to nested for the UI
        dispatch({ type: 'INIT_DATA', payload: nestedData });
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });

    // Cleanup function
    return () => {
      console.log('Clean up');
    };
  }, []);

  const handleToggle = (id: number, table: string) => {
    dispatch({ type: 'TOGGLE_STATUS', id, table });
  };
  
  const handleExpand = (id: number, table: string) => {
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
} 