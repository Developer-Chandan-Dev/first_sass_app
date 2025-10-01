'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Languages } from 'lucide-react';
import { useTransition } from 'react';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸', nativeName: 'English' },
  { code: 'hi', name: 'हिंदी', flag: '🇮🇳', nativeName: 'Hindi' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ', flag: '🇮🇳', nativeName: 'Punjabi' },
  { code: 'mr', name: 'मराठी', flag: '🇮🇳', nativeName: 'Marathi' },
] as const;

type Locale = typeof languages[number]['code'];

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const switchLanguage = (newLocale: Locale) => {
    if (newLocale === locale) return;
    
    startTransition(() => {
      const segments = pathname.split('/');
      // Replace current locale with new locale
      segments[1] = newLocale;
      const newPath = segments.join('/');
      router.replace(newPath);
    });
  };

  const currentLanguage = languages.find(lang => lang.code === locale) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-2 min-w-0"
          disabled={isPending}
        >
          <Languages className="h-4 w-4 flex-shrink-0" />
          <span className="hidden sm:inline truncate">
            {currentLanguage.flag} {currentLanguage.name}
          </span>
          <span className="sm:hidden">{currentLanguage.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[140px]">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => switchLanguage(language.code)}
            className={`cursor-pointer ${
              locale === language.code ? 'bg-accent text-accent-foreground' : ''
            }`}
            disabled={isPending}
          >
            <span className="mr-2 text-base">{language.flag}</span>
            <div className="flex flex-col">
              <span className="font-medium">{language.name}</span>
              <span className="text-xs text-muted-foreground">{language.nativeName}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}