import React, { useEffect, useState } from 'react';
import Side from './Side';         // Your DATA
import ChatCon from './ChatCon';   // Your DATA
import RightSi from './RightSi';   // Your DATA
import Loading from '../components/Loading';

const Messaging = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        await new Promise(resolve => setTimeout(resolve, 900));
      } catch (err) {
        setError('Failed to load messages. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#49516b]">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-red-100 text-red-700 p-6 font-semibold">
        {error}
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-[#49516b] antialiased">
      {/* Left Sidebar */}
      <aside className="flex flex-col w-[300px] bg-[#212a35] border-r border-[#323d50]">
     
        {/* Sidebar nav and chat list */}
        <div className="flex-1 overflow-y-auto">
          <Side />
        </div>
      </aside>

      {/* Center Chat */}
      <main className="flex-1 flex flex-col bg-[#f9fbfd] border-r border-[#e7e7ec] shadow-md">
        {/* Header */}
        <div className="flex items-center justify-between h-[64px] px-8 bg-[#ffffff] border-b border-[#ebecef]">
          {/* Profile + Name + Status */}
          <div className="flex items-center gap-3">
            {/* Avatar and user info as rendered by your ChatCon topbar or a new component */}
            {/* Optionally move this markup to ChatCon and just import here */}
            {/* Example: <ChatTopbar /> */}
          </div>
          {/* Icons group */}
          <div className="flex items-center gap-5 text-gray-400">
            <button className="hover:text-green-500"><i className="fas fa-folder" /></button>
            <button className="hover:text-green-500"><i className="fas fa-phone" /></button>
            <button className="hover:text-green-500"><i className="fas fa-video" /></button>
            {/* Add more as needed */}
          </div>
        </div>
        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto px-10 py-6">
          <ChatCon />
        </div>
      
      </main>

      {/* Right Sidebar */}
      <aside className="w-[300px] bg-white flex flex-col p-8">
        <RightSi />
      </aside>
    </div>
  );
};

export default Messaging;
