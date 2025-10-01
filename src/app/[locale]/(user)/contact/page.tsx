import { Metadata } from 'next'
import { useTranslations } from 'next-intl';
import { Navbar } from '@/components/users/navbar';
import { Footer } from '@/components/users/footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { seoConfig } from '@/lib/seo';

export const metadata: Metadata = {
  title: `Contact ${seoConfig.siteName} - Get Support for Expense Management`,
  description: `Need help with ${seoConfig.siteName}? Contact our support team for assistance with expense tracking, budget management, and account questions.`,
  openGraph: {
    title: `Contact ${seoConfig.siteName} - Get Support for Expense Management`,
    description: `Need help with ${seoConfig.siteName}? Contact our support team for assistance.`,
    url: `${seoConfig.siteUrl}/contact`,
  },
}

export default function ContactPage() {
  const t = useTranslations('pages.contact');
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-purple-500/10 text-purple-400 border-purple-500/20">
              {t('badge')}
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {t('title')}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> {t('titleHighlight')}</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {t('subtitle')}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div>
              <h2 className="text-2xl font-bold mb-6">{t('info.title')}</h2>
              <div className="space-y-6">
                {[
                  { icon: <Mail className="w-5 h-5" />, title: t('info.email'), info: seoConfig.supportEmail },
                  { icon: <Phone className="w-5 h-5" />, title: t('info.phone'), info: "+1 (555) 123-4567" },
                  { icon: <MapPin className="w-5 h-5" />, title: t('info.address'), info: t('info.addressValue') },
                  { icon: <Clock className="w-5 h-5" />, title: t('info.hours'), info: t('info.hoursValue') }
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="text-blue-400 mt-1">{item.icon}</div>
                    <div>
                      <h3 className="font-semibold mb-1">{item.title}</h3>
                      <p className="text-muted-foreground">{item.info}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6">{t('form.title')}</h2>
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input placeholder={t('form.firstName')} />
                    <Input placeholder={t('form.lastName')} />
                  </div>
                  <Input placeholder={t('form.email')} type="email" />
                  <Input placeholder={t('form.subject')} />
                  <Textarea placeholder={t('form.message')} rows={5} />
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                    {t('form.send')}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}