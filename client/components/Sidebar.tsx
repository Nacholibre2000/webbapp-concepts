import React, { useEffect, useReducer } from 'react';
import io from 'socket.io-client';
import FunnelIcon from './FunnelIcon';

const socket = io('http://localhost:8080');  

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
    socket.on('connect', () => {
      console.log('Frontend: Connected to the server');
    });
  
    socket.on('initial_data', (initialData) => {
      console.log('Frontend: Received initial data:', initialData);
      dispatch({ type: 'INIT_DATA', payload: initialData });
    });
  
    socket.on('next_level_data', (nextLevelData) => {
      console.log('Frontend: Received next level data:', nextLevelData);
      // Add your state update logic here if needed
    });
  
    return () => {
      socket.disconnect();
      console.log('Frontend: Disconnected from the server');
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