// components/Sidebar.tsx
import { useEffect, useState } from 'react';

export default function Sidebar() {
  const [data, setData] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('http://localhost:8080/api/sidebar-data');
      const json = await res.json();
      setData(json);
    };
    fetchData();
  }, []);

  return (
    <aside className="bg-gray-800 text-white w-80 p-10">
      {/* Sidebar content here */}
      {data.map((item, index) => (
        <button key={index} className="text-sm text-base text-gray-400 font-normal hover:text-gray-100 font-bold block mb-2">
          {item}
        </button>
      ))}
    </aside>
  );
}
