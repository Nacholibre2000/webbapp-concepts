// index.tsx
import React from "react";
import Layout from '../components/Layout';

const Home: React.FC = () => {
  console.log("Home component rendered");  // Debugging statement
  return (
    <Layout>
      {/* Your main content here */}
    </Layout>
  );
};

export default Home;
