import { ChatHistoryParsed } from '@/interface/chatHistory'
import window from '@/interface/window'
import { useState } from 'react'
import keyword_extractor from 'keyword-extractor'

export const useChromeAI = () => {
  // const [loadedPercentage, setLoadedPercentage] = useState(0)
  const [session, setSession] = useState<any>(null)

  return {
    checkPromptAPI: async () => {
      const { available, defaultTemperature, defaultTopK, maxTopK } =
        await window.ai.languageModel.capabilities()
      return { available, defaultTemperature, defaultTopK, maxTopK }
    },

    getPromptAPIsession: async (chatHistory: ChatHistoryParsed[]) => {
      const session = await window.ai.languageModel.create({
        initialPrompts: chatHistory,
      })
      setSession(session)
      return session
    },

    askPrompt: async (chatHistory: ChatHistoryParsed[]) => {
      const lastMsg = chatHistory.pop()
      const session = await window.ai.languageModel.create({
        initialPrompts: chatHistory,
      })
      const response = await session.prompt(lastMsg?.content)
      session.destroy()
      return response
    },

    createKeywords: async (prompt: string) => {
      //disabled for now
      // const keyWordSession = await window.ai.languageModel.create({
      //   systemPrompt: 'Create comma separated string of tokens for the prompt',
      // })
      // console.log('Keyword Prompt:', prompt)
      // const keywords = await keyWordSession.prompt(prompt)
      // console.log('Keywords Generated:', keywords)
      // keyWordSession.destroy()
      const keywords = keyword_extractor.extract(prompt, {
        language: 'english',
        remove_digits: true,
        return_changed_case: true,
        remove_duplicates: false,
      })
      console.log('Keywords:', keywords)
      return keywords
    },

    session,
  }
}
