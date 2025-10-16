'use client';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Zap, Github, Twitter, Linkedin, Mail, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export function Footer() {
  const t = useTranslations('footer');
  const tCommon = useTranslations('common');
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'mr', name: 'मराठी', flag: '🇮🇳' },
    { code: 'pa', name: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  ];

  const currentLocale = pathname.split('/')[1] || 'en';
  const pathWithoutLocale = pathname.replace(`/${currentLocale}`, '') || '/';

  const currentLanguage =
    languages.find((lang) => lang.code === currentLocale) || languages[0];

  const switchLanguage = (locale: string) => {
    const newPath = `/${locale}${pathWithoutLocale}`;
    router.push(newPath);
  };
  return (
    <footer className="bg-background border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                TrackWise
              </span>
            </div>
            <p className="text-muted-foreground text-sm">{t('description')}</p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-foreground font-semibold mb-4">
              {t('product.title')}
            </h3>
            <div className="space-y-2">
              <Link
                href="#features"
                className="block text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                {t('product.features')}
              </Link>
              <Link
                href="#pricing"
                className="block text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                {t('product.pricing')}
              </Link>
              <Link
                href="/dashboard"
                className="block text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                {tCommon('dashboard')}
              </Link>
              <Link
                href="#"
                className="block text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                {t('product.api')}
              </Link>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-foreground font-semibold mb-4">
              {t('company.title')}
            </h3>
            <div className="space-y-2">
              <Link
                href="/about"
                className="block text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                {t('company.about')}
              </Link>
              <Link
                href="#"
                className="block text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                {t('company.blog')}
              </Link>
              <Link
                href="#"
                className="block text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                {t('company.careers')}
              </Link>
              <Link
                href="/contact"
                className="block text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                {t('company.contact')}
              </Link>
            </div>
          </div>

          {/* Connect & Language */}
          <div>
            <h3 className="text-foreground font-semibold mb-4">
              {t('connect.title')}
            </h3>
            <div className="flex space-x-4 mb-4">
              <a
                href="https://github.com/Developer-Chandan-Dev/"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/chandan-dev-developer/"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="mailto:support@chandandev285@gmail.com.com"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>

            {/* Language Switcher */}
            <div className="mb-4">
              {mounted ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                    >
                      <Globe className="w-4 h-4 mr-2" />
                      {currentLanguage.flag} {currentLanguage.name}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {languages.map((language) => (
                      <DropdownMenuItem
                        key={language.code}
                        onClick={() => switchLanguage(language.code)}
                        className="cursor-pointer"
                      >
                        <span className="mr-2">{language.flag}</span>
                        {language.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  disabled
                >
                  <Globe className="w-4 h-4 mr-2" />
                  Loading...
                </Button>
              )}
            </div>

            <div>
              <p className="text-muted-foreground text-sm">
                support@trackwise.vercel.app
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">{t('copyright')}</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              {t('privacy')}
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              {t('terms')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
