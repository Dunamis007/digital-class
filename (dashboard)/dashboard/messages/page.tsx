'use client'

import { useState, useRef, useEffect, useCallback } from "react"
import Link from "next/link"
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { 
  Bot,
  Send,
  ArrowLeft,
  Clock,
  Coins,
  Brain,
  FileText,
  Rocket,
  Target,
  Dumbbell,
  Code,
  BarChart3,
  Users,
  Sparkles,
  MessageSquare,
  GraduationCap
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  useStudentStore, 
  MOCK_DEPARTMENTS 
} from "@/lib/stores/student-store"
import { BOT_DEFINITIONS } from "@/lib/types/bot-system"
import { COUNCIL_BOT_ORDER } from "@/lib/council/constants"

// Bot icon mapping
const BOT_ICONS: Record<string, React.ElementType> = {
  mr_timekeeper: Clock,
  mama_token: Coins,
  prof_brain: Brain,
  exam_master: FileText,
  captain_career: Rocket,
  aunty_focus: Target,
  oga_mentor: Dumbbell,
  tech_bro: Code,
  sharp_guy: BarChart3,
  miss_social: Users,
}

const BOT_ORDER = [...COUNCIL_BOT_ORDER]

type BotStatus = 'active' | 'monitoring' | 'alert'

interface BotCardData {
  id: string
  name: string
  subtitle: string
  emoji: string
  color: string
  status: BotStatus
  lastMessage?: string
  catchphrase: string
}

function getBotCards(): BotCardData[] {
  return BOT_ORDER.map(botId => {
    const bot = BOT_DEFINITIONS[botId]
    const statusMap: Record<string, BotStatus> = {
      mr_timekeeper: 'monitoring',
      mama_token: 'active',
      prof_brain: 'active',
      exam_master: 'monitoring',
      captain_career: 'active',
      aunty_focus: 'alert',
      oga_mentor: 'active',
      tech_bro: 'active',
      sharp_guy: 'monitoring',
      miss_social: 'active',
    }
    
    return {
      id: botId,
      name: bot.name,
      subtitle: bot.description,
      emoji: bot.metadata?.emoji || '🤖',
      color: bot.metadata?.color || '#3B82F6',
      status: statusMap[botId] || 'active',
      lastMessage: bot.catchphrase,
      catchphrase: bot.catchphrase,
    }
  })
}

// Individual Bot Chat Component
function BotChatInterface({ 
  botId, 
  onBack,
  studentData 
}: { 
  botId: string; 
  onBack: () => void;
  studentData: {
    name: string;
    tokens: number;
    cgpa: number;
    department: string;
    loginStreak: number;
  }
}) {
  const bot = BOT_DEFINITIONS[botId]
  const Icon = BOT_ICONS[botId] || Bot
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/bots/chat',
      prepareSendMessagesRequest: ({ id, messages: msgs, body }) => ({
        body: {
          ...(body || {}),
          messages: msgs,
          id,
          botId,
          studentData,
        },
      }),
    }),
    id: `bot-${botId}`,
  })

  const isLoading = status === 'streaming' || status === 'submitted'

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    sendMessage({ text: input })
    setInput('')
  }

  // Extract text from message parts
  const getMessageText = (message: typeof messages[0]) => {
    if (!message.parts || !Array.isArray(message.parts)) return ''
    return message.parts
      .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
      .map((p) => p.text)
      .join('')
  }

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      {/* Chat Header */}
      <div 
        className="flex items-center gap-3 p-4 border-b"
        style={{ borderBottomColor: `${bot.metadata?.color}30` }}
      >
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div 
          className="flex h-10 w-10 items-center justify-center rounded-full text-white"
          style={{ backgroundColor: bot.metadata?.color }}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold">{bot.name}</h3>
          <p className="text-xs text-muted-foreground">{bot.description}</p>
        </div>
        <Badge 
          variant="outline" 
          className="text-xs"
          style={{ 
            borderColor: bot.metadata?.color,
            color: bot.metadata?.color 
          }}
        >
          Online
        </Badge>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {/* Welcome message */}
          {messages.length === 0 && (
            <div className="flex gap-3">
              <Avatar>
                <AvatarFallback style={{ backgroundColor: bot.metadata?.color, color: 'white' }}>
                  {bot.metadata?.emoji}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div 
                  className="rounded-lg p-3 max-w-[80%]"
                  style={{ backgroundColor: `${bot.metadata?.color}10` }}
                >
                  <p className="text-sm">{bot.catchphrase}</p>
                  <p className="text-sm mt-2">
                    How can I help you today, {studentData.name.split(' ')[0]}?
                  </p>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Just now</p>
              </div>
            </div>
          )}

          {/* Chat messages */}
          {messages.map((message) => (
            <div 
              key={message.id}
              className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <Avatar>
                <AvatarFallback 
                  style={{ 
                    backgroundColor: message.role === 'user' ? '#3B82F6' : bot.metadata?.color,
                    color: 'white'
                  }}
                >
                  {message.role === 'user' ? studentData.name[0] : bot.metadata?.emoji}
                </AvatarFallback>
              </Avatar>
              <div className={`flex-1 ${message.role === 'user' ? 'flex justify-end' : ''}`}>
                <div 
                  className={`rounded-lg p-3 max-w-[80%] ${
                    message.role === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : ''
                  }`}
                  style={message.role !== 'user' ? { backgroundColor: `${bot.metadata?.color}10` } : {}}
                >
                  <p className="text-sm whitespace-pre-wrap">{getMessageText(message)}</p>
                </div>
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex gap-3">
              <Avatar>
                <AvatarFallback style={{ backgroundColor: bot.metadata?.color, color: 'white' }}>
                  {bot.metadata?.emoji}
                </AvatarFallback>
              </Avatar>
              <div 
                className="rounded-lg p-3"
                style={{ backgroundColor: `${bot.metadata?.color}10` }}
              >
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Message ${bot.name}...`}
            disabled={isLoading}
            className="flex-1"
          />
          <Button 
            type="submit" 
            disabled={!input.trim() || isLoading}
            style={{ backgroundColor: bot.metadata?.color }}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  )
}

// Bot Card Component
function BotCard({ 
  bot, 
  onClick 
}: { 
  bot: BotCardData; 
  onClick: () => void 
}) {
  const Icon = BOT_ICONS[bot.id] || Bot
  
  const statusColors = {
    active: 'bg-green-500',
    monitoring: 'bg-yellow-500',
    alert: 'bg-red-500',
  }

  const statusLabels = {
    active: 'Active',
    monitoring: 'Monitoring',
    alert: 'Alert',
  }

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-all hover:border-primary/50 group"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div 
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-white relative"
            style={{ backgroundColor: bot.color }}
          >
            <Icon className="h-6 w-6" />
            <span 
              className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-background ${statusColors[bot.status]}`}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm truncate">{bot.name}</h3>
              <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                {statusLabels[bot.status]}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{bot.subtitle}</p>
            <p className="text-xs text-muted-foreground/70 line-clamp-1 mt-1 italic">
              &ldquo;{bot.lastMessage?.slice(0, 40)}...&rdquo;
            </p>
          </div>
        </div>
        <Button 
          size="sm" 
          className="w-full mt-3 group-hover:bg-primary"
          variant="outline"
          style={{ 
            '--hover-bg': bot.color 
          } as React.CSSProperties}
        >
          <MessageSquare className="h-3 w-3 mr-2" />
          Visit Office
        </Button>
      </CardContent>
    </Card>
  )
}

