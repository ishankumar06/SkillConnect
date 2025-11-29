import React, { useContext, useEffect, useState, useCallback } from 'react';
import assets from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import skill from '../assets/skilllogo.png';

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, unseenMessages, setUnseenMessages } = useContext(ChatContext);
  const { logout, onlineUsers, axios: authAxios } = useContext(AuthContext);

  const [searchInput, setSearchInput] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    getUsers(); // Chat users load
  }, []);

  const handleSearch = useCallback(async (value) => {
    setSearchInput(value);
    if (value.length > 1) {
      setLoadingSearch(true);
      try {
        const { data } = await authAxios.get(`/api/users?search=${value}`);
        setSearchResults(data.users || []);
      } catch (err) {
        console.log('Search error:', err);
        setSearchResults([]);
      } finally {
        setLoadingSearch(false);
      }
    } else {
      setSearchResults([]);
    }
  }, [authAxios]);

  const chatUsers = users.filter(user => user.hasChatted);
  const showSearchResults = searchInput.length > 1 && searchResults.length > 0;

  const toggleMenu = () => setShowMenu(prev => !prev);

  return (
    <div className={`bg-[#403d41] h-full p-5 rounded-r-xl overflow-y-scroll text-white ${selectedUser ? "max-md:hidden" : ''}`} style={{ boxShadow: "0 6px 24px 0 #e4ebfd" }}>
      <div className='pb-6 border-b border-gray-600'>
        <div className='flex justify-between items-center mb-6'>
          <img src={skill} alt="logo" className='max-w-40 drop-shadow-lg' />
          <div className="relative">
            <button onClick={toggleMenu} className="p-3 rounded-xl bg-[#4a474b] text-white hover:bg-[#555]">
              <img src={assets.menu_icon} alt="menu" className="w-6 h-6" />
            </button>

            {showMenu && (
              <div className="absolute top-full right-0 z-20 w-48 p-4 rounded-2xl bg-[#4a474b] border border-gray-600 text-white shadow-lg">
                <p onClick={() => { navigate('/profile'); setShowMenu(false); }} className="cursor-pointer text-sm py-2 hover:bg-[#555] rounded-lg px-3">
                   EDIT PROFILE
                </p>
                <hr className="my-2 border-t border-gray-500" />
                <p onClick={() => { logout(); setShowMenu(false); }} className="cursor-pointer text-sm py-2 hover:bg-[#555] rounded-lg px-3">
                   LOGOUT
                </p>
              </div>
            )}
          </div>
        </div>

        <div className='bg-[#4a474b]/50 rounded-2xl flex items-center gap-3 py-4 px-5 border border-gray-600'>
          <img src={assets.search_icon} alt="search" className='w-5' />
          <input
            type="text"
            className='bg-transparent border-none outline-none text-white text-sm placeholder-gray-400 flex-1'
            placeholder='Search people...'
            onChange={(e) => handleSearch(e.target.value)}
            value={searchInput}
          />
        </div>
      </div>

      <div className='flex flex-col gap-4'>
        {/* Chat Users List */}
        {!showSearchResults && chatUsers.length > 0 && (
          <div>
            <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
               Messages
              <span className="text-xs bg-blue-500/20 px-2 py-1 rounded-full text-blue-300">
                {chatUsers.length}
              </span>
            </h3>
            {chatUsers.slice(0, 20).map((user) => (
              <ChatUserItem
                key={user._id}
                user={user}
                selectedUser={selectedUser}
                unseenMessages={unseenMessages}
                onlineUsers={onlineUsers}
                setSelectedUser={setSelectedUser}
                setUnseenMessages={setUnseenMessages}
              />
            ))}
          </div>
        )}

        {/*  Search Results */}
        {showSearchResults && (
          <div>
            <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
               Search Results ({searchResults.length})
            </h3>
            {searchResults.slice(0, 10).map((user) => (
              <ChatUserItem
                key={user._id}
                user={{ ...user, hasChatted: false }}
                selectedUser={selectedUser}
                unseenMessages={unseenMessages}
                onlineUsers={onlineUsers}
                setSelectedUser={setSelectedUser}
                setUnseenMessages={setUnseenMessages}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {(!chatUsers.length && !showSearchResults) || (showSearchResults && searchResults.length === 0 && !loadingSearch) ? (
          <div className="text-center py-12 text-gray-400">
            <div className="text-4xl mb-4">💬</div>
            <p className="text-lg">No messages yet</p>
            <p className="text-sm mt-2">Search for someone to start a chat</p>
          </div>
        ) : loadingSearch && (
          <div className="text-center py-12 text-gray-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p>Searching...</p>
          </div>
        )}
      </div>
    </div>
  );
};

const ChatUserItem = ({ user, selectedUser, unseenMessages, onlineUsers, setSelectedUser, setUnseenMessages }) => {
  return (
    <div
      onClick={() => {
        setSelectedUser(user);
        setUnseenMessages(prev => ({ ...prev, [user._id]: 0 }));
      }}
      className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-200 border-l-4 ${
        selectedUser?._id === user._id 
          ? 'bg-[#555] border-blue-500 shadow-md' 
          : 'hover:bg-[#4a474b]/50 border-transparent'
      }`}
    >
      <div className="relative">
        <img 
          src={user?.profilePic || assets.avatar_icon} 
          alt="" 
          className='w-12 h-12 rounded-full object-cover border-2 border-gray-600' 
        />
        {onlineUsers.includes(user._id) && (
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-[#403d41]"></div>
        )}
      </div>
      
      <div className='flex-1 min-w-0'>
        <div className="flex justify-between items-start">
          <p className="font-semibold text-white truncate">{user.fullName}</p>
          {unseenMessages[user._id] > 0 && (
            <span className="ml-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-bold min-w-[20px] text-center">
              {unseenMessages[user._id] > 99 ? '99+' : unseenMessages[user._id]}
            </span>
          )}
        </div>
        <p className={`text-xs truncate ${onlineUsers.includes(user._id) ? 'text-green-400' : 'text-gray-500'}`}>
          {onlineUsers.includes(user._id) ? 'Online' : 'Offline'}
        </p>
      </div>
    </div>
  );
};

export default Sidebar;

