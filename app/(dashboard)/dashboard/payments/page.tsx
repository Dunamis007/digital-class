'use client'

import { useState } from "react"
import Link from "next/link"
import { 
  CreditCard,
  Check,
  X,
  Crown,
  Star,
  Zap,
  Trophy,
  Gem,
  Coins,
  Gift,
  BookOpen,
  Bot,
  Award,
  FileText,
  Users,
  Globe,
  Briefcase,
  GraduationCap,
  Clock,
  ArrowRight
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  useStudentStore,
  getTokenLevelDisplay,
  getProgressToNextLevel,
} from "@/lib/stores/student-store"
import { TOKEN_LEVEL_NAMES } from "@/lib/types/school-system"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Switch } from "@/components/ui/switch"

// Payment tiers as specified
const PAYMENT_TIERS = [
  {
    id: 'tier-1',
    name: 'Ajebutter Starter',
    price: 5000,
    features: [
      { text: '2 courses', included: true },
      { text: '3 offices access', included: true },
      { text: 'Basic certificate', included: true },
      { text: 'Live sessions', included: false },
      { text: 'Career coaching', included: false },
      { text: 'Full Student Council', included: false },
    ],
    tokensIncluded: 100,
    icon: Star,
    color: 'bg-gray-500',
  },
  {
    id: 'tier-2',
    name: 'Area Scholar',
    price: 15000,
    features: [
      { text: '5 courses', included: true },
      { text: '6 offices access', included: true },
      { text: 'Standard certificate', included: true },
      { text: 'Weekly live sessions', included: true },
      { text: '1-on-1 mentorship', included: false },
      { text: 'Career roadmap', included: false },
    ],
    tokensIncluded: 500,
    icon: Zap,
    color: 'bg-blue-500',
  },
  {
    id: 'tier-3',
    name: 'Sharpman Level',
    price: 50000,
    popular: true,
    features: [
      { text: '10 courses', included: true },
      { text: 'All 10 offices', included: true },
      { text: 'Premium certificate', included: true },
      { text: 'Daily live sessions', included: true },
      { text: 'Career roadmap', included: true },
      { text: 'Certificate upgrade', included: false },
    ],
    tokensIncluded: 2000,
    icon: Trophy,
    color: 'bg-orange-500',
  },
  {
    id: 'tier-4',
    name: 'Omo Professor',
    price: 200000,
    features: [
      { text: 'Unlimited courses', included: true },
      { text: 'All 10 offices (priority)', included: true },
      { text: 'Platinum certificate', included: true },
      { text: '1-on-1 OGA Mentor sessions', included: true },
      { text: 'Internship referrals', included: true },
      { text: 'International partnerships', included: false },
    ],
    tokensIncluded: 10000,
    icon: Crown,
    color: 'bg-purple-500',
  },
  {
    id: 'tier-5',
    name: 'DUNAMIS LEGEND',
    price: 700000,
    features: [
      { text: 'Everything unlocked', included: true },
      { text: 'International certificate', included: true },
      { text: 'Job placement assistance', included: true },
      { text: 'Lifetime access', included: true },
      { text: 'Alumni board membership', included: true },
      { text: 'Global recognition', included: true },
    ],
    tokensIncluded: 50000,
    icon: Gem,
    color: 'bg-cyan-500',
  },
]

// Token redemption options
const TOKEN_REDEMPTIONS = [
  {
    id: 'redeem-1',
    title: 'Unlock Course Module',
    description: 'Unlock access to a locked course module',
    cost: 500,
    icon: BookOpen,
  },
  {
    id: 'redeem-2',
    title: 'Early Certificate',
    description: 'Get your certificate before course completion',
    cost: 1000,
    icon: Award,
  },
  {
    id: 'redeem-3',
    title: 'Priority Office Response',
    description: 'Get faster responses from Student Council',
    cost: 200,
    icon: Bot,
  },
  {
    id: 'redeem-4',
    title: 'Study Material PDF',
    description: 'Download premium study materials',
    cost: 100,
    icon: FileText,
  },
]

