import React, { useState, useEffect, useRef } from "react";

export const Chat = ({ socket, username, room }) => {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        id: Math.random(),
        room: room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };
      await socket.emit("send_message", messageData);
      setMessageList([...messageList, messageData]);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    const handleRecieveMsg = (data) => {
      setMessageList((prevList) => [...prevList, data]);
    };
    socket.on("receive_message", handleRecieveMsg);

    return () => {
      socket.off("receive_message", handleRecieveMsg);
    };
  }, [socket]);

  const containRef = useRef(null);
  useEffect(() => {
    containRef.current.scrollTop = containRef.current.scrollHeight;
  }, [messageList]);

  return (
    <>
      <div className="chat_container h-[600px] w-[400px] mx-auto text-center">
        <h1 className="text-yellow-400 text-xl font-bold">
          Welcome {username}
        </h1>
        <div className="chat_box bg-gray-800 h-[500px] relative border border-yellow-400 flex flex-col justify-between p-4 rounded-lg">
          {/* Scrollable Message Area */}
          <div
            className="auto-scroll flex-grow overflow-y-auto border-2 border-yellow-400 rounded-lg p-2 no-scrollbar"
            ref={containRef}
          >
            {/* Messages */}
            {messageList.map((data) => (
              <div
                key={data.id}
                className={`message_content flex items-center gap-2 font-bold m-2 ${
                  username === data.author ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`msg ${
                    username === data.author
                      ? "bg-yellow-400 text-black p-2 rounded-lg"
                      : "bg-blue-500 text-white p-2 rounded-lg"
                  }`}
                >
                  <p>{data.message}</p>
                </div>
                <div className="msg_details text-xs text-gray-300 mt-1">
                  <p>{data.author}</p>
                  <p>{data.time}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input Area */}
          <div className="chat_body flex items-center gap-2 mt-4">
            <input
              value={currentMessage}
              type="text"
              placeholder="Type Message"
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={(e) => {
                e.key === "Enter" && sendMessage();
              }}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      </div>
    </>
  );
};
