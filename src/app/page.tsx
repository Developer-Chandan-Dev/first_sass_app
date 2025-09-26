import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/users/navbar';
import { Footer } from '@/components/users/footer';
import { SmartNavigationButton } from '@/components/common/smart-navigation-button';
import { 
  TrendingUp, 
  PieChart, 
  Shield, 
  Brain, 
  Smartphone, 
  ArrowRight,
  CheckCircle,
  Globe,
  Star
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/50 to-background dark:from-blue-900/20 dark:via-purple-900/20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 dark:bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 dark:bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-blue-100 dark:bg-muted text-blue-700 dark:text-foreground border-blue-200 dark:border-border">
              🚀 AI-Powered Financial Intelligence
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                TrackWise
              </span>
              <br />
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-foreground dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent">
                The Future of Expense Tracking
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 dark:text-muted-foreground mb-8 leading-relaxed">
              Take control of your finances with intelligent expense tracking and budget management. 
              Get insights, set budgets, and achieve your financial goals with TrackWise.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <SmartNavigationButton 
                size="lg" 
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-8 py-6"
                signedInText="Go to Dashboard"
                signedOutText="Start Free Trial"
                signedInHref="/dashboard"
                signedOutHref="/register"
              >
                <ArrowRight className="ml-2 w-5 h-5" />
              </SmartNavigationButton>
              <Button size="lg" variant="outline" asChild className="border-gray-300 dark:border-border text-gray-700 dark:text-foreground hover:bg-gray-100 dark:hover:bg-muted text-lg px-8 py-6">
                <Link href="/guide">Read Guide</Link>
              </Button>
            </div>
            
            <div className="flex items-center justify-center flex-wrap gap-4 sm:gap-8 text-sm text-gray-500 dark:text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400" />
                No credit card required
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400" />
                14-day free trial
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400" />
                Cancel anytime
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-500/10 text-blue-400 border-blue-500/20">
              Features
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Intelligent Financial
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Management</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Experience the next generation of expense tracking with AI-driven insights and automation
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Brain className="w-8 h-8" />,
                title: "AI-Powered Insights",
                description: "Machine learning algorithms analyze your spending patterns and provide personalized recommendations"
              },
              {
                icon: <TrendingUp className="w-8 h-8" />,
                title: "Predictive Analytics",
                description: "Forecast future expenses and identify potential savings opportunities before they happen"
              },
              {
                icon: <PieChart className="w-8 h-8" />,
                title: "Smart Categorization",
                description: "Automatic expense categorization with 99% accuracy using advanced pattern recognition"
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Bank-Level Security",
                description: "Enterprise-grade encryption and security protocols protect your financial data"
              },
              {
                icon: <Smartphone className="w-8 h-8" />,
                title: "Mobile-First Design",
                description: "Seamless experience across all devices with real-time synchronization"
              },
              {
                icon: <Globe className="w-8 h-8" />,
                title: "Global Currency Support",
                description: "Track expenses in 150+ currencies with real-time exchange rates"
              }
            ].map((feature, index) => (
              <Card key={index} className="bg-card border-border hover:bg-muted/50 transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="text-blue-400 mb-4 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-blue-900/10 to-purple-900/10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "1M+", label: "Active Users" },
              { number: "$50B+", label: "Tracked Expenses" },
              { number: "99.9%", label: "Uptime" },
              { number: "150+", label: "Countries" }
            ].map((stat, index) => (
              <div key={index}>
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-purple-500/10 text-purple-400 border-purple-500/20">
              Pricing
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Choose Your
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Plan</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Flexible pricing for individuals and teams
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {[
              {
                name: "Free",
                price: "$0",
                period: "forever",
                features: ["Basic expense tracking", "5 categories", "Mobile app", "Email support"],
                popular: false
              },
              {
                name: "Pro",
                price: "$9",
                period: "per month",
                features: ["Unlimited tracking", "AI insights", "Advanced analytics", "Priority support"],
                popular: true
              },
              {
                name: "Premium",
                price: "$19",
                period: "per month",
                features: ["Team collaboration", "Custom categories", "API access", "White-label options"],
                popular: false
              },
              {
                name: "Ultra",
                price: "$29",
                period: "per month",
                features: ["Enterprise features", "Dedicated support", "Custom integrations", "SLA guarantee"],
                popular: false
              }
            ].map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? 'bg-gradient-to-b from-blue-500/10 to-purple-500/10 border-blue-500/30' : 'bg-card border-border'} hover:scale-105 transition-all duration-300`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-primary-foreground">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-semibold mb-2 text-foreground">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground">/{plan.period}</span>
                  </div>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${plan.popular ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700' : 'bg-muted hover:bg-muted/80'}`}
                    asChild
                  >
                    <Link href="/register">Get Started</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-r from-purple-900/10 to-blue-900/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-yellow-500/10 text-yellow-400 border-yellow-500/20">
              Testimonials
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Loved by
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Thousands</span>
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Chen",
                role: "Startup Founder",
                content: "TrackWise's AI insights helped me reduce business expenses by 30%. The predictive analytics are game-changing.",
                rating: 5
              },
              {
                name: "Marcus Johnson",
                role: "Freelancer",
                content: "Finally, an expense tracker that understands my workflow. The automation saves me hours every week.",
                rating: 5
              },
              {
                name: "Emily Rodriguez",
                role: "Finance Manager",
                content: "The team collaboration features are incredible. We've streamlined our entire expense approval process.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <Card key={index} className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">&quot;{testimonial.content}&quot;</p>
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform Your
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Finances?</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join millions of users who have revolutionized their financial management with AI-powered insights.
            </p>
            <Button size="lg" asChild className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-8 py-6">
              <Link href="/register">
                Start Your Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}