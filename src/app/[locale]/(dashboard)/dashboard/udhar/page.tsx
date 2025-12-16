'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/dashboard/layout/page-header';
import { 
  User, 
  Store, 
  Building2, 
  CheckCircle, 
  ArrowRight,
  Sparkles,
  Crown,
  Star
} from 'lucide-react';

export default function UdharManagementPage() {
  const udharTypes = [
    {
      title: 'Personal',
      description: 'Perfect for individual udhar tracking and personal loan management',
      icon: User,
      badge: 'Basic',
      badgeVariant: 'secondary' as const,
      gradient: 'from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20',
      iconColor: 'text-blue-600 dark:text-blue-400',
      features: [
        'Track personal loans & debts',
        'Simple contact management',
        'Basic reporting & insights',
        'Export data to CSV/PDF',
        'Mobile-friendly interface'
      ],
      href: '/dashboard/udhar/personal'
    },
    {
      title: 'Shop Keeper',
      description: 'Advanced features for retail businesses and shop management',
      icon: Store,
      badge: 'Popular',
      badgeVariant: 'default' as const,
      gradient: 'from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      features: [
        'Customer management system',
        'Inventory integration',
        'Automated payment reminders',
        'Monthly & yearly reports',
        'SMS & WhatsApp notifications'
      ],
      href: '/dashboard/udhar/shopkeeper'
    },
    {
      title: 'Business',
      description: 'Enterprise-grade solution for large-scale udhar management',
      icon: Building2,
      badge: 'Premium',
      badgeVariant: 'destructive' as const,
      gradient: 'from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20',
      iconColor: 'text-purple-600 dark:text-purple-400',
      features: [
        'Multi-user access & roles',
        'Advanced analytics dashboard',
        'Custom categories & tags',
        'Team collaboration tools',
        'API integration & webhooks'
      ],
      href: '/dashboard/udhar/business',
      comingSoon: true
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Udhar Management System"
        description="Choose the perfect solution for your udhar tracking and debt management needs"
      />

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {udharTypes.map((type, index) => {
          const Icon = type.icon;
          const isPopular = type.badge === 'Popular';
          
          return (
            <Card 
              key={index} 
              className={`relative flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-gradient-to-br ${type.gradient} border-0 shadow-sm ${
                isPopular ? 'ring-2 ring-primary/20 shadow-primary/10' : ''
              } ${type.comingSoon ? 'opacity-75' : ''}`}
            >
              {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground px-3 py-1 text-xs font-medium shadow-lg">
                    <Star className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/80 dark:bg-gray-800/80 shadow-lg">
                  <Icon className={`h-8 w-8 ${type.iconColor}`} />
                </div>
                
                <div className="flex items-center justify-center gap-2 mb-2">
                  <CardTitle className="text-xl font-bold">{type.title}</CardTitle>
                  <Badge variant={type.badgeVariant} className="text-xs">
                    {type.badge}
                  </Badge>
                </div>
                
                <CardDescription className="text-sm leading-relaxed">
                  {type.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="flex-1 px-6">
                <ul className="space-y-3">
                  {type.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              
              <CardFooter className="pt-6">
                <Button 
                  className={`w-full group transition-all duration-200 ${
                    isPopular 
                      ? 'bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl' 
                      : type.comingSoon
                      ? 'bg-muted text-muted-foreground cursor-not-allowed'
                      : 'hover:shadow-md'
                  }`}
                  variant={isPopular ? 'default' : type.comingSoon ? 'secondary' : 'outline'}
                  disabled={type.comingSoon}
                  onClick={() => {
                    if (!type.comingSoon && type.href) {
                      window.location.href = type.href;
                    }
                  }}
                >
                  {type.comingSoon ? (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Coming Soon
                    </>
                  ) : (
                    <>
                      Get Started
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
      
      {/* Additional Info Section */}
      <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Crown className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Why Choose Our Udhar Management?</h3>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Streamline your debt tracking with our comprehensive solution. From simple personal loans to complex business transactions, 
              we provide the tools you need to stay organized and maintain healthy financial relationships.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}