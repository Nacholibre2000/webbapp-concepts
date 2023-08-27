import React, { useEffect, useState } from 'react';

type Item = {
  id: number;
  name: string;
  table: string;
  children?: Item[];
};

export default function Sidebar() {
  const [data, setData] = useState<Item[]>([]);

  useEffect(() => {
    // Fetch initial data from the 'schools' table
    fetch('http://localhost:8080/api/sidebar-data')
      .then((res) => res.json())
      .then((schools) => {
        console.log("Schools from API:", schools);  // Debugging line
        const schoolItems: Item[] = schools.map((school: any, index: number) => ({
          id: school.id,  // Your API returns an 'id' field
          name: school.school,  // Your API returns a 'school' field, not 'name'
          table: 'Schools',
        }));
        setData(schoolItems);
      });
  }, []);  

  const fetchRelatedItems = (item: Item) => {
    fetch(`http://localhost:8080/api/related_items/${item.table}/${item.id}`)
      .then((res) => res.json())
      .then((relatedItems) => {
        console.log("Related Items from API:", relatedItems); // debugging
        item.children = relatedItems.map((relatedItem: any, index: number) => ({
          id: relatedItem.id,
          name: relatedItem.name,
          table: getNextTable(item.table),
        }));
        setData([...data]);
        console.log("Updated data state:", data); // debugging
      });
  };

  const getNextTable = (currentTable: string) => {
    // Implement your logic here
    // For example:
    if (currentTable === 'Schools') return 'Subjects';
    // Add more conditions for other tables
  };  

  const renderTree = (items: Item[]) => {
    return (
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <button 
              className="text-sm text-base text-gray-400 font-normal hover:text-gray-100 font-bold block mb-2"
              onClick={() => fetchRelatedItems(item)}
            >
              {item.name}
            </button>
            {item.children && renderTree(item.children)}
          </li>
        ))}
      </ul>
    );
  };

  return <aside className="bg-gray-800 text-white w-80 p-10">{renderTree(data)}</aside>;
}
