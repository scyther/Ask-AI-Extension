import React from 'react'

import Show from '@/components/Show'

const Popup: React.FC = () => {
  const [isLoaded, setIsLoaded] = React.useState<boolean>(false)

  React.useEffect(() => {
    const loadAnything = async () => {
      if (!chrome) return

      setIsLoaded(true)
    }

    loadAnything()
  }, [])

  return (
    <div className="relative p-4 w-[350px] bg-background">
      <Show show={isLoaded}>
        <div className="">
          <div className="w-full  h-20 overflow-hidden "></div>
          <div className="text-center">
            <h1 className=" font-bold text-3xl text-white">
              Ask <span className="text-whisperOrange">AI</span>
            </h1>
            <p className="text-sm text-muted-foreground">
              Ask anything to AI about your current page
            </p>
          </div>
        </div>
      </Show>
    </div>
  )
}

export default Popup
