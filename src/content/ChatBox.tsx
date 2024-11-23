import React, { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Bot, Copy, Send } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { SYSTEM_PROMPT } from '@/constants/prompt'
import { extractCode } from './util'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

import { cn } from '@/lib/utils'
import { Card, CardContent, CardFooter } from '@/components/ui/card'

import { ChatHistory, parseChatHistory } from '@/interface/chatHistory'
import { ScrollArea } from '@/components/ui/scroll-area'

import { LIMIT_VALUE } from '@/lib/indexedDB'
import { useIndexDB } from '@/hooks/useIndexDB'
import { useChromeAI } from '@/hooks/useChromeAI'

interface ChatBoxProps {
  visible: boolean
  context: {
    pageText: string
  }
}

export const ChatBox: React.FC<ChatBoxProps> = ({ context, visible }) => {
  const [value, setValue] = React.useState('')
  const [chatHistory, setChatHistory] = React.useState<ChatHistory[]>([])
  const [priviousChatHistory, setPreviousChatHistory] = React.useState<
    ChatHistory[]
  >([])
  const [isResponseLoading, setIsResponseLoading] =
    React.useState<boolean>(false)
  // const chatBoxRef = useRef<HTMLDivElement>(null)

  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const lastMessageRef = useRef<HTMLDivElement>(null)

  const [offset, setOffset] = React.useState<number>(0)
  const [totalMessages, setTotalMessages] = React.useState<number>(0)
  const [isPriviousMsgLoading, setIsPriviousMsgLoading] =
    React.useState<boolean>(false)
  const { fetchChatHistory, saveChatHistory } = useIndexDB()
  const { getPromptAPIsession } = useChromeAI()

  const inputFieldRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (lastMessageRef.current && !isPriviousMsgLoading) {
      lastMessageRef.current.scrollIntoView({ behavior: 'smooth' })
    }
    setTimeout(() => {
      inputFieldRef.current?.focus()
    }, 0)
  }, [chatHistory, isResponseLoading, visible])


  const handleGenerateAIResponse = async (): Promise<void> => {



    const PCH = parseChatHistory(chatHistory)

    const { error, success } = await modalService.generate({
      prompt: `${value}`,
      systemPrompt: systemPromptModified,
      messages: PCH,
    })

    if (error) {
      const errorMessage: ChatHistory = {
        role: 'assistant',
        content: error.message,
      }
      await saveChatHistory(problemName, [
        ...priviousChatHistory,
        { role: 'user', content: value },
        errorMessage,
      ])
      setPreviousChatHistory((prev) => [...prev, errorMessage])
      setChatHistory((prev) => {
        const updatedChatHistory: ChatHistory[] = [...prev, errorMessage]
        return updatedChatHistory
      })
      lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    if (success) {
      const res: ChatHistory = {
        role: 'assistant',
        content: success,
      }
      await saveChatHistory(problemName, [
        ...priviousChatHistory,
        { role: 'user', content: value },
        res,
      ])
      setPreviousChatHistory((prev) => [...prev, res])
      setChatHistory((prev) => [...prev, res])
      setValue('')
      lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    setIsResponseLoading(false)
    setTimeout(() => {
      inputFieldRef.current?.focus()
    }, 0)
  }

  const loadInitialChatHistory = async () => {
    const { totalMessageCount, chatHistory, allChatHistory } =
      await fetchChatHistory(problemName, LIMIT_VALUE, 0)
    setPreviousChatHistory(allChatHistory || [])

    setTotalMessages(totalMessageCount)
    setChatHistory(chatHistory)
    setOffset(LIMIT_VALUE)
  }

  useEffect(() => {
    loadInitialChatHistory()
  }, [problemName])

  const loadMoreMessages = async () => {
    if (totalMessages < offset) {
      return
    }
    setIsPriviousMsgLoading(true)
    const { chatHistory: moreMessages } = await fetchChatHistory(
      problemName,
      LIMIT_VALUE,
      offset
    )

    if (moreMessages.length > 0) {
      setChatHistory((prev) => [...moreMessages, ...prev]) // Correctly merge the new messages with the previous ones
      setOffset((prevOffset) => prevOffset + LIMIT_VALUE)
    }

    setTimeout(() => {
      setIsPriviousMsgLoading(false)
    }, 500)
  }

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget
    if (target.scrollTop === 0) {
      console.log('Reached the top, loading more messages...')
      loadMoreMessages()
    }
  }

  const onSendMessage = async (value: string) => {
    setIsResponseLoading(true)
    const newMessage: ChatHistory = { role: 'user', content: value }

    setPreviousChatHistory((prev) => {
      return [...prev, newMessage]
    })
    setChatHistory([...chatHistory, newMessage])

    lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' })
    handleGenerateAIResponse()
  }

  if (!visible) return <></>

  return (
    <Card className="mb-2 ">
      <div className="flex gap-2 items-center justify-between h-20 rounded-t-lg p-4">
        <div className="flex gap-2 items-center justify-start">
          <div className="bg-white rounded-full p-2">
            <Bot color="#000" className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Need Help?</h3>
            <h6 className="font-normal text-xs">Always online</h6>
          </div>
        </div>
      </div>
      <CardContent className="p-2">
        {chatHistory.length > 0 ? (
          <ScrollArea
            className="space-y-4 h-[500px] w-[400px] p-2"
            ref={scrollAreaRef}
            onScroll={handleScroll}
          >
            {totalMessages > offset && (
              <div className="flex w-full items-center justify-center">
                <Button
                  className="text-sm p-1 m-x-auto bg-transpernent text-white hover:bg-transpernent"
                  onClick={loadMoreMessages}
                >
                  Load Previous Messages
                </Button>
              </div>
            )}
            {chatHistory.map((message, index) => (
              <div
                key={index}
                className={cn(
                  'flex w-max max-w-[75%] flex-col gap-2 px-3 py-2 text-sm my-4',
                  message.role === 'user'
                    ? 'ml-auto bg-primary text-primary-foreground rounded-bl-lg rounded-tl-lg rounded-tr-lg '
                    : 'bg-muted rounded-br-lg rounded-tl-lg rounded-tr-lg'
                )}
              >
                <>
                  <p className="max-w-80">
                    {typeof message.content === 'string'
                      ? message.content
                      : message.content.feedback}
                  </p>

                  {!(typeof message.content === 'string') && (
                    <Accordion type="multiple">
                      {message.content?.hints &&
                        message.content.hints.length > 0 && (
                          <AccordionItem value="item-1" className="max-w-80">
                            <AccordionTrigger>Hints 👀</AccordionTrigger>
                            <AccordionContent>
                              <ul className="space-y-4">
                                {message.content?.hints?.map((e) => (
                                  <li key={e}>{e}</li>
                                ))}
                              </ul>
                            </AccordionContent>
                          </AccordionItem>
                        )}
                      {message.content?.snippet && (
                        <AccordionItem value="item-2" className="max-w-80">
                          <AccordionTrigger>Code 🧑🏻‍💻</AccordionTrigger>

                          <AccordionContent>
                            <div className="mt-4 rounded-md">
                              <div className="relative">
                                <Copy
                                  onClick={() => {
                                    if (typeof message.content !== 'string')
                                      navigator.clipboard.writeText(
                                        `${message.content?.snippet}`
                                      )
                                  }}
                                  className="absolute right-2 top-2 h-4 w-4"
                                />
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      )}
                    </Accordion>
                  )}
                </>
              </div>
            ))}
            {isResponseLoading && (
              <div className={'flex w-max max-w-[75%] flex-col my-2'}>
                <div className="w-5 h-5 rounded-full animate-pulse bg-primary"></div>
              </div>
            )}
            <div ref={lastMessageRef} />
          </ScrollArea>
        ) : (
          <div>
            <p className="flex items-center justify-center h-[510px] w-[400px] text-center space-y-4">
              No messages yet.
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            if (value.trim().length === 0) return
            onSendMessage(value)
            setValue('')
          }}
          className="flex w-full items-center space-x-2"
        >
          <Input
            id="message"
            placeholder="Type your message..."
            className="flex-1"
            autoComplete="off"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            disabled={isResponseLoading}
            required
            ref={inputFieldRef}
          />
          <Button
            type="submit"
            className="bg-[#fafafa] rounded-lg text-black"
            size="icon"
            disabled={value.length === 0}
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}
