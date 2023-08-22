// components/Navbar.tsx
export default function Navbar() {
    return (
      <nav className="bg-gray-800 text-white p-4">
        <div className="container mx-auto">
          <div className="flex justify-start">
            <a href="/" className="text-2xl font-bold pl-20 pr-40">Kursplaner</a>
            <div>
              <button className="mx-16 hover:text-gray-300">Begrepp</button>
              <button className="mx-16 hover:text-gray-300">Provfrågor</button>
              <button className="mx-16 hover:text-gray-300">Tidslinje</button>
              <button className="mx-16 hover:text-gray-300">Logga in</button>
            </div>
          </div>
        </div>
      </nav>
    );
  }
  