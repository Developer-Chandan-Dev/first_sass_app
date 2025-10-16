'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BookOpen,
  DollarSign,
  TrendingUp,
  Wallet,
  PieChart,
  Settings,
  Plus,
  Download,
  Search,
  BarChart3,
  Target,
  Bell,
  Calendar,
  Link as LinkIcon,
} from 'lucide-react';
import Link from 'next/link';

export default function GuidePage() {
  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-6xl">
      <div className="text-center mb-4 sm:mb-8">
        <h1 className="text-2xl sm:text-4xl font-bold mb-2 sm:mb-4">
          💰 Expense Management Guide
        </h1>
        <p className="text-sm sm:text-xl text-muted-foreground mb-4 sm:mb-6">
          Complete guide to managing your finances with our advanced expense
          tracker
        </p>
        <div className="sm:flex sm:flex-row justify-center gap-2 sm:gap-4">
          <Link href="/dashboard">
            <Button className="w-full sm:w-auto">
              <BarChart3 className="mr-2 h-4 w-4" />
              Go to Dashboard
            </Button>
          </Link>
          <Link href="/sign-up">
            <Button variant="outline" className="w-full sm:w-auto max-sm:mt-2">
              <Plus className="mr-2 h-4 w-4" />
              Get Started
            </Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4 sm:space-y-6">
        <div className="overflow-x-auto">
          <TabsList className="flex w-max min-w-full">
            <TabsTrigger
              value="overview"
              className="text-xs sm:text-sm whitespace-nowrap"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="income"
              className="text-xs sm:text-sm whitespace-nowrap"
            >
              Income
            </TabsTrigger>
            <TabsTrigger
              value="expenses"
              className="text-xs sm:text-sm whitespace-nowrap"
            >
              Expenses
            </TabsTrigger>
            <TabsTrigger
              value="balance"
              className="text-xs sm:text-sm whitespace-nowrap"
            >
              Balance
            </TabsTrigger>
            <TabsTrigger
              value="features"
              className="text-xs sm:text-sm whitespace-nowrap"
            >
              Features
            </TabsTrigger>
            <TabsTrigger
              value="tips"
              className="text-xs sm:text-sm whitespace-nowrap"
            >
              Tips
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Application Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Our expense management system helps you track income and
                expenses with advanced balance management. You can connect
                income sources to expenses for automatic balance calculation.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm sm:text-base">
                    Key Concepts:
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mt-0.5 flex-shrink-0" />
                      <span className="text-xs sm:text-sm">
                        <strong>Connected Income:</strong> Affects balance
                        calculation
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full mt-0.5 flex-shrink-0" />
                      <span className="text-xs sm:text-sm">
                        <strong>Unconnected Income:</strong> Tracking only
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full mt-0.5 flex-shrink-0" />
                      <span className="text-xs sm:text-sm">
                        <strong>Balance-Affecting Expense:</strong> Reduces from
                        connected income
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-3 h-3 bg-gray-500 rounded-full mt-0.5 flex-shrink-0" />
                      <span className="text-xs sm:text-sm">
                        <strong>Regular Expense:</strong> Tracking only
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-sm sm:text-base">
                    Main Features:
                  </h3>
                  <ul className="space-y-1 text-xs sm:text-sm">
                    <li>• Income & Expense Tracking</li>
                    <li>• Balance Management</li>
                    <li>• Budget Planning</li>
                    <li>• Advanced Analytics</li>
                    <li>• Data Export (PDF/CSV)</li>
                    <li>• Recurring Transactions</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Start Guide</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="text-center p-3 sm:p-4 border rounded-lg">
                  <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 text-green-600" />
                  <h3 className="font-semibold mb-2 text-sm sm:text-base">
                    1. Add Income
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Start by adding your income sources with connection options
                  </p>
                </div>
                <div className="text-center p-3 sm:p-4 border rounded-lg">
                  <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 text-red-600" />
                  <h3 className="font-semibold mb-2 text-sm sm:text-base">
                    2. Track Expenses
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Add expenses and choose if they affect your balance
                  </p>
                </div>
                <div className="text-center p-3 sm:p-4 border rounded-lg">
                  <Wallet className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 text-blue-600" />
                  <h3 className="font-semibold mb-2 text-sm sm:text-base">
                    3. Monitor Balance
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    View your real-time balance and financial insights
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="income" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                Income Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold">Adding Income Sources</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm sm:text-base">
                      Step-by-Step:
                    </h4>
                    <ol className="list-decimal list-inside space-y-1 sm:space-y-2 text-xs sm:text-sm">
                      <li>Navigate to Dashboard → Income</li>
                      <li>Click &quot;Add Income&quot; button</li>
                      <li>Fill in amount and source</li>
                      <li>Add description</li>
                      <li>Choose connection option</li>
                      <li>Set recurring if applicable</li>
                      <li>Save the income</li>
                    </ol>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm sm:text-base">
                      Income Types:
                    </h4>
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      <Badge variant="outline" className="text-xs">
                        Salary
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Freelancing
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Business
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Investment
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Rental
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Commission
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Bonus
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Other
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Connection Options</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="border-blue-200">
                    <CardHeader className="pb-2 sm:pb-3">
                      <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                        <LinkIcon className="h-4 w-4 text-blue-600" />
                        Connected Income
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="text-xs sm:text-sm space-y-1">
                        <li>• Affects balance calculation</li>
                        <li>• Expenses can reduce from it</li>
                        <li>• Shows blue indicator (•)</li>
                        <li>• Used for budget management</li>
                      </ul>
                    </CardContent>
                  </Card>
                  <Card className="border-green-200">
                    <CardHeader className="pb-2 sm:pb-3">
                      <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        Unconnected Income
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="text-sm space-y-1">
                        <li>• Tracking purposes only</li>
                        <li>• Doesn&apos;t affect balance</li>
                        <li>• Shows in total income</li>
                        <li>• Good for gifts, bonuses</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-red-600" />
                Expense Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold">Adding Expenses</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-medium">Process:</h4>
                    <ol className="list-decimal list-inside space-y-2 text-sm">
                      <li>Go to Dashboard → Expenses</li>
                      <li>Click &quot;Add Expense&quot;</li>
                      <li>Enter amount and category</li>
                      <li>Describe the expense</li>
                      <li>Set date</li>
                      <li>Choose balance option</li>
                      <li>Set recurring if needed</li>
                    </ol>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-medium">Categories:</h4>
                    <div className="grid grid-cols-2 gap-1">
                      <Badge variant="secondary">Food & Dining</Badge>
                      <Badge variant="secondary">Transportation</Badge>
                      <Badge variant="secondary">Entertainment</Badge>
                      <Badge variant="secondary">Groceries</Badge>
                      <Badge variant="secondary">Shopping</Badge>
                      <Badge variant="secondary">Healthcare</Badge>
                      <Badge variant="secondary">Utilities</Badge>
                      <Badge variant="secondary">Education</Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Expense Types</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="border-red-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Wallet className="h-4 w-4 text-red-600" />
                        Balance-Affecting
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="text-sm space-y-1">
                        <li>• Reduces from connected income</li>
                        <li>• Affects balance calculation</li>
                        <li>• Shows red indicator (•)</li>
                        <li>• Use for regular expenses</li>
                      </ul>
                    </CardContent>
                  </Card>
                  <Card className="border-gray-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-gray-600" />
                        Regular Tracking
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="text-sm space-y-1">
                        <li>• Tracking purposes only</li>
                        <li>• Doesn&apos;t affect balance</li>
                        <li>• Shows in total expenses</li>
                        <li>• Good for business expenses</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="balance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-blue-600" />
                Balance Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <h3 className="font-semibold mb-2">Balance Formula</h3>
                <p className="text-sm">
                  <strong>
                    Balance = Connected Income - Balance-Affecting Expenses
                  </strong>
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Example Scenario</h3>
                <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg space-y-2 border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between">
                    <span>Salary (Connected): </span>
                    <span className="text-blue-600">+₹50,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Freelance (Unconnected): </span>
                    <span className="text-green-600">+₹10,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rent (Balance-Affecting): </span>
                    <span className="text-red-600">-₹15,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Business Expense (Regular): </span>
                    <span className="text-gray-600">-₹5,000</span>
                  </div>
                  <hr />
                  <div className="flex justify-between font-semibold">
                    <span>Balance: </span>
                    <span className="text-blue-600">₹35,000</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Total Income: </span>
                    <span>₹60,000</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Total Expenses: </span>
                    <span>₹20,000</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Search & Filter
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Search by description or category</li>
                  <li>• Filter by date range</li>
                  <li>• Filter by category</li>
                  <li>• Filter by recurring status</li>
                  <li>• Sort by any column</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Export Options
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Export to CSV format</li>
                  <li>• Generate PDF reports</li>
                  <li>• Customizable PDF layouts</li>
                  <li>• Include/exclude columns</li>
                  <li>• Date format options</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Spending trend charts</li>
                  <li>• Category breakdown</li>
                  <li>• Monthly comparisons</li>
                  <li>• Balance history</li>
                  <li>• Income vs expense analysis</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Recurring Transactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Daily, weekly, monthly, yearly</li>
                  <li>• Automatic tracking</li>
                  <li>• Easy management</li>
                  <li>• Frequency indicators</li>
                  <li>• Bulk operations</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tips" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-600" />
                  Best Practices
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Connect your main income sources</li>
                  <li>• Use balance-affecting for regular expenses</li>
                  <li>• Keep business expenses separate</li>
                  <li>• Set up recurring transactions</li>
                  <li>• Review balance regularly</li>
                  <li>• Export data monthly</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-orange-600" />
                  Common Mistakes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Not connecting regular income</li>
                  <li>• Making all expenses balance-affecting</li>
                  <li>• Forgetting to categorize properly</li>
                  <li>• Not using recurring for regular items</li>
                  <li>• Mixing personal and business expenses</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-blue-600" />
                  Pro Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Use bulk operations for efficiency</li>
                  <li>• Leverage search for quick finding</li>
                  <li>• Export reports for tax purposes</li>
                  <li>• Monitor balance trends</li>
                  <li>• Set up budget categories</li>
                  <li>• Use descriptive transaction names</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-purple-600" />
                  Quick Reference
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium mb-1">Visual Indicators:</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        <span>Connected Income</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full" />
                        <span>Balance-Affecting Expense</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
