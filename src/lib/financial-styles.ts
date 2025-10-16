/**
 * Utility functions for consistent financial styling across the application
 */

/**
 * Get color class for income amount based on connection status
 */
export function getIncomeAmountColor(isConnected: boolean): string {
  return isConnected ? 'text-blue-600' : 'text-green-600';
}

/**
 * Get color class for expense amount based on balance-affecting status
 */
export function getExpenseAmountColor(affectsBalance: boolean): string {
  return affectsBalance ? 'text-red-600' : 'text-gray-600';
}

/**
 * Get indicator dot color for income connection status
 */
export function getIncomeIndicatorColor(isConnected: boolean): string {
  return isConnected ? 'bg-blue-500' : 'bg-green-500';
}

/**
 * Get indicator dot color for expense balance-affecting status
 */
export function getExpenseIndicatorColor(affectsBalance: boolean): string {
  return affectsBalance ? 'bg-red-500' : 'bg-gray-500';
}

/**
 * Get tooltip text for income connection status
 */
export function getIncomeTooltip(isConnected: boolean): string {
  return isConnected ? 'Connected to Balance' : 'Tracking Only';
}

/**
 * Get tooltip text for expense balance-affecting status
 */
export function getExpenseTooltip(affectsBalance: boolean): string {
  return affectsBalance ? 'Reduces Balance' : 'Tracking Only';
}
