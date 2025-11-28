import React, { useEffect, useState } from "react";
import Loading from "../components/Loading"; 
import Feed from "../components/Feed";
import bgImage from '../assets/bgImage.png';


export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
   
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loading />; 
  }

  return (
    <div
      className="flex min-h-screen bg-#6A1B9A"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <main className="flex-1 p-6 space-y-6">
        <Feed />
      
      </main>
    </div>
  );
}