// Mock payment history
const MOCK_PAYMENT_HISTORY = [
  {
    id: 'pay-1',
    date: '2024-01-15',
    amount: 15000,
    description: 'Area Scholar Plan - Monthly',
    status: 'completed',
  },
  {
    id: 'pay-2',
    date: '2024-01-01',
    amount: 5000,
    description: 'Ajebutter Starter Plan - Upgrade',
    status: 'completed',
  },
]

function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(amount)
}

const EDU_SPEND = [
  { id: 'skip-quiz', title: 'Skip a quiz (retake later)', cost: 300, description: 'Skip current quiz; you can retake later.' },
  { id: 'unlock-lesson', title: 'Unlock next lesson early', cost: 500, description: 'Bypass timer gate for the next lesson.' },
  { id: 'instant-cert', title: 'Instant certificate', cost: 1000, description: 'Certificate now vs standard wait.' },
  { id: 'priority-ai', title: 'Priority AI tutor response', cost: 200, description: 'Faster queue for council AI replies.' },
  { id: 'lesson-pdf', title: 'Download lesson as PDF', cost: 150, description: 'Export this lesson pack as PDF.' },
  { id: 'premium-course', title: 'Unlock premium course content', cost: 2000, description: 'Access premium module bundle.' },
]

export default function PaymentsPage() {
  const [selectedTier, setSelectedTier] = useState<string | null>(null)
  const [spendTarget, setSpendTarget] = useState<(typeof EDU_SPEND)[number] | null>(null)
  const [autoRenew, setAutoRenew] = useState(true)
  
  const {
    isOnboarded,
    fullName,
    currentTokens,
    tokenLevel,
    currentTier,
    tokenTransactions,
    loseTokens,
  } = useStudentStore()

  const levelDisplay = getTokenLevelDisplay(tokenLevel)
  const tierProgress = getProgressToNextLevel(currentTokens)

  // Find current plan (mock - assume tier 2 for demo)
  const currentPlan = PAYMENT_TIERS.find(t => t.id === (currentTier || 'tier-2')) || PAYMENT_TIERS[1]

  if (!isOnboarded) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <CardTitle>Complete Your Enrollment</CardTitle>
            <CardDescription>
              Please complete the onboarding process to view payment options.
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">Payments & Billing</h1>
        <p className="text-muted-foreground mt-1">
          Manage your subscription, EduVault coin wallet, view history, and optional spends (₦1 = 1 EduCoin)
        </p>
      </div>

      {/* Current Plan Card */}
      <Card className="bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 border-primary/20">
        <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className={`flex h-14 w-14 items-center justify-center rounded-full ${currentPlan.color} text-white`}>
              <currentPlan.icon className="h-7 w-7" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Current Plan</p>
              <h3 className="text-xl font-bold">{currentPlan.name}</h3>
              <p className="text-sm text-muted-foreground">{formatPrice(currentPlan.price)}/month</p>
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:items-end">
            <Badge className={`${currentPlan.color} text-white`}>Active</Badge>
            <p className="text-sm text-muted-foreground">Renews on Feb 15, 2024</p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="plans" className="space-y-6">
        <TabsList className="flex flex-wrap h-auto gap-1">
          <TabsTrigger value="plans">Upgrade Plans</TabsTrigger>
          <TabsTrigger value="eduvault">EduVault</TabsTrigger>
          <TabsTrigger value="redeem">Token Redemption</TabsTrigger>
          <TabsTrigger value="history">Payment History</TabsTrigger>
        </TabsList>

        <TabsContent value="eduvault" className="space-y-6">
          <Card className="border-accent/30 bg-gradient-to-r from-accent/10 to-transparent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="h-5 w-5 text-accent" />
                EduVault — your coin wallet
              </CardTitle>
              <CardDescription>Transparent ledger; optional spends always confirm first.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Balance</p>
                  <p className="text-3xl font-bold">{currentTokens.toLocaleString()} EduCoins</p>
                  <p className="text-sm text-muted-foreground">
                    Tier: {levelDisplay.name}
                    {tierProgress.nextLevel
                      ? ` — need ${tierProgress.tokensToNext.toLocaleString()} more EduCoins for ${TOKEN_LEVEL_NAMES[tierProgress.nextLevel]}`
                      : ''}
                  </p>
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-border px-3 py-2">
                  <span className="text-sm">Auto-renew</span>
                  <Switch checked={autoRenew} onCheckedChange={setAutoRenew} aria-label="Subscription auto-renew" />
                </div>
              </div>
              <Progress value={tierProgress.progress} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Weekly engagement: unspent balances above 500 EduCoins may reduce by 5% per week — disclosed in
                onboarding. Countdown to next adjustment is shown here in production.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Transaction history</CardTitle>
              <CardDescription>Date · Description · Amount · Balance</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tokenTransactions.slice(0, 25).map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell className="whitespace-nowrap text-xs">{new Date(tx.timestamp).toLocaleString()}</TableCell>
                      <TableCell className="text-sm">{tx.description}</TableCell>
                      <TableCell className={tx.type === 'earn' ? 'text-green-600' : 'text-orange-600'}>
                        {tx.type === 'earn' ? '+' : '-'}
                        {tx.amount}
                      </TableCell>
                      <TableCell>{tx.balanceAfter}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="grid gap-4 sm:grid-cols-2">
            {EDU_SPEND.map((item) => {
              const can = currentTokens >= item.cost
              return (
                <Card key={item.id} className={!can ? 'opacity-60' : ''}>
                  <CardContent className="space-y-3 p-4">
                    <div>
                      <h4 className="font-semibold">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                      <p className="mt-2 text-sm font-medium text-accent">{item.cost} EduCoins</p>
                    </div>
                    <Button type="button" size="sm" disabled={!can} onClick={() => setSpendTarget(item)}>
                      Spend coins
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* Plans Tab */}
        <TabsContent value="plans" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {PAYMENT_TIERS.map((tier, index) => {
              const isCurrentPlan = tier.id === currentPlan.id
              const Icon = tier.icon
              
              return (
                <Card 
                  key={tier.id}
                  className={`relative ${tier.popular ? 'border-primary shadow-lg' : ''} ${
                    isCurrentPlan ? 'bg-primary/5' : ''
                  }`}
                >
                  {tier.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary">Most Popular</Badge>
                    </div>
                  )}
                  {isCurrentPlan && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge variant="outline" className="bg-background">Current Plan</Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-2">
                    <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full ${tier.color} text-white mb-2`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-lg">{tier.name}</CardTitle>
                    <div className="mt-2">
                      <span className="text-2xl font-bold">{formatPrice(tier.price)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      +{tier.tokensIncluded.toLocaleString()} EduCoins included
                    </p>
                  </CardHeader>
                  
                  <CardContent className="space-y-2">
                    {tier.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        {feature.included ? (
                          <Check className="h-4 w-4 text-green-500 shrink-0" />
                        ) : (
                          <X className="h-4 w-4 text-muted-foreground shrink-0" />
                        )}
                        <span className={!feature.included ? 'text-muted-foreground' : ''}>
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </CardContent>
                  
                  <CardFooter>
                    <Button 
                      className="w-full" 
                      variant={isCurrentPlan ? 'outline' : tier.popular ? 'default' : 'outline'}
                      disabled={isCurrentPlan || index < PAYMENT_TIERS.indexOf(currentPlan)}
                    >
                      {isCurrentPlan ? 'Current Plan' : index < PAYMENT_TIERS.indexOf(currentPlan) ? 'Downgrade' : 'Upgrade'}
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>

          {/* Features Comparison Note */}
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Gift className="h-5 w-5 text-accent mt-0.5" />
                <div>
                  <h4 className="font-medium">Upgrade Benefits</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                  Upgrading your plan gives you access to more courses, full Student Council access,
                  and career opportunities. Higher tiers also include more starter tokens and
                  exclusive features like internship referrals and job placement assistance.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Token Redemption Tab */}
        <TabsContent value="redeem" className="space-y-6">
          {/* Token Balance */}
          <Card className="bg-gradient-to-r from-accent/10 to-accent/5 border-accent/20">
            <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className={`flex h-14 w-14 items-center justify-center rounded-full ${levelDisplay.bgColor}`}>
                  <Coins className={`h-7 w-7 ${levelDisplay.color}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Redeemable EduCoins</p>
                  <h3 className="text-3xl font-bold">{currentTokens.toLocaleString()}</h3>
                  <Badge variant="outline" className={`${levelDisplay.color} ${levelDisplay.bgColor} border-0 mt-1`}>
                    {levelDisplay.name}
                  </Badge>
                </div>
              </div>
              <Button variant="outline" asChild>
                <Link href="/dashboard/progress">
                  View EduCoin history
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Redemption Options */}
          <div className="grid gap-4 sm:grid-cols-2">
            {TOKEN_REDEMPTIONS.map((option) => {
              const canAfford = currentTokens >= option.cost
              const Icon = option.icon
              
              return (
                <Card key={option.id} className={!canAfford ? 'opacity-60' : ''}>
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                      <Icon className="h-6 w-6 text-accent" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{option.title}</h4>
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Coins className="h-3 w-3 text-accent" />
                        <span className="text-sm font-medium">{option.cost} EduCoins</span>
                      </div>
                    </div>
                    <Button 
                      variant={canAfford ? 'default' : 'outline'} 
                      disabled={!canAfford}
                      size="sm"
                    >
                      Redeem
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* How to Earn Tokens */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Zap className="h-5 w-5 text-accent" />
                How to earn more EduCoins
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { action: 'Daily Login', tokens: '+10', icon: Clock },
                  { action: 'Complete Lesson', tokens: '+20', icon: BookOpen },
                  { action: 'Pass Quiz (80%+)', tokens: '+50', icon: Award },
                  { action: 'Complete Course', tokens: '+100', icon: Trophy },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <item.icon className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{item.action}</p>
                      <p className="text-xs text-green-500 font-medium">{item.tokens}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment History Tab */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>
                Your payment and billing history
              </CardDescription>
            </CardHeader>
            <CardContent>
              {MOCK_PAYMENT_HISTORY.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CreditCard className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No payment history yet</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {MOCK_PAYMENT_HISTORY.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>
                          {new Date(payment.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{payment.description}</TableCell>
                        <TableCell className="font-medium">
                          {formatPrice(payment.amount)}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={
                              payment.status === 'completed' 
                                ? 'bg-green-500/10 text-green-600 border-0' 
                                : 'bg-yellow-500/10 text-yellow-600 border-0'
                            }
                          >
                            {payment.status === 'completed' ? 'Completed' : 'Pending'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Methods
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-16 rounded bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
                    Paystack
                  </div>
                  <div>
                    <p className="font-medium">Paystack Payment</p>
                    <p className="text-sm text-muted-foreground">Card, Bank Transfer, USSD</p>
                  </div>
                </div>
                <Badge>Primary</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                All payments are processed securely through Paystack. We accept Visa, Mastercard, 
                Verve cards, bank transfers, and USSD payments.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AlertDialog open={!!spendTarget} onOpenChange={(open) => !open && setSpendTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm EduCoin spend</AlertDialogTitle>
            <AlertDialogDescription>
              Spend {spendTarget?.cost} EduCoins on {spendTarget?.title}? Your new balance will be{' '}
              {spendTarget ? Math.max(0, currentTokens - spendTarget.cost).toLocaleString() : ''} EduCoins. This is logged
              in your EduVault history.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (!spendTarget) return
                loseTokens(spendTarget.cost, `EduVault spend: ${spendTarget.title}`, 'EduVault')
                setSpendTarget(null)
              }}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
