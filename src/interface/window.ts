interface AIWindow extends Window {
  ai: {
    languageModel: {
      capabilities: () => Promise<{
        available: boolean
        defaultTemperature: number
        defaultTopK: number
        maxTopK: number
      }>
    }
  }
}
declare const window: any
export default window
