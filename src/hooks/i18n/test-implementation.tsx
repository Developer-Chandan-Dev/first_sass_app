'use client';

// Test component to verify i18n hooks implementation
import { useDashboardTranslations, usePublicPageTranslations, useBaseTranslations } from './index';

export function TestI18nImplementation() {
  // Test base translations
  const baseTranslations = useBaseTranslations();
  
  // Test dashboard translations
  const dashboardTranslations = useDashboardTranslations();
  
  // Test public page translations
  const publicTranslations = usePublicPageTranslations();

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">I18n Implementation Test</h2>
      
      <div className="space-y-2">
        <h3 className="font-semibold">Base Translations:</h3>
        <p>Common Save: {baseTranslations.common.save}</p>
        <p>Error Generic: {baseTranslations.errors.generic}</p>
        <p>Success Saved: {baseTranslations.success.saved}</p>
      </div>
      
      <div className="space-y-2">
        <h3 className="font-semibold">Dashboard Translations:</h3>
        <p>Dashboard Overview: {dashboardTranslations.dashboard.overview}</p>
        <p>Sidebar Expenses: {dashboardTranslations.sidebar.expenses}</p>
        <p>Expenses Title: {dashboardTranslations.expenses.title}</p>
        <p>Income Title: {dashboardTranslations.income.title}</p>
      </div>
      
      <div className="space-y-2">
        <h3 className="font-semibold">Public Page Translations:</h3>
        <p>Landing Title: {publicTranslations.landing.title}</p>
        <p>Nav Home: {publicTranslations.nav.home}</p>
        <p>Auth Login: {publicTranslations.auth.login}</p>
        <p>Pricing Monthly: {publicTranslations.pricing.monthly}</p>
      </div>
      
      <div className="space-y-2">
        <h3 className="font-semibold">Inheritance Test:</h3>
        <p>Dashboard Common Save: {dashboardTranslations.common.save}</p>
        <p>Public Common Save: {publicTranslations.common.save}</p>
        <p>Dashboard Errors: {dashboardTranslations.errors.generic}</p>
        <p>Public Errors: {publicTranslations.errors.generic}</p>
      </div>
    </div>
  );
}