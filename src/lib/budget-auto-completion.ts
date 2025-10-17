// Utility function to check and auto-complete budgets
export const checkAndAutoCompleteBudgets = async (userId: string) => {
  try {
    const response = await fetch('/api/expenses/budget/auto-complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    
    if (response.ok) {
      const result = await response.json();
      return result.completedBudgets || [];
    }
  } catch (error) {
    console.error('Failed to auto-complete budgets:', error);
  }
  return [];
};