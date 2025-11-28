import React from 'react';
import Side from './Side';
import ChatCon from './ChatCon';
import RightSi from './RightSi';

const Messaging = () => {
  return (
    <div className="flex h-screen w-full bg-black antialiased">
      {/* Left Sidebar */}
      <aside className="flex flex-col w-[300px] bg-black border-r border-[#323d50]">
        <div className="flex-1 overflow-y-auto">
          <Side />
        </div>
      </aside>

      {/* Center Chat */}
      <main className="flex-1 flex flex-col bg-black border-r border-[#e7e7ec] shadow-md">
       
          <div className="flex items-center gap-3">
          </div>
          <div className="flex items-center gap-5 text-gray-400">
            <button className="hover:text-green-500"><i className="fas fa-folder" /></button>
            <button className="hover:text-green-500"><i className="fas fa-phone" /></button>
            <button className="hover:text-green-500"><i className="fas fa-video" /></button>
          </div>
        
        <div className="flex-1 overflow-y-auto px-10 py-6">
          <ChatCon />
        </div>
      </main>

      {/* Right Sidebar */}
      <aside className="w-[300px] bg-black flex flex-col p-8">
        <RightSi />
      </aside>
    </div>
  );
};

export default Messaging;
