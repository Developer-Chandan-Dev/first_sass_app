import { Metadata } from 'next'
import { Navbar } from '@/components/users/navbar';
import { Footer } from '@/components/users/footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

import { seoConfig } from '@/lib/seo'

export const metadata: Metadata = {
  title: `${seoConfig.siteName} Pricing - Affordable Expense Management Plans`,
  description: `Choose the perfect ${seoConfig.siteName} plan for your expense tracking needs. Free plan available. Pro features starting at $9/month with 14-day free trial.`,
  openGraph: {
    title: `${seoConfig.siteName} Pricing - Affordable Expense Management Plans`,
    description: `Choose the perfect ${seoConfig.siteName} plan for your expense tracking needs.`,
    url: `${seoConfig.siteUrl}/pricing`,
  },
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-yellow-500/10 text-yellow-400 border-yellow-500/20">
              Pricing Plans
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Simple,
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Transparent Pricing</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Choose the perfect plan for your needs. All plans include our core features with no hidden fees.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-16">
            {[
              {
                name: "Free",
                price: "$0",
                period: "forever",
                description: "Perfect for getting started",
                features: [
                  "Basic expense tracking",
                  "5 categories",
                  "Mobile app access",
                  "Email support",
                  "Monthly reports"
                ],
                popular: false,
                cta: "Get Started"
              },
              {
                name: "Pro",
                price: "$9",
                period: "per month",
                description: "For individuals and freelancers",
                features: [
                  "Unlimited tracking",
                  "AI-powered insights",
                  "Advanced analytics",
                  "Priority support",
                  "Custom categories",
                  "Receipt scanning",
                  "Budget management"
                ],
                popular: true,
                cta: "Start Free Trial"
              },
              {
                name: "Premium",
                price: "$19",
                period: "per month",
                description: "For small teams and businesses",
                features: [
                  "Everything in Pro",
                  "Team collaboration",
                  "Multi-currency support",
                  "API access",
                  "Advanced reporting",
                  "White-label options",
                  "Integrations"
                ],
                popular: false,
                cta: "Start Free Trial"
              },
              {
                name: "Ultra",
                price: "$29",
                period: "per month",
                description: "For large organizations",
                features: [
                  "Everything in Premium",
                  "Enterprise features",
                  "Dedicated support",
                  "Custom integrations",
                  "SLA guarantee",
                  "Advanced security",
                  "Training & onboarding"
                ],
                popular: false,
                cta: "Contact Sales"
              }
            ].map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? 'bg-gradient-to-b from-blue-500/10 to-purple-500/10 border-blue-500/30 scale-105' : 'bg-card border-border'} hover:scale-105 transition-all duration-300`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-primary-foreground">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                  <div className="mb-2">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">/{plan.period}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-6">{plan.description}</p>
                  <ul className="space-y-3 mb-6 text-left">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm">
                        <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${plan.popular ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700' : 'bg-muted hover:bg-muted/80'}`}
                    asChild
                  >
                    <Link href="/register">{plan.cta}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="max-w-3xl mx-auto space-y-6">
              {[
                {
                  question: "Can I change plans anytime?",
                  answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately."
                },
                {
                  question: "Is there a free trial?",
                  answer: "All paid plans come with a 14-day free trial. No credit card required to start."
                },
                {
                  question: "What payment methods do you accept?",
                  answer: "We accept all major credit cards, PayPal, and bank transfers for enterprise plans."
                }
              ].map((faq, index) => (
                <Card key={index} className="bg-card border-border text-left">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">{faq.question}</h3>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}