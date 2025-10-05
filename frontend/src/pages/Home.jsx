import Header from "../components/Header";
import PostSection from "../components/PostSection";
import Feed from "../components/Feed";
import SearchBar from "../components/SearchBar";
import bgImage from '../assets/bgImage.png';
// import RightSidebar from "../components/RightSidebar";


export default function Home() {
  return (
    <div className="flex min-h-screen bg-gray-100  "
    style={{
        backgroundImage: `url(${bgImage})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      >
      <main className="flex-1 p-6 space-y-6"> 
        {/* space-y-6 automatically adds equal vertical spacing between children */}


       

        {/* Feed */}
        <Feed />
      </main>

      {/* Right Sidebar */}
      {/* <RightSidebar /> */}
    </div>
  );
}