export default function MessagesPage() {
  const [selectedBot, setSelectedBot] = useState<string | null>(null)
  
  const {
    isOnboarded,
    fullName,
    currentTokens,
    currentCgpa,
    departmentId,
    loginStreak,
  } = useStudentStore()

  const department = MOCK_DEPARTMENTS.find(d => d.id === departmentId)
  const botCards = getBotCards()

  const studentData = {
    name: fullName || 'Student',
    tokens: currentTokens,
    cgpa: currentCgpa,
    department: department?.name || 'Unknown',
    loginStreak: loginStreak,
  }

  if (!isOnboarded) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <Bot className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <CardTitle>Complete Your Enrollment</CardTitle>
            <CardDescription>
              Please complete the onboarding process to access the Student Council.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" asChild>
              <Link href="/dashboard/onboarding">Start Enrollment</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show individual bot chat
  if (selectedBot) {
    return (
      <BotChatInterface 
        botId={selectedBot} 
        onBack={() => setSelectedBot(null)}
        studentData={studentData}
      />
    )
  }

  // Show student council grid
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold md:text-3xl flex items-center gap-2">
          <Sparkles className="h-8 w-8 text-accent" />
          Student Council
        </h1>
        <p className="text-muted-foreground mt-1">
          Your 10 AI-powered Student Council Offices - each with a unique Nigerian personality
        </p>
      </div>

      {/* Introduction Card */}
      <Card className="bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 border-primary/20">
        <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <GraduationCap className="h-7 w-7 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">Welcome, {fullName.split(' ')[0]}!</h3>
            <p className="text-sm text-muted-foreground">
              Visit your Student Council Offices. Each of the 10 offices specializes in different aspects of your 
              academic journey - from scheduling to career guidance. Click any office to visit!
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Bot Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {botCards.map((bot) => (
          <BotCard 
            key={bot.id} 
            bot={bot} 
            onClick={() => setSelectedBot(bot.id)} 
          />
        ))}
      </div>

      {/* Peer Messages Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Peer Messages
          </CardTitle>
          <CardDescription>
            Connect with fellow students in your department
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No peer messages yet</p>
            <p className="text-sm">
              Student Affairs & Engagement Office will notify you when study circles are available!
            </p>
            <Button variant="outline" className="mt-4" onClick={() => setSelectedBot('miss_social')}>
              Visit Student Affairs Office
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
