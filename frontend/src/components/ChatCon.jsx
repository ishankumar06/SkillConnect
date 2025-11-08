import React, { useRef, useEffect, useState, useContext } from 'react';
import assets from '../assets/assets';
import skill from '../assets/skill.png';
import { formatMessageTime } from '../lib/utils';
import { ChatContext } from '../context/ChatContext';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const ChatContainer = () => {
  const { messages, selectedUser, setSelectedUser, sendMessage, getMessages } = useContext(ChatContext);
  const { authUser, onlineUsers } = useContext(AuthContext);

  const scrollEnd = useRef();
  const [input, setInput] = useState('');

  useEffect(() => {
    console.log('Current authUser:', authUser);
    console.log('Current selectedUser:', selectedUser);
  }, [authUser, selectedUser]);

  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser]);

  useEffect(() => {
    if (scrollEnd.current && messages.length) {
      scrollEnd.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === '') return;
    try {
      const data = await sendMessage({ text: input.trim() });
      if (data?.newMessage) {
        // You can enrich newMessage with sender info here if needed
      }
    } catch (error) {
      toast.error("Failed to send message");
    }
    setInput('');
  };


  

  const handleSendImage = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith('image/')) {
      toast.error('select an image file');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const data = await sendMessage({ image: reader.result });
        if (data?.newMessage) {
          // You can enrich newMessage with sender info here if needed
        }
      } catch (error) {
        toast.error("Failed to send image message");
      }
      e.target.value = '';
    };
    reader.readAsDataURL(file);
  };

  if (!selectedUser || !authUser) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden h-full w-full px-4 box-border">
        <img src={skill} alt="Logo" className="max-w-16" />
        <p className="text-lg font-medium text-black text-center">SkillConnect a way to connect</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-scroll relative backdrop-blur-lg">
      {/* Header */}
      <div className="flex items-center gap-3 py-3 mx-4 border-b border-stone-500">
        <img
          onClick={() => setSelectedUser(null)}
          src={assets.arrow_icon}
          alt="Back"
          className="w-6 cursor-pointer"
          title="Back"
        />
        <img
          src={selectedUser.profilePic || assets.avatar_icon}
          alt="Selected user profile"
          className="w-8 rounded-full"
        />
        <p className="flex-1 text-lg text-black flex items-center gap-2">
          {selectedUser.fullName}
          {onlineUsers.includes(selectedUser._id) && (
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
          )}
        </p>
        {/* <img src={assets.help_icon} alt="Help" className="max-md:hidden max-w-5" /> */}
      </div>

      {/* Chat area */}
      <div className="flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6">
        {messages.map((msg) => {
          const senderIdStr = msg.senderId._id ? msg.senderId._id.toString() : msg.senderId.toString();
          const currentUserId = authUser?.userId || authUser?._id;
          const isSender = senderIdStr === currentUserId.toString();

          return (
            <div
              key={msg._id}
              className={`flex items-end gap-2 ${isSender ? 'justify-end' : 'justify-start'}`}
            >
              {msg.image ? (
                <img
                  src={msg.image}
                  alt="Message attachment"
                  className="max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8"
                />
              ) : (
                <p
                  className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-all ${
                    isSender
                      ? 'rounded-br-none bg-green-500/30 text-black'
                      : 'rounded-bl-none bg-gray-300 text-black'
                  }`}
                >
                  {msg.text}
                </p>
              )}
              <div className="text-center text-xs">
                <img
                  src={msg.senderId.profilePic || assets.avatar_icon}
                  alt="Sender avatar"
                  className="w-7 rounded-full"
                />
                <p className="text-gray-500">{formatMessageTime(msg.createdAt)}</p>
              </div>
            </div>
          );
        })}
        <div ref={scrollEnd}></div>
      </div>

      {/* Bottom input area */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3">
        <div className="flex-1 flex items-center bg-gray-100/12 px-3 rounded-full">
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            onKeyDown={(e) => (e.key === 'Enter' ? handleSendMessage(e) : null)}
            type="text"
            placeholder="send a message"
            className="flex-1 text-sm p-3 border-none rounded-lg outline-none text-black placeholder-gray-800"
          />
          <input
            onChange={handleSendImage}
            type="file"
            id="image"
            accept="image/png,image/jpeg"
            hidden
          />
          <label htmlFor="image">
            <img src={assets.gallery_icon} alt="Attach" className="w-5 mr-2 cursor-pointer bg-green-500" />
          </label>
        </div>
        <img
          onClick={handleSendMessage}
          src={assets.send_button}
          alt="Send"
          className="w-7 cursor-pointer"
        />
      </div>
    </div>
  );
};

export default ChatContainer;
