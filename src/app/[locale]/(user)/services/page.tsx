import { useTranslations } from 'next-intl';
import { Navbar } from '@/components/users/navbar';
import { Footer } from '@/components/users/footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Brain,
  TrendingUp,
  Shield,
  Smartphone,
  PieChart,
  Zap,
} from 'lucide-react';
import Link from 'next/link';

export default function ServicesPage() {
  const t = useTranslations('userPages.services');
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-green-500/10 text-green-400 border-green-500/20">
              {t('badge')}
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {t('title')}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {' '}
                {t('titleHighlight')}
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {t('subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {[
              {
                icon: <Brain className="w-8 h-8" />,
                title: 'AI-Powered Analytics',
                description:
                  'Machine learning algorithms analyze spending patterns and provide personalized recommendations for better financial decisions.',
                features: [
                  'Predictive insights',
                  'Smart categorization',
                  'Anomaly detection',
                ],
              },
              {
                icon: <TrendingUp className="w-8 h-8" />,
                title: 'Advanced Reporting',
                description:
                  'Comprehensive reports and dashboards that give you complete visibility into your financial health and trends.',
                features: [
                  'Custom reports',
                  'Real-time dashboards',
                  'Export capabilities',
                ],
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: 'Enterprise Security',
                description:
                  'Bank-level security with end-to-end encryption, ensuring your financial data is always protected.',
                features: [
                  '256-bit encryption',
                  'SOC 2 compliance',
                  'Multi-factor auth',
                ],
              },
              {
                icon: <Smartphone className="w-8 h-8" />,
                title: 'Mobile Solutions',
                description:
                  'Native mobile apps for iOS and Android with offline capabilities and real-time synchronization.',
                features: [
                  'Offline mode',
                  'Receipt scanning',
                  'Push notifications',
                ],
              },
              {
                icon: <PieChart className="w-8 h-8" />,
                title: 'Budget Management',
                description:
                  'Intelligent budgeting tools that adapt to your spending habits and help you achieve financial goals.',
                features: ['Smart budgets', 'Goal tracking', 'Spending alerts'],
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: 'API Integration',
                description:
                  'Robust APIs for seamless integration with your existing financial systems and third-party applications.',
                features: ['RESTful APIs', 'Webhooks', 'Custom integrations'],
              },
            ].map((service, index) => (
              <Card
                key={index}
                className="bg-card border-border hover:shadow-lg transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className="text-blue-400 mb-4">{service.icon}</div>
                  <h3 className="text-xl font-semibold mb-3">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {service.description}
                  </p>
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="text-sm text-muted-foreground flex items-center"
                      >
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <h2 className="text-3xl font-bold mb-6">{t('cta.title')}</h2>
            <p className="text-xl text-muted-foreground mb-8">
              {t('cta.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                asChild
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                <Link href="/register">{t('cta.startTrial')}</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/pricing">{t('cta.viewPricing')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
