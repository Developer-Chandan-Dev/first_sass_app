import {
  Home,
  LayoutDashboard,
  Wallet,
  Target,
  PieChart,
  BarChart3,
  Settings,
  User,
  Plus,
  Edit,
  Eye,
  FileText,
  Download,
  Upload,
} from 'lucide-react';

export interface BreadcrumbConfig {
  [key: string]: {
    label: string;
    icon?: React.ComponentType<{ className?: string }>;
    description?: string;
  };
}

export const breadcrumbConfig: BreadcrumbConfig = {
  // Root paths
  '/': {
    label: 'Home',
    icon: Home,
    description: 'Dashboard home',
  },
  dashboard: {
    label: 'Dashboard',
    icon: LayoutDashboard,
    description: 'Main dashboard',
  },

  // Expense paths
  expenses: {
    label: 'Expenses',
    icon: Wallet,
    description: 'Expense management',
  },
  free: {
    label: 'Free Expenses',
    icon: Wallet,
    description: 'Track daily expenses',
  },
  budget: {
    label: 'Budget Expenses',
    icon: Target,
    description: 'Budget-controlled expenses',
  },

  // Income paths
  income: {
    label: 'Income',
    icon: PieChart,
    description: 'Income tracking',
  },

  // Budget paths
  budgets: {
    label: 'Budgets',
    icon: Target,
    description: 'Budget management',
  },

  // Category paths
  categories: {
    label: 'Categories',
    icon: PieChart,
    description: 'Category management',
  },

  // Analytics paths
  analytics: {
    label: 'Analytics',
    icon: BarChart3,
    description: 'Financial analytics',
  },

  // Settings paths
  settings: {
    label: 'Settings',
    icon: Settings,
    description: 'Application settings',
  },
  profile: {
    label: 'Profile',
    icon: User,
    description: 'User profile',
  },

  // Action paths
  add: {
    label: 'Add',
    icon: Plus,
    description: 'Add new item',
  },
  edit: {
    label: 'Edit',
    icon: Edit,
    description: 'Edit item',
  },
  view: {
    label: 'View',
    icon: Eye,
    description: 'View details',
  },
  new: {
    label: 'New',
    icon: Plus,
    description: 'Create new',
  },

  // Report paths
  reports: {
    label: 'Reports',
    icon: FileText,
    description: 'Financial reports',
  },
  export: {
    label: 'Export',
    icon: Download,
    description: 'Export data',
  },
  import: {
    label: 'Import',
    icon: Upload,
    description: 'Import data',
  },
};

export function getBreadcrumbConfig(segment: string) {
  return (
    breadcrumbConfig[segment] || {
      label: segment.charAt(0).toUpperCase() + segment.slice(1),
      description: `${segment} page`,
    }
  );
}

export function isUuidSegment(segment: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    segment
  );
}

export function isNumericSegment(segment: string): boolean {
  return /^\d+$/.test(segment);
}

export function isDynamicSegment(segment: string): boolean {
  return isUuidSegment(segment) || isNumericSegment(segment);
}

export function getDynamicSegmentLabel(
  segment: string,
  context: string[]
): string {
  if (!isDynamicSegment(segment)) {
    return segment;
  }

  // Get the previous segment for context
  const prevSegment = context[context.length - 1];

  const contextMap: Record<string, string> = {
    expenses: 'Edit Expense',
    income: 'Edit Income',
    budgets: 'Edit Budget',
    categories: 'Edit Category',
    reports: 'View Report',
    analytics: 'View Analytics',
  };

  return contextMap[prevSegment] || 'Edit';
}
