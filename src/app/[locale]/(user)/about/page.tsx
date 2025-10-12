import { Metadata } from 'next'
import { useTranslations } from 'next-intl';
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
  const t = useTranslations('userPages.about');
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-500/10 text-blue-400 border-blue-500/20">
              {t('badge')}
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {t('title')}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> TrackWise</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {t('subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {[
              { icon: <Users className="w-8 h-8" />, title: t('stats.users.title'), desc: t('stats.users.desc') },
              { icon: <Target className="w-8 h-8" />, title: t('stats.ai.title'), desc: t('stats.ai.desc') },
              { icon: <Award className="w-8 h-8" />, title: t('stats.award.title'), desc: t('stats.award.desc') },
              { icon: <Globe className="w-8 h-8" />, title: t('stats.global.title'), desc: t('stats.global.desc') }
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
            <h2 className="text-3xl font-bold mb-8 text-center">{t('story.title')}</h2>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p className="mb-6">
                {t('story.paragraph1')}
              </p>
              <p className="mb-6">
                {t('story.paragraph2')}
              </p>
              <p>
                {t('story.paragraph3')}
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}