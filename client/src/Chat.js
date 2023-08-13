import React, { useMemo, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
//we will be sending messages and receiving messages in this component through socket.io
//received as prop    socket
function Chat({socket,username,room,userid }) {
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);
  
    const sendMessage = async () => {
      if (currentMessage !== "") {
        const messageData = {
          room: room,
          author: username, 
          message: currentMessage,
          time:
            new Date(Date.now()).getHours() +
            ":" + 
            new Date(Date.now()).getMinutes(),
            userid:userid
        };
  
        //await keyword is used so program execution will resume only after this promise has been fulfilled
        await socket.emit("send_message", messageData);
        setMessageList((list) => [...list, messageData]);
        setCurrentMessage("");
      }
    };
  

    //whenver there will be a change in [socket] server this useEffect will run 
    useMemo(() => {
      socket.on("receive_message", (data) => {
        setMessageList((list) => [...list, data]); //list represents what was the current state of message list
        //added new message to the list
      });
    }, [socket]);
  
  return (
   
    <div className="chat-window">
      <div className="chat-header">
        <p>Live Chat</p>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">

            {/* //looping through message list */}
          {messageList.map((messageContent) => {
            return (
              <div
                className="message"
                id={userid === messageContent.userid ? "you" : "other"}
              >
                <div>
                  <div className="message-content">
                    <p>{messageContent.message}</p>
                  </div>
                  <div className="message-meta">
                    <p id="time">{messageContent.time}</p>
                    <p id="author">{messageContent.author}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={currentMessage}
          placeholder="Type Here "
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          onKeyPress={(event) => {
            event.key === "Enter" && sendMessage();
          }}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  );
}

export default Chat;
