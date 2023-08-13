
import "./App.css";
import io from "socket.io-client";
import { useState } from "react";
import Chat from "./Chat";
//connected frontend with socket io server
const socket = io.connect("https://chatappserver-lvq0.onrender.com");
function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [id, setid] = useState("");

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      socket.on('userid',(data)=>{
        setid(data);
      })
      setShowChat(true);
    }
  };
  return (
    <div className="App">
    {!showChat ? (
      <div className="joinChatContainer">
        <h3>Join A Chat</h3>
        <input
          type="text"
          placeholder="Your Name"
          onChange={(event) => {
            setUsername(event.target.value);
          }}
        />
        <input
          type="text"
          placeholder="Room ID..."
          onChange={(event) => {
            setRoom(event.target.value);
          }}
        />
        <button onClick={joinRoom}>Join A Room</button>
      </div>
    ) : (
     
      <Chat socket={socket} username={username} room={room} userid={id} />
    )}
  </div>
);
}

export default App;