import React, { useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Bot } from 'lucide-react'
import { ChatBox } from './ChatBox'

const ContentPage: React.FC = () => {
  const [chatboxExpanded, setChatboxExpanded] = React.useState<boolean>(false)

  const pageText = document.body.innerText

  const ref = useRef<HTMLDivElement>(null)

  const handleDocumentClick = (e: MouseEvent) => {
    if (
      ref.current &&
      e.target instanceof Node &&
      !ref.current.contains(e.target)
    ) {
      if (chatboxExpanded) setChatboxExpanded(false)
    }
  }

  React.useEffect(() => {
    document.addEventListener('click', handleDocumentClick)
    return () => {
      document.removeEventListener('click', handleDocumentClick)
    }
  }, [])

  return (
    <div
      ref={ref}
      className="dark z-50 border rounded-2xl"
      style={{
        position: 'fixed',
        bottom: '30px',
        right: '30px',
      }}
    >
      {!chatboxExpanded ? null : (
        <ChatBox visible={chatboxExpanded} context={{ pageText }} />
      )}

      <div className="flex justify-end">
        <Button
          size={'icon'}
          onClick={() => setChatboxExpanded(!chatboxExpanded)}
        >
          <Bot />
        </Button>
      </div>
    </div>
  )
}

export default ContentPage
