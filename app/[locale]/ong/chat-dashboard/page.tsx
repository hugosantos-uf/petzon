"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useGetOngConversationsQuery } from "@/app/store/api/ongApi";
import { useGetUsuarioLogadoQuery } from "@/app/store/api/authApi";
import { useAppSelector } from "@/app/hooks/hooks";
import type { ConversationSummary } from "@/app/types/interfaces";
import PrivateChatWindow from "@/app/components/features/chat/PrivateChatWindow";

const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diffInSeconds < 60) return "agora";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m atrás`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h atrás`;
  return date.toLocaleDateString("pt-BR");
};

const Avatar = ({ name }: { name: string }) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div className="w-12 h-12 rounded-full bg-purple-200 text-purple-700 flex items-center justify-center font-bold text-lg flex-shrink-0">
      {initials}
    </div>
  );
};

export default function OngChatDashboard() {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { data: usuarioLogado, isLoading: isLoadingUser } =
    useGetUsuarioLogadoQuery(undefined, {
      skip: !isAuthenticated,
    });
  const { data: conversations, isLoading: isLoadingConversations } =
    useGetOngConversationsQuery(undefined, {
      pollingInterval: 30000,
      skip: !isAuthenticated,
    });
  const [selectedConversation, setSelectedConversation] =
    useState<ConversationSummary | null>(null);

  useEffect(() => {
    if (
      !isLoadingUser &&
      (!isAuthenticated || !usuarioLogado?.cargos.includes("ROLE_ONG"))
    ) {
      router.replace("/");
    }
  }, [isAuthenticated, usuarioLogado, isLoadingUser, router]);

  const isLoading = isLoadingUser || isLoadingConversations;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-700"></div>
      </div>
    );
  }

  if (isAuthenticated && usuarioLogado?.cargos.includes("ROLE_ONG")) {
    return (
      <main className="flex h-[calc(100vh-68px)]">
        <div className="w-1/3 border-r border-gray-200 overflow-y-auto bg-white">
          <div className="p-4 font-bold text-lg border-b bg-gray-50 sticky top-0">
            Conversas Ativas
          </div>
          {conversations?.map((convo) => (
            <div
              key={convo.conversationId}
              onClick={() => setSelectedConversation(convo)}
              className={`p-3 border-b cursor-pointer hover:bg-purple-50 flex items-center gap-4 ${
                selectedConversation?.conversationId === convo.conversationId
                  ? "bg-purple-100 border-l-4 border-l-purple-600"
                  : ""
              }`}
            >
              <Avatar name={convo.usuarioNome} />
              <div className="flex-1 overflow-hidden">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-purple-800">
                    {convo.usuarioNome}
                  </span>
                  <span className="text-xs text-gray-500 flex-shrink-0">
                    {formatRelativeTime(convo.timestamp)}
                  </span>
                </div>
                <div className="text-sm text-gray-700">
                  Pet: <span className="font-semibold">{convo.petNome}</span>
                </div>
                <p className="text-sm text-gray-500 truncate mt-1">
                  {convo.ultimaMensagem}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="w-2/3 flex flex-col bg-gray-100">
          {selectedConversation ? (
            <PrivateChatWindow
              conversationId={selectedConversation.conversationId}
              chatPartnerName={selectedConversation.usuarioNome}
              onClose={() => setSelectedConversation(null)}
              showHeader={false}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center text-center text-gray-500">
              <div>
                <p className="text-lg">Bem-vindo ao seu Dashboard de Chat.</p>
                <p>Selecione uma conversa na lista à esquerda para começar.</p>
              </div>
            </div>
          )}
        </div>
      </main>
    );
  }

  return null;
}
