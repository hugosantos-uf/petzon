"use client";

import React, { useState, useEffect, useRef } from "react";
import { Client, IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useAppSelector } from "@/app/hooks/hooks";
import { useGetChatHistoryQuery } from "@/app/store/api/ongApi";
import { useGetUsuarioLogadoQuery } from "@/app/store/api/authApi";
import type { ChatMessage } from "@/app/types/interfaces";
import { FiX, FiSend } from "react-icons/fi";

interface PrivateChatWindowProps {
  conversationId: string;
  chatPartnerName: string;
  onClose: () => void;
  showHeader?: boolean;
}

export default function PrivateChatWindow({
  conversationId,
  chatPartnerName,
  onClose,
  showHeader = true,
}: PrivateChatWindowProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [chatPartnerId, setChatPartnerId] = useState<number | null>(null);
  const stompClient = useRef<Client | null>(null);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const token = useAppSelector((state) => state.auth.token);
  const { data: currentUser } = useGetUsuarioLogadoQuery();

  const { data: history = [], isFetching: isHistoryFetching } =
    useGetChatHistoryQuery(conversationId, {
      refetchOnMountOrArgChange: true,
    });

  useEffect(() => {
    if (!isHistoryFetching) {
      setMessages(history);
      if (history.length > 0 && currentUser) {
        const firstMessage = history[0];
        const partner =
          firstMessage.sender.idUsuario === currentUser.idUsuario
            ? firstMessage.recipient.idUsuario
            : firstMessage.sender.idUsuario;
        setChatPartnerId(partner);
      } else if (currentUser) {
        const ids = conversationId.split("-").map(Number);
        const partner = ids.find((id) => id !== currentUser.idUsuario);
        setChatPartnerId(partner || null);
      }
    }
  }, [history, currentUser, conversationId, isHistoryFetching]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!token || !currentUser) return;
    const client = new Client({
      webSocketFactory: () =>
        new SockJS(`${process.env.NEXT_PUBLIC_API_BASE_URL}/ws`),
      connectHeaders: { Authorization: `${token}` },
      reconnectDelay: 5000,
    });
    client.onConnect = () => {
      client.subscribe(
        `/user/${currentUser.email}/queue/messages`,
        (message: IMessage) => {
          const receivedMessage: ChatMessage = JSON.parse(message.body);
          if (receivedMessage.conversationId === conversationId) {
            setMessages((prev) => [...prev, receivedMessage]);
          }
        }
      );
    };
    client.activate();
    stompClient.current = client;
    return () => {
      client.deactivate();
    };
  }, [token, currentUser, conversationId]);

  const sendMessage = () => {
    if (input.trim() && stompClient.current?.active && currentUser) {
      if (!chatPartnerId) {
        const ids = conversationId.split("-").map(Number);
        const partner = ids.find((id) => id !== currentUser.idUsuario);
        if (!partner) {
          return;
        }
        setChatPartnerId(partner);
      }
      const chatMessagePayload = { recipientId: chatPartnerId, content: input };
      stompClient.current.publish({
        destination: `/app/chat/${conversationId}/sendMessage`,
        body: JSON.stringify(chatMessagePayload),
      });
      setInput("");
    }
  };

  return (
    <div className="w-full h-full bg-white flex flex-col shadow-2xl rounded-xl border border-gray-200">
      {showHeader && (
        <div className="bg-purple-700 text-white p-4 flex justify-between items-center rounded-t-xl">
          <h3 className="font-bold text-lg">Conversa com {chatPartnerName}</h3>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>
      )}
      <div className="flex-1 p-4 overflow-y-auto bg-purple-50 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-end gap-2 ${
              msg.sender.idUsuario === currentUser?.idUsuario
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-2xl ${
                msg.sender.idUsuario === currentUser?.idUsuario
                  ? "bg-purple-600 text-white rounded-br-none"
                  : "bg-white text-gray-800 rounded-bl-none shadow-sm"
              }`}
            >
              <p className="text-sm">{msg.content}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-3 border-t bg-white flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 px-4"
          placeholder="Digite sua mensagem..."
        />
        <button
          onClick={sendMessage}
          className="bg-purple-700 text-white w-10 h-10 flex items-center justify-center rounded-full hover:bg-purple-800 transition-colors"
        >
          <FiSend />
        </button>
      </div>
    </div>
  );
}
