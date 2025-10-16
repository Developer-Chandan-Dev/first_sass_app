export const seoConfig = {
  siteUrl:
    process.env.NEXT_PUBLIC_SITE_URL || 'https://trackwise-web.vercel.app/',
  siteName: process.env.NEXT_PUBLIC_SITE_NAME || 'TrackWise',
  siteDescription:
    process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
    'Take control of your finances with intelligent expense tracking and budget management',
  supportEmail:
    process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'support@trackwise-web.vercel.app',
  twitterHandle: process.env.NEXT_PUBLIC_TWITTER_HANDLE || '@trackwise',
  googleVerification: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || '',
};
