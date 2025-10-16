'use client';

import { useLocale } from '@/contexts/locale-context';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Globe } from 'lucide-react';
import { LOCALE_NAMES } from '@/lib/supported-locales';

export function LanguageSwitcher() {
  const { locale, setLocale, availableLocales } = useLocale();

  return (
    <Select value={locale} onValueChange={setLocale}>
      <SelectTrigger className="w-[140px]">
        <Globe className="h-4 w-4 mr-2" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {availableLocales.map((lang) => (
          <SelectItem key={lang} value={lang}>
            {LOCALE_NAMES[lang]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
