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
  
        let newChildren: Item[] = [];
  
        if (item.table === 'Grades') {
          // Special handling for 'Grades' which has related items in two tables
          newChildren = [
            ...relatedItems.subsections.map((subsection: any) => ({
              id: subsection.id,
              name: subsection.subsection,
              table: 'Subsections',
            })),
            ...relatedItems.central_requirements.map((centralRequirement: any) => ({
              id: centralRequirement.id,
              name: centralRequirement.central_requirement,
              table: 'Central_requirements',
            })),
          ];
        } else {
          // General handling for other tables
          let nameField = 'name';  // default
          if (item.table === 'Schools') nameField = 'subject';
          if (item.table === 'Subjects') nameField = 'grade';
          if (item.table === 'Subsections') nameField = 'central_content';
  
          newChildren = relatedItems.map((relatedItem: any) => ({
            id: relatedItem.id,
            name: relatedItem[nameField],
            table: getNextTable(item.table),
          }));
        }
  
        const newData = data.map((dataItem) => {
          if (dataItem.id === item.id) {
            return { ...dataItem, children: newChildren };
          }
          return dataItem;
        });
  
        setData(newData);
        console.log("Updated data state:", newData); // debugging
      });
  };
    
  const getNextTable = (currentTable: string) => {
    if (currentTable === 'Schools') return 'Subjects';
    if (currentTable === 'Subjects') return 'Grades';
    if (currentTable === 'Grades') return 'Subsections';
    // Add more conditions for other tables
    return null;  // or some default value
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
