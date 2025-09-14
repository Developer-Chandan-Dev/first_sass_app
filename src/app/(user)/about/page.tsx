import { Navbar } from '@/components/users/navbar';
import { Footer } from '@/components/users/footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Target, Award, Globe } from 'lucide-react';

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
              Revolutionizing
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Financial Management</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We're on a mission to make financial management accessible, intelligent, and effortless for everyone.
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
                Founded in 2020, ExpenseTracker emerged from a simple observation: managing personal and business finances shouldn't be complicated. Our founders, experienced in both technology and finance, recognized the gap between powerful financial tools and user-friendly design.
              </p>
              <p className="mb-6">
                Today, we serve over 1 million users worldwide, from individual freelancers to enterprise teams. Our AI-powered platform has processed over $50 billion in expenses, helping users save an average of 30% on their monthly spending through intelligent insights and automation.
              </p>
              <p>
                We believe that everyone deserves access to sophisticated financial management tools, regardless of their technical expertise or company size. That's why we've built ExpenseTracker to be both powerful and intuitive.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}