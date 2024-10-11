// components/ChatWindow.js
'use client';

import useSocketManager from '@hooks/useSocketManager';
import { ClientEvents } from '@memory-cards/shared/client/ClientEvents';
import { useEffect, useState, useRef, SyntheticEvent, KeyboardEventHandler } from 'react';
import { ChatMessage } from '@memory-cards/shared/server/types'
import Introduction from '@components/game/Introduction';
import { Listener } from '@components/websocket/types';
import { showNotification } from '@mantine/notifications';
import { ServerEvents } from '@memory-cards/shared/server/ServerEvents';
import { ServerPayloads } from '@memory-cards/shared/server/ServerPayloads';
import router from 'next/router';

type Props = {
  chat: ChatMessage[]
}

export default function ChatWindow({ chat }: Props) {
  const {sm} = useSocketManager();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>('');
  const messagesEndRef = useRef(null);
  const username = sm.getSocketId()!;

  useEffect(() => {
    console.log('use eff getting ' + JSON.stringify(chat))
    if(!chat) return;
    let parsedMessages: ChatMessage[] = chat.map((m) =>{
      return {
        message: m["chatMessage"].message,
        username: m["chatMessage"].username,
        timestamp: m["chatMessage"].timestamp
      }
    })
    setMessages(parsedMessages);


  }, [chat])

  const sendMessage = () => {
    if (input.trim() === '') return;

    const chatMessage: ChatMessage = {
    message: input.trim(),
    username: username,
    timestamp: new Date().toISOString()
    };

    console.log('sending to serv ' + JSON.stringify(chatMessage))
    sm.emit({
      event: ClientEvents.ChatMessage,
      data: { chatMessage },
    });

    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };
  

  return (
    <div className="flex flex-col h-96 border rounded-md shadow-md">
      {/* Messages Display */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
        {messages.map((msg, index) => (
          <div key={index} className="mb-2">
            <span className="font-semibold">{msg.username === username ? 'You' : 'Opponent'}: </span>
            <span>{msg.message}</span>
            <div className="text-xs text-gray-500">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Field */}
      <div className="flex p-2 bg-white border-t">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          className="flex-1 px-3 py-2 border rounded-l-md focus:outline-none focus:ring focus:border-blue-300"
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none"
        >
          Send
        </button>
      </div>
    </div>
  );
}
