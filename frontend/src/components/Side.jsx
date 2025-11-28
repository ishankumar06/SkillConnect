import React, { useContext, useEffect, useState } from 'react';
import assets from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import skill from '../assets/skilllogo.png';

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, unseenMessages, setUnseenMessages } = useContext(ChatContext);
  const { logout, onlineUsers } = useContext(AuthContext);

  const [searchInput, setSearchInput] = useState('');
  const [showMenu, setShowMenu] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    getUsers();
  }, [onlineUsers]);

  const filteredUsers = searchInput
    ? users.filter(user => user.fullName.toLowerCase().includes(searchInput.toLowerCase()))
    : users;

  const toggleMenu = () => setShowMenu(prev => !prev);

  return (
    <div className={`bg-black h-full p-5 rounded-r-xl overflow-y-scroll text-black ${selectedUser ? "max-md:hidden" : ''}`}>
      <div className='pb-5'>
        <div className='flex justify-between items-center'>
          <img src={skill} alt="logo" className='max-w-40' />
          <div className="relative">
            {/* Menu Icon */}
            <button onClick={toggleMenu} className="p-2 rounded-md bg-gray-500 text-white">
             <img src={assets.menu_icon} alt="menu" className="w-6 h-6" />
            </button>

            {/* Dropdown menu */}
            {showMenu && (
              <div className="absolute top-full right-0 z-20 w-32 p-5 rounded-md bg-gray-500 border border-gray-600 text-gray-100">
                <p
                  onClick={() => {
                    navigate('/profile');
                    setShowMenu(false);
                  }}
                  className="cursor-pointer text-sm"
                >
                  EDIT PROFILE
                </p>
                <hr className="my-2 border-t border-gray-500" />
                <p
                  onClick={() => {
                    logout();
                    setShowMenu(false);
                  }}
                  className="cursor-pointer text-sm"
                >
                  LOGOUT
                </p>
              </div>
            )}
          </div>
        </div>

        <div className='bg-green-500/30 rounded-full flex items-center gap-2 py-3 px-4 mt-5'>
          <img src={assets.search_icon} alt="search" className='w-3' />
          <input
            type="text"
            className='bg-transparent border-none outline-none text-black text-xs placeholder-black flex-1'
            placeholder='search user'
            onChange={e => setSearchInput(e.target.value)}
            value={searchInput}
          />
        </div>
      </div>
      <div className='flex flex-col'>
        {filteredUsers.map((user) => (
          <div
            onClick={() => {
              setSelectedUser(user);
              setUnseenMessages(prev => ({ ...prev, [user._id]: 0 }));
            }}
            key={user._id}
            className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm ${selectedUser?._id === user._id ? 'bg-[#282142]/50' : ''}`}
          >
            <img src={user?.profilePic || assets.avatar_icon} alt="" className='w-[35px] aspect-[1/1] rounded-full' />
            <div className='flex flex-col leading-5'>
              <p>{user.fullName}</p>
              {onlineUsers.includes(user._id)
                ? <span className='text-green-400 text-xs'>Online</span>
                : <span className='text-neutral-400 text-xs'>Offline</span>}
            </div>
            {unseenMessages[user._id] > 0 && (
              <p className='absolute top-4 right-4 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-green-500/30'>
                {unseenMessages[user._id]}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
