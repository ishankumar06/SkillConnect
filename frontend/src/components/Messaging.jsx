import React from 'react';
import Side from './Side';
import ChatCon from './ChatCon';
import RightSi from './RightSi';
import bgImage from '../assets/bgImage.png';

const Messaging = () => {
  return (
    <div
      className="flex h-screen min-w-0"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Left Sidebar */}
      <div className="w-[280px] min-w-[200px] max-w-[320px] border-r border-gray-200 shadow-md bg-white">
        <Side />
      </div>

      {/* Center Chat Container */}
      <main className="flex-1 min-w-0 h-full bg-white shadow-inner">
        <ChatCon />
      </main>

      {/* Right Sidebar */}
      <aside className="w-[280px] min-w-[200px] max-w-[320px] border-l border-gray-200 shadow-md bg-white">
        <RightSi />
      </aside>
    </div>
  );
};

export default Messaging;
