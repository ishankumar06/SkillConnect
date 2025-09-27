import React from 'react'
import Side from './Side'
import ChatCon from './ChatCon'
import RightSi from './RightSi'
import bgImage from '../assets/bgImage.png' // adjust filename/extension as needed

const Messaging = () => {
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        minWidth: 0,
        backgroundImage: `url(${bgImage})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div style={{ width: "280px", minWidth: "200px", maxWidth: "320px", borderRight: "1px solid #eee", height: "100%" }}>
        <Side />
      </div>
      <div style={{ flex: 1, minWidth: 0, height: "100%" }}>
        <ChatCon />
      </div>
      <div style={{ width: "280px", minWidth: "200px", maxWidth: "320px", borderLeft: "1px solid #eee", height: "100%" }}>
        <RightSi />
      </div>
    </div>
  )
}

export default Messaging
