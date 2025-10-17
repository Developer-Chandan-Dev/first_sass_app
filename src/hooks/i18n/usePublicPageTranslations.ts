'use client';

import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import {
  useBaseTranslations,
  createSafeTranslator,
} from './useBaseTranslations';

export function usePublicPageTranslations() {
  const baseTranslations = useBaseTranslations();

  const t = useTranslations();
  const tLanding = useTranslations('landing');
  const tNav = useTranslations('navigation');
  const tFeatures = useTranslations('features');
  const tPricing = useTranslations('pricing');
  const tFooter = useTranslations('footer');
  const tAuth = useTranslations('auth');
  const tTestimonials = useTranslations('testimonials');
  const tPages = useTranslations('userPages');
  const tStats = useTranslations('stats');

  const safeTLanding = createSafeTranslator(tLanding);
  const safeTNav = createSafeTranslator(tNav);
  const safeTFeatures = createSafeTranslator(tFeatures);
  const safeTPricing = createSafeTranslator(tPricing);
  const safeTFooter = createSafeTranslator(tFooter);
  const safeTAuth = createSafeTranslator(tAuth);
  const safeTTestimonials = createSafeTranslator(tTestimonials);
  const safeTPages = createSafeTranslator(tPages);
  const safeTStats = createSafeTranslator(tStats);

  return useMemo(
    () => ({
      ...baseTranslations,

      nav: {
        home: safeTNav('home', 'Home'),
        about: safeTNav('about', 'About'),
        contact: safeTNav('contact', 'Contact'),
        services: safeTNav('services', 'Services'),
        pricing: safeTNav('pricing', 'Pricing'),
        guide: safeTNav('guide', 'Guide'),
      },

      landing: {
        title: safeTLanding('title', 'TrackWise'),
        subtitle: safeTLanding('subtitle', 'The Future of Expense Tracking'),
        description: safeTLanding(
          'description',
          'Take control of your finances with intelligent expense tracking and budget management.'
        ),
        aiPowered: safeTLanding(
          'aiPowered',
          'AI-Powered Financial Intelligence'
        ),
        startTrial: safeTLanding('startTrial', 'Start Free Trial'),
        goToDashboard: safeTLanding('goToDashboard', 'Go to Dashboard'),
        readGuide: safeTLanding('readGuide', 'Read Guide'),
        features: safeTLanding('features', 'Features'),
        pricing: safeTLanding('pricing', 'Pricing'),
        testimonials: safeTLanding('testimonials', 'Testimonials'),
        noCreditCard: safeTLanding('noCreditCard', 'No credit card required'),
        freeTrial: safeTLanding('freeTrial', '14-day free trial'),
        cancelAnytime: safeTLanding('cancelAnytime', 'Cancel anytime'),
        intelligentFinancial: safeTLanding(
          'intelligentFinancial',
          'Intelligent Financial'
        ),
        management: safeTLanding('management', 'Management'),
        nextGeneration: safeTLanding(
          'nextGeneration',
          'Experience the next generation of expense tracking'
        ),
        chooseYour: safeTLanding('chooseYour', 'Choose Your'),
        plan: safeTLanding('plan', 'Plan'),
        flexiblePricing: safeTLanding(
          'flexiblePricing',
          'Flexible pricing for individuals and teams'
        ),
        lovedBy: safeTLanding('lovedBy', 'Loved by'),
        thousands: safeTLanding('thousands', 'Thousands'),
        readyToTransform: safeTLanding(
          'readyToTransform',
          'Ready to Transform Your'
        ),
        finances: safeTLanding('finances', 'Finances?'),
        joinMillions: safeTLanding(
          'joinMillions',
          'Join millions of users who have revolutionized their financial management'
        ),
        mostPopular: safeTLanding('mostPopular', 'Most Popular'),
        forever: safeTLanding('forever', 'forever'),
        perMonth: safeTLanding('perMonth', 'per month'),
      },

      features: {
        aiInsights: {
          title: safeTFeatures('aiInsights.title', 'AI-Powered Insights'),
          description: safeTFeatures(
            'aiInsights.description',
            'Machine learning algorithms analyze your spending patterns'
          ),
        },
        predictiveAnalytics: {
          title: safeTFeatures(
            'predictiveAnalytics.title',
            'Predictive Analytics'
          ),
          description: safeTFeatures(
            'predictiveAnalytics.description',
            'Forecast future expenses and identify savings opportunities'
          ),
        },
        smartCategorization: {
          title: safeTFeatures(
            'smartCategorization.title',
            'Smart Categorization'
          ),
          description: safeTFeatures(
            'smartCategorization.description',
            'Automatic expense categorization with 99% accuracy'
          ),
        },
        bankSecurity: {
          title: safeTFeatures('bankSecurity.title', 'Bank-Level Security'),
          description: safeTFeatures(
            'bankSecurity.description',
            'Enterprise-grade encryption protects your financial data'
          ),
        },
        mobileFirst: {
          title: safeTFeatures('mobileFirst.title', 'Mobile-First Design'),
          description: safeTFeatures(
            'mobileFirst.description',
            'Seamless experience across all devices'
          ),
        },
        globalCurrency: {
          title: safeTFeatures(
            'globalCurrency.title',
            'Global Currency Support'
          ),
          description: safeTFeatures(
            'globalCurrency.description',
            'Track expenses in 150+ currencies'
          ),
        },
      },

      pricing: {
        monthly: safeTPricing('monthly', 'Monthly'),
        yearly: safeTPricing('yearly', 'Yearly'),
        save: safeTPricing('save', 'Save'),
        mostPopular: safeTPricing('mostPopular', 'Most Popular'),
        getStarted: safeTPricing('getStarted', 'Get Started'),
        currentPlan: safeTPricing('currentPlan', 'Current Plan'),
        upgrade: safeTPricing('upgrade', 'Upgrade'),
        downgrade: safeTPricing('downgrade', 'Downgrade'),
        plans: {
          free: {
            name: safeTPricing('plans.free.name', 'Free'),
            features: [
              safeTPricing('plans.free.features.0', 'Basic expense tracking'),
              safeTPricing('plans.free.features.1', '5 categories'),
              safeTPricing('plans.free.features.2', 'Mobile app'),
              safeTPricing('plans.free.features.3', 'Email support'),
            ],
          },
          pro: {
            name: safeTPricing('plans.pro.name', 'Pro'),
            features: [
              safeTPricing('plans.pro.features.0', 'Unlimited tracking'),
              safeTPricing('plans.pro.features.1', 'AI insights'),
              safeTPricing('plans.pro.features.2', 'Advanced analytics'),
              safeTPricing('plans.pro.features.3', 'Priority support'),
            ],
          },
          premium: {
            name: safeTPricing('plans.premium.name', 'Premium'),
            features: [
              safeTPricing('plans.premium.features.0', 'Team collaboration'),
              safeTPricing('plans.premium.features.1', 'Custom categories'),
              safeTPricing('plans.premium.features.2', 'API access'),
              safeTPricing('plans.premium.features.3', 'White-label options'),
            ],
          },
          ultra: {
            name: safeTPricing('plans.ultra.name', 'Ultra'),
            features: [
              safeTPricing('plans.ultra.features.0', 'Enterprise features'),
              safeTPricing('plans.ultra.features.1', 'Dedicated support'),
              safeTPricing('plans.ultra.features.2', 'Custom integrations'),
              safeTPricing('plans.ultra.features.3', 'SLA guarantee'),
            ],
          },
        },
        faq: {
          title: safeTPricing('faq.title', 'Frequently Asked Questions'),
          changePlans: {
            question: safeTPricing(
              'faq.changePlans.question',
              'Can I change plans anytime?'
            ),
            answer: safeTPricing(
              'faq.changePlans.answer',
              'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.'
            ),
          },
          freeTrial: {
            question: safeTPricing(
              'faq.freeTrial.question',
              'Is there a free trial?'
            ),
            answer: safeTPricing(
              'faq.freeTrial.answer',
              'All paid plans come with a 14-day free trial. No credit card required to start.'
            ),
          },
          payment: {
            question: safeTPricing(
              'faq.payment.question',
              'What payment methods do you accept?'
            ),
            answer: safeTPricing(
              'faq.payment.answer',
              'We accept all major credit cards, PayPal, and bank transfers for enterprise plans.'
            ),
          },
          dataPrivacy: {
            question: safeTPricing(
              'faq.dataPrivacy.question',
              'How is my data protected?'
            ),
            answer: safeTPricing(
              'faq.dataPrivacy.answer',
              'We use bank-level encryption and never share your personal financial data with third parties.'
            ),
          },
          support: {
            question: safeTPricing(
              'faq.support.question',
              'What support do you offer?'
            ),
            answer: safeTPricing(
              'faq.support.answer',
              'We provide 24/7 email support for all plans, with priority support for Pro and above.'
            ),
          },
        },
      },

      auth: {
        login: safeTAuth('login', 'Login'),
        register: safeTAuth('register', 'Register'),
        logout: safeTAuth('logout', 'Logout'),
        signIn: safeTAuth('signIn', 'Sign In'),
        signUp: safeTAuth('signUp', 'Sign Up'),
        welcome: safeTAuth('welcome', 'Welcome'),
        welcomeBack: safeTAuth('welcomeBack', 'Welcome back'),
        createAccount: safeTAuth('createAccount', 'Create your account'),
        forgotPassword: safeTAuth('forgotPassword', 'Forgot password?'),
        rememberMe: safeTAuth('rememberMe', 'Remember me'),
        alreadyHaveAccount: safeTAuth(
          'alreadyHaveAccount',
          'Already have an account?'
        ),
        dontHaveAccount: safeTAuth('dontHaveAccount', "Don't have an account?"),
        signInWith: safeTAuth('signInWith', 'Sign in with'),
        signUpWith: safeTAuth('signUpWith', 'Sign up with'),
        orContinueWith: safeTAuth('orContinueWith', 'Or continue with'),
        email: safeTAuth('email', 'Email'),
        password: safeTAuth('password', 'Password'),
        confirmPassword: safeTAuth('confirmPassword', 'Confirm Password'),
        firstName: safeTAuth('firstName', 'First Name'),
        lastName: safeTAuth('lastName', 'Last Name'),
        agreeToTerms: safeTAuth(
          'agreeToTerms',
          'I agree to the Terms of Service and Privacy Policy'
        ),
        validation: {
          emailRequired: safeTAuth(
            'validation.emailRequired',
            'Email is required'
          ),
          emailInvalid: safeTAuth(
            'validation.emailInvalid',
            'Please enter a valid email'
          ),
          passwordRequired: safeTAuth(
            'validation.passwordRequired',
            'Password is required'
          ),
          passwordTooShort: safeTAuth(
            'validation.passwordTooShort',
            'Password must be at least 8 characters'
          ),
          passwordsNotMatch: safeTAuth(
            'validation.passwordsNotMatch',
            'Passwords do not match'
          ),
          firstNameRequired: safeTAuth(
            'validation.firstNameRequired',
            'First name is required'
          ),
          lastNameRequired: safeTAuth(
            'validation.lastNameRequired',
            'Last name is required'
          ),
          termsRequired: safeTAuth(
            'validation.termsRequired',
            'You must agree to the terms'
          ),
        },
      },

      testimonials: {
        sarah: {
          name: safeTTestimonials('sarah.name', 'Sarah Chen'),
          role: safeTTestimonials('sarah.role', 'Startup Founder'),
          content: safeTTestimonials(
            'sarah.content',
            "TrackWise's AI insights helped me reduce business expenses by 30%."
          ),
        },
        marcus: {
          name: safeTTestimonials('marcus.name', 'Marcus Johnson'),
          role: safeTTestimonials('marcus.role', 'Freelancer'),
          content: safeTTestimonials(
            'marcus.content',
            'Finally, an expense tracker that understands my workflow.'
          ),
        },
        emily: {
          name: safeTTestimonials('emily.name', 'Emily Rodriguez'),
          role: safeTTestimonials('emily.role', 'Finance Manager'),
          content: safeTTestimonials(
            'emily.content',
            'The team collaboration features are incredible.'
          ),
        },
      },

      pages: {
        about: {
          badge: safeTPages('about.badge', 'About Us'),
          title: safeTPages('about.title', 'About'),
          subtitle: safeTPages(
            'about.subtitle',
            "We're on a mission to make financial management accessible, intelligent, and effortless for everyone."
          ),
          stats: {
            users: {
              title: safeTPages('about.stats.users.title', '1M+ Users'),
              desc: safeTPages('about.stats.users.desc', 'Trust our platform'),
            },
            ai: {
              title: safeTPages('about.stats.ai.title', 'AI-Powered'),
              desc: safeTPages('about.stats.ai.desc', 'Smart insights'),
            },
            award: {
              title: safeTPages('about.stats.award.title', 'Award Winning'),
              desc: safeTPages(
                'about.stats.award.desc',
                'Industry recognition'
              ),
            },
            global: {
              title: safeTPages('about.stats.global.title', 'Global Reach'),
              desc: safeTPages('about.stats.global.desc', '150+ countries'),
            },
          },
          story: {
            title: safeTPages('about.story.title', 'Our Story'),
            paragraph1: safeTPages(
              'about.story.paragraph1',
              "Founded with a vision to democratize financial management, TrackWise emerged from the need for simple yet powerful expense tracking tools. We recognized that managing personal and business finances shouldn't require complex software or financial expertise."
            ),
            paragraph2: safeTPages(
              'about.story.paragraph2',
              'Today, TrackWise serves users worldwide with intelligent expense tracking and budget management features. Our platform helps users gain control over their finances through smart categorization, budget alerts, and insightful analytics.'
            ),
            paragraph3: safeTPages(
              'about.story.paragraph3',
              "We believe that everyone deserves access to sophisticated financial management tools. That's why we've built TrackWise to be both powerful and intuitive, helping you make better financial decisions every day."
            ),
          },
        },
        contact: {
          badge: safeTPages('contact.badge', 'Contact Us'),
          title: safeTPages('contact.title', 'Get in'),
          titleHighlight: safeTPages('contact.titleHighlight', 'Touch'),
          subtitle: safeTPages(
            'contact.subtitle',
            "Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible."
          ),
          info: {
            title: safeTPages('contact.info.title', 'Contact Information'),
            email: safeTPages('contact.info.email', 'Email'),
            phone: safeTPages('contact.info.phone', 'Phone'),
            address: safeTPages('contact.info.address', 'Address'),
            addressValue: safeTPages(
              'contact.info.addressValue',
              '123 Tech Street, San Francisco, CA 94105'
            ),
            hours: safeTPages('contact.info.hours', 'Hours'),
            hoursValue: safeTPages(
              'contact.info.hoursValue',
              'Mon-Fri 9AM-6PM PST'
            ),
          },
          form: {
            title: safeTPages('contact.form.title', 'Send us a Message'),
            firstName: safeTPages('contact.form.firstName', 'First Name'),
            lastName: safeTPages('contact.form.lastName', 'Last Name'),
            email: safeTPages('contact.form.email', 'Email'),
            subject: safeTPages('contact.form.subject', 'Subject'),
            message: safeTPages('contact.form.message', 'Your message...'),
            send: safeTPages('contact.form.send', 'Send Message'),
            sending: safeTPages('contact.form.sending', 'Sending...'),
            sent: safeTPages('contact.form.sent', 'Message sent successfully!'),
            error: safeTPages(
              'contact.form.error',
              'Failed to send message. Please try again.'
            ),
            validation: {
              firstNameRequired: safeTPages(
                'contact.form.validation.firstNameRequired',
                'First name is required'
              ),
              lastNameRequired: safeTPages(
                'contact.form.validation.lastNameRequired',
                'Last name is required'
              ),
              emailRequired: safeTPages(
                'contact.form.validation.emailRequired',
                'Email is required'
              ),
              emailInvalid: safeTPages(
                'contact.form.validation.emailInvalid',
                'Please enter a valid email'
              ),
              subjectRequired: safeTPages(
                'contact.form.validation.subjectRequired',
                'Subject is required'
              ),
              messageRequired: safeTPages(
                'contact.form.validation.messageRequired',
                'Message is required'
              ),
              messageTooShort: safeTPages(
                'contact.form.validation.messageTooShort',
                'Message must be at least 10 characters'
              ),
            },
          },
        },
        services: {
          badge: safeTPages('services.badge', 'Our Services'),
          title: safeTPages('services.title', 'Comprehensive'),
          titleHighlight: safeTPages(
            'services.titleHighlight',
            'Financial Solutions'
          ),
          subtitle: safeTPages(
            'services.subtitle',
            'From AI-powered insights to enterprise integrations, we provide everything you need to master your finances.'
          ),
          services: {
            expenseTracking: {
              title: safeTPages(
                'services.services.expenseTracking.title',
                'Smart Expense Tracking'
              ),
              description: safeTPages(
                'services.services.expenseTracking.description',
                'Automatically categorize and track your expenses with AI-powered insights.'
              ),
            },
            budgetManagement: {
              title: safeTPages(
                'services.services.budgetManagement.title',
                'Budget Management'
              ),
              description: safeTPages(
                'services.services.budgetManagement.description',
                "Set budgets, track spending, and get alerts when you're approaching limits."
              ),
            },
            analytics: {
              title: safeTPages(
                'services.services.analytics.title',
                'Advanced Analytics'
              ),
              description: safeTPages(
                'services.services.analytics.description',
                'Get detailed insights into your spending patterns and financial trends.'
              ),
            },
            reporting: {
              title: safeTPages(
                'services.services.reporting.title',
                'Custom Reporting'
              ),
              description: safeTPages(
                'services.services.reporting.description',
                'Generate detailed reports for personal or business financial analysis.'
              ),
            },
          },
          cta: {
            title: safeTPages('services.cta.title', 'Ready to Get Started?'),
            subtitle: safeTPages(
              'services.cta.subtitle',
              "Choose the plan that's right for you and start transforming your financial management today."
            ),
            startTrial: safeTPages(
              'services.cta.startTrial',
              'Start Free Trial'
            ),
            viewPricing: safeTPages('services.cta.viewPricing', 'View Pricing'),
          },
        },
        pricing: {
          badge: safeTPages('pricing.badge', 'Pricing Plans'),
          title: safeTPages('pricing.title', 'Simple,'),
          titleHighlight: safeTPages(
            'pricing.titleHighlight',
            'Transparent Pricing'
          ),
          subtitle: safeTPages(
            'pricing.subtitle',
            'Choose the perfect plan for your needs. All plans include our core features with no hidden fees.'
          ),
        },
      },

      footer: {
        description: safeTFooter(
          'description',
          'The future of expense management. Track, analyze, and optimize your finances.'
        ),
        product: {
          title: safeTFooter('product.title', 'Product'),
          features: safeTFooter('product.features', 'Features'),
          pricing: safeTFooter('product.pricing', 'Pricing'),
          api: safeTFooter('product.api', 'API'),
        },
        company: {
          title: safeTFooter('company.title', 'Company'),
          about: safeTFooter('company.about', 'About'),
          blog: safeTFooter('company.blog', 'Blog'),
          careers: safeTFooter('company.careers', 'Careers'),
          contact: safeTFooter('company.contact', 'Contact'),
        },
        connect: {
          title: safeTFooter('connect.title', 'Connect'),
        },
        copyright: safeTFooter(
          'copyright',
          '© 2025 TrackWise. All rights reserved.'
        ),
        privacy: safeTFooter('privacy', 'Privacy Policy'),
        terms: safeTFooter('terms', 'Terms of Service'),
      },

      stats: {
        activeUsers: safeTStats('activeUsers', 'Active Users'),
        trackedExpenses: safeTStats('trackedExpenses', 'Tracked Expenses'),
        uptime: safeTStats('uptime', 'Uptime'),
        countries: safeTStats('countries', 'Countries'),
      },

      // Raw translator for dynamic keys
      t,
    }),
    [
      baseTranslations,
      t,
      safeTLanding,
      safeTNav,
      safeTFeatures,
      safeTPricing,
      safeTFooter,
      safeTAuth,
      safeTTestimonials,
      safeTPages,
      safeTStats,
    ]
  );
}
