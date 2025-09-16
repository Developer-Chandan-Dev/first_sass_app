import { Metadata } from 'next'
import { Navbar } from '@/components/users/navbar';
import { Footer } from '@/components/users/footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Target, Award, Globe } from 'lucide-react';
import { seoConfig } from '@/lib/seo';

export const metadata: Metadata = {
  title: `About ${seoConfig.siteName} - Smart Expense Management Platform`,
  description: `Learn about ${seoConfig.siteName}'s mission to simplify personal finance management through intelligent expense tracking and budget planning tools.`,
  openGraph: {
    title: `About ${seoConfig.siteName} - Smart Expense Management Platform`,
    description: `Learn about ${seoConfig.siteName}'s mission to simplify personal finance management.`,
    url: `${seoConfig.siteUrl}/about`,
  },
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-500/10 text-blue-400 border-blue-500/20">
              About Us
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> TrackWise</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We&apos;re on a mission to make financial management accessible, intelligent, and effortless for everyone.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {[
              { icon: <Users className="w-8 h-8" />, title: "1M+ Users", desc: "Trust our platform" },
              { icon: <Target className="w-8 h-8" />, title: "AI-Powered", desc: "Smart insights" },
              { icon: <Award className="w-8 h-8" />, title: "Award Winning", desc: "Industry recognition" },
              { icon: <Globe className="w-8 h-8" />, title: "Global Reach", desc: "150+ countries" }
            ].map((stat, index) => (
              <Card key={index} className="bg-card border-border text-center">
                <CardContent className="p-6">
                  <div className="text-blue-400 mb-4 flex justify-center">{stat.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{stat.title}</h3>
                  <p className="text-muted-foreground">{stat.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Our Story</h2>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p className="mb-6">
                Founded with a vision to democratize financial management, TrackWise emerged from the need for simple yet powerful expense tracking tools. We recognized that managing personal and business finances shouldn&apos;t require complex software or financial expertise.
              </p>
              <p className="mb-6">
                Today, TrackWise serves users worldwide with intelligent expense tracking and budget management features. Our platform helps users gain control over their finances through smart categorization, budget alerts, and insightful analytics.
              </p>
              <p>
                We believe that everyone deserves access to sophisticated financial management tools. That&apos;s why we&apos;ve built TrackWise to be both powerful and intuitive, helping you make better financial decisions every day.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}