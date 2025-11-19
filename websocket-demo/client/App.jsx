import { useState, useEffect } from "react";

export function App() {
  let [id, setId] = useState();
  let [connected, setConnected] = useState([]);
  let [messages, setMessages] = useState([]);

  let [socket, setSocket] = useState(null);

  useEffect(() => {
    // EXERCISE 1: Replace this with Matthew's current IP address
    let socket = new WebSocket("ws://149.31.229.99:3000/");

    function handler({ data }) {
      let event = JSON.parse(data);

      if (event.type === "welcome") {
        setId(event.id);
        setMessages(event.messages);
        setConnected(event.connected);
      } else if (event.type === "server_message") {
        let { type, ...message } = event;
        setMessages(messages => [...messages, message])
      } else if (event.type === "connected") {
        // EXERCISE 2: Update the list of connected users here
        setConnected(connected => connected);
     } else if (event.type === "connected") {
  setConnected(prev =>
    prev.includes(event.id) ? prev : [...prev, event.id]
  );
}
        // EXERCISE 3: Update the list of connected users here
        setConnected(connected => connected);
      }
    }

    setSocket(socket);
    socket.addEventListener("message", handler);

    return () => {
      socket.removeEventListener("message", handler);
    };
  }, []);

  let [currentMessage, setCurrentMessage] = useState("");

  return (
    <>
      <section className="users">
        <div>My ID: {id}</div>
        <ul className="connected">
          {connected.map(id => <li>User {id}</li>)}
        </ul>
      </section>
      <section id="chat">
        <section id="messages">
          {messages.map(({ sender, time, content }) => (
            <Message sender={`User ${sender}`} time={time} content={content} isLocal={id === sender} />
          ))}
        </section>
        <form action={(formData) => {
            socket.send(JSON.stringify({ type: "client_message", content: formData.get("message") }));
            setCurrentMessage("");
          }}>
          <input
            name="message"
            value={currentMessage}
            onChange={(event) => setCurrentMessage(event.target.value)}
          ></input>
          <input type="submit" value="Send" />
        </form>
      </section>
    </>
  );


function Message({ sender, time, isLocal, content }) {
  // Convert the timestamp → local readable time
  const formattedTime = time ? new Date(time).toLocaleTimeString() : "";

  return (
    <div className={`message${isLocal ? " local" : ""}`}>
      <div className="sender">{sender}</div>
      <div className="time">{formattedTime}</div>
      <p>{content}</p>
    </div>
  );
}

    {/* EXERCISE 4: Look up Javascript's Date object and figure out how to render this */}
    <div className="time">{time}</div>
    <p>{content}</p>
  </div>;
}

// EXERCISE 5: Add some CSS to your index.html to style things

<style>
  body {
    margin: 0;
    font-family: sans-serif;
    background: #f5f5f5;
    padding: 20px;
  }

  .users {
    background: #ffffff;
    padding: 12px 16px;
    border-radius: 8px;
    margin-bottom: 16px;
    border: 1px solid #ddd;
  }

  .connected {
    list-style: none;
    padding: 0;
    margin-top: 8px;
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .connected li {
    background: #e6e8ff;
    color: #333;
    padding: 4px 10px;
    border-radius: 999px;
  }

  #chat {
    background: white;
    padding: 16px;
    border-radius: 8px;
    border: 1px solid #ddd;
    height: 70vh;
    display: flex;
    flex-direction: column;
  }

  #messages {
    flex: 1;
    overflow-y: auto;
    padding-right: 8px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .message {
    background: #eee;
    padding: 10px 12px;
    border-radius: 8px;
    max-width: 70%;
  }

  .message.local {
    margin-left: auto;
    background: #cce5ff;
  }

  .sender {
    font-size: 12px;
    font-weight: bold;
    opacity: 0.7;
  }

  .time {
    font-size: 10px;
    opacity: 0.6;
    margin-bottom: 4px;
  }

  form {
    display: flex;
    gap: 8px;
    margin-top: 12px;
  }

  form input[name="message"] {
    flex: 1;
    padding: 10px 12px;
    border-radius: 8px;
    border: 1px solid #ccc;
  }

  form input[type="submit"] {
    padding: 10px 16px;
    border: none;
    background: black;
    color: white;
    border-radius: 8px;
    cursor: pointer;
  }

  form input[type="submit"]:hover {
    opacity: 0.8;
  }
</style>
 