import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default function LocaleLayout({ children }: Props) {
  return children;
}