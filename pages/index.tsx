import { useCallback, useEffect, useRef, useState } from "react"
import { connect, Socket } from "socket.io-client"

interface SMsg {
  user: string,
  message: string
}

const Index = () => {
  const user = useRef<string | undefined>('')
  const inputRef = useRef<HTMLInputElement>(null);
  const [connected, setConnected] = useState(false);
  const [chat, setChat] = useState<SMsg[]>([]);
  const [message, setMessage] = useState('');
  const socket = useRef<Socket>();

  const socketInitialize = async () => {
    socket.current = connect({
      path: '/api/socket'
    });
    socket.current.on('connect', () => {
      console.log('Conneted:', socket.current?.id);
      setConnected(true);
    })
    user.current = window.crypto.randomUUID?.();
  }

  const updateChat = useCallback(() => {
    socket.current?.on("message", (message: SMsg) => {
      setChat(chats => [...chats, message]);
    })
  }, []);

  useEffect(() => {
    socketInitialize()
    updateChat();
  }, [updateChat])

  const sendMessage = async () => {
    if (message) {
      const messg: SMsg = {
        user: "User_" + user.current?.toString(),
        message: message
      }

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          "content-type": 'application/json'
        },
        body: JSON.stringify(messg)
      });
      if (res.ok) setMessage('')
    }
    inputRef.current?.focus()
  }

  return (
    <div className="flex flex-col items-start justify-center">
      {chat.length ? chat.map(({ message: chat_message, user: chat_user }) => (
        <div key={window.crypto.randomUUID?.()}>
          <span>{chat_user === "User_" + user.current ? "Me" : chat_user}</span>:{chat_message}
        </div>
      )) : <div>No chats</div>}
      <input
        ref={inputRef}
        type="text"
        value={message}
        placeholder={connected ? 'type a message....' : 'Connecting....'}
        disabled={!connected}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            sendMessage()
          }
        }}
      />
    </div>
  )
}

export default Index