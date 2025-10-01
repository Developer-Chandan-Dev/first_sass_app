import Link from 'next/link';
import { useTranslations } from 'next-intl';
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

interface Feature {
  icon: React.ReactNode;
  titleKey: string;
  descriptionKey: string;
}

interface Stat {
  number: string;
  labelKey: string;
}

interface PricingPlan {
  nameKey: string;
  price: string;
  periodKey: string;
  features: string[];
  popular: boolean;
}

interface Testimonial {
  nameKey: string;
  roleKey: string;
  contentKey: string;
  rating: number;
}

const FEATURES: Feature[] = [
  {
    icon: <Brain className="w-8 h-8" />,
    titleKey: 'aiInsights.title',
    descriptionKey: 'aiInsights.description'
  },
  {
    icon: <TrendingUp className="w-8 h-8" />,
    titleKey: 'predictiveAnalytics.title',
    descriptionKey: 'predictiveAnalytics.description'
  },
  {
    icon: <PieChart className="w-8 h-8" />,
    titleKey: 'smartCategorization.title',
    descriptionKey: 'smartCategorization.description'
  },
  {
    icon: <Shield className="w-8 h-8" />,
    titleKey: 'bankSecurity.title',
    descriptionKey: 'bankSecurity.description'
  },
  {
    icon: <Smartphone className="w-8 h-8" />,
    titleKey: 'mobileFirst.title',
    descriptionKey: 'mobileFirst.description'
  },
  {
    icon: <Globe className="w-8 h-8" />,
    titleKey: 'globalCurrency.title',
    descriptionKey: 'globalCurrency.description'
  }
];

const STATS: Stat[] = [
  { number: "1M+", labelKey: 'activeUsers' },
  { number: "$50B+", labelKey: 'trackedExpenses' },
  { number: "99.9%", labelKey: 'uptime' },
  { number: "150+", labelKey: 'countries' }
];

const PRICING_PLANS: PricingPlan[] = [
  {
    nameKey: 'plans.free.name',
    price: "$0",
    periodKey: 'forever',
    features: ['Basic expense tracking', '5 categories', 'Mobile app', 'Email support'],
    popular: false
  },
  {
    nameKey: 'plans.pro.name',
    price: "$9",
    periodKey: 'perMonth',
    features: ['Unlimited tracking', 'AI insights', 'Advanced analytics', 'Priority support'],
    popular: true
  },
  {
    nameKey: 'plans.premium.name',
    price: "$19",
    periodKey: 'perMonth',
    features: ['Team collaboration', 'Custom categories', 'API access', 'White-label options'],
    popular: false
  },
  {
    nameKey: 'plans.ultra.name',
    price: "$29",
    periodKey: 'perMonth',
    features: ['Enterprise features', 'Dedicated support', 'Custom integrations', 'SLA guarantee'],
    popular: false
  }
];

const TESTIMONIALS: Testimonial[] = [
  {
    nameKey: 'sarah.name',
    roleKey: 'sarah.role',
    contentKey: 'sarah.content',
    rating: 5
  },
  {
    nameKey: 'marcus.name',
    roleKey: 'marcus.role',
    contentKey: 'marcus.content',
    rating: 5
  },
  {
    nameKey: 'emily.name',
    roleKey: 'emily.role',
    contentKey: 'emily.content',
    rating: 5
  }
];

export default function Home() {
  const t = useTranslations('landing');
  const tFeatures = useTranslations('features');
  const tStats = useTranslations('stats');
  const tPricing = useTranslations('pricing');
  const tTestimonials = useTranslations('testimonials');
  const tCommon = useTranslations('common');
  
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
              🚀 {t('aiPowered')}
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                {t('title')}
              </span>
              <br />
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-foreground dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent">
                {t('subtitle')}
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 dark:text-muted-foreground mb-8 leading-relaxed">
              {t('description')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <SmartNavigationButton 
                size="lg" 
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-8 py-6"
                signedInText={t('goToDashboard')}
                signedOutText={t('startTrial')}
                signedInHref="/dashboard"
                signedOutHref="/register"
              >
                <ArrowRight className="ml-2 w-5 h-5" />
              </SmartNavigationButton>
              <Button size="lg" variant="outline" asChild className="border-gray-300 dark:border-border text-gray-700 dark:text-foreground hover:bg-gray-100 dark:hover:bg-muted text-lg px-8 py-6">
                <Link href="/guide">{t('readGuide')}</Link>
              </Button>
            </div>
            
            <div className="flex items-center justify-center flex-wrap gap-4 sm:gap-8 text-sm text-gray-500 dark:text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400" />
                {t('noCreditCard')}
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400" />
                {t('freeTrial')}
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400" />
                {t('cancelAnytime')}
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
              {t('features')}
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {t('intelligentFinancial')}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> {t('management')}</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              {t('nextGeneration')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map((feature, index) => (
              <Card key={index} className="bg-card border-border hover:bg-muted/50 transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="text-blue-400 mb-4 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-foreground">{tFeatures(feature.titleKey)}</h3>
                  <p className="text-muted-foreground">{tFeatures(feature.descriptionKey)}</p>
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
            {STATS.map((stat, index) => (
              <div key={index}>
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground">{tStats(stat.labelKey)}</div>
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
              {t('pricing')}
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {t('chooseYour')}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> {t('plan')}</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              {t('flexiblePricing')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {PRICING_PLANS.map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? 'bg-gradient-to-b from-blue-500/10 to-purple-500/10 border-blue-500/30' : 'bg-card border-border'} hover:scale-105 transition-all duration-300`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-primary-foreground">
                      {t('mostPopular')}
                    </Badge>
                  </div>
                )}
                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-semibold mb-2 text-foreground">{tPricing(plan.nameKey)}</h3>
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground">/{t(plan.periodKey)}</span>
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
                    <Link href="/register">{tCommon('getStarted')}</Link>
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
              {t('testimonials')}
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {t('lovedBy')}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> {t('thousands')}</span>
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((testimonial, index) => (
              <Card key={index} className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">&quot;{tTestimonials(testimonial.contentKey)}&quot;</p>
                  <div>
                    <div className="font-semibold text-foreground">{tTestimonials(testimonial.nameKey)}</div>
                    <div className="text-sm text-muted-foreground">{tTestimonials(testimonial.roleKey)}</div>
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
              {t('readyToTransform')}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> {t('finances')}</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              {t('joinMillions')}
            </p>
            <Button size="lg" asChild className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-8 py-6">
              <Link href="/register">
                {t('startTrial')}
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