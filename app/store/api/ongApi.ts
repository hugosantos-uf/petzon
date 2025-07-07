import { baseApi } from "./petsApi";
import type { ChatMessage, ConversationSummary } from "@/app/types/interfaces";

export const ongApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getChatHistory: builder.query<ChatMessage[], string>({
      query: (conversationId) => `chat/history/${conversationId}`,
      providesTags: (_result, _error, id) => [{ type: "Chat", id }],
    }),
    getOngConversations: builder.query<ConversationSummary[], void>({
      query: () => `ong/chat/conversations`,
      providesTags: ["ChatConversations"],
    }),
  }),
});

export const { useGetChatHistoryQuery, useGetOngConversationsQuery } = ongApi;
