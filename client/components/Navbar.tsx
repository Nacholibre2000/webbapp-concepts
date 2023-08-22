// components/Navbar.tsx
export default function Navbar() {
    return (
      <nav className="bg-gray-800 text-white p-4">
        <div className="container mx-auto">
          <div className="flex justify-between">
            <a href="/" className="text-2xl font-bold">Logo</a>
            <div>
              <button className="mx-2 hover:text-gray-300">Button 1</button>
              <button className="mx-2 hover:text-gray-300">Button 2</button>
              <button className="mx-2 hover:text-gray-300">Button 3</button>
              <button className="mx-2 hover:text-gray-300">Button 4</button>
              <a href="/about" className="mx-2 hover:text-gray-300">About</a>
            </div>
          </div>
        </div>
      </nav>
    );
  }
  