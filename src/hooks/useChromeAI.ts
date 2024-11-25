import window from '@/interface/window'
import { useState } from 'react'

export const useChromeAI = () => {
  const [loadedPercentage, setLoadedPercentage] = useState(0)
  return {
    checkPromptAPI: async () => {
      const { available, defaultTemperature, defaultTopK, maxTopK } =
        await window.ai.languageModel.capabilities()
      return { available, defaultTemperature, defaultTopK, maxTopK }
    },

    getPromptAPIsession: async (newSystemPrompt: string) => {
      const session = await window.ai.languageModel.create({
        systemPrompt: newSystemPrompt,
        monitor(m: any) {
          m.addEventListener('downloadprogress', (e: any) => {
            setLoadedPercentage((e.loaded / e.total) * 100)
          })
        },
      })
      return { session, loadedPercentage }
    },
  }
}
