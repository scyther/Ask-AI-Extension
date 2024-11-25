import { ChatHistory } from '@/interface/chatHistory'
import { getChatHistory, saveChatHistory } from '@/lib/indexedDB'

export const useIndexDB = () => {
  return {
    saveChatHistory: async (pageName: string, history: ChatHistory[]) => {
      await saveChatHistory(pageName, history)
    },

    fetchChatHistory: async (
      pageName: string,
      limit: number,
      offset: number
    ) => {
      return await getChatHistory(pageName, limit, offset)
    },

    deleteChatHistory: async (pageName: string) => {
      return await saveChatHistory(pageName, [])
    },
  }
}
