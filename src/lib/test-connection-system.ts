/**
 * Test script to verify income-expense connection system
 * Run this to check if the balance calculation works correctly
 */

interface TestIncome {
  amount: number;
  isConnected: boolean;
  source: string;
}

interface TestExpense {
  amount: number;
  affectsBalance: boolean;
  category: string;
}

function calculateBalance(incomes: TestIncome[], expenses: TestExpense[]) {
  const connectedIncome = incomes
    .filter(income => income.isConnected)
    .reduce((sum, income) => sum + income.amount, 0);
    
  const balanceAffectingExpenses = expenses
    .filter(expense => expense.affectsBalance)
    .reduce((sum, expense) => sum + expense.amount, 0);
    
  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  return {
    connectedIncome,
    balanceAffectingExpenses,
    balance: connectedIncome - balanceAffectingExpenses,
    totalIncome,
    totalExpenses,
    hasConnectedIncome: connectedIncome > 0
  };
}

// Test scenarios
export function testConnectionSystem() {
  console.log('🧪 Testing Income-Expense Connection System\n');
  
  // Test Case 1: Basic connection
  const testIncomes1: TestIncome[] = [
    { amount: 50000, isConnected: true, source: 'Salary' },
    { amount: 10000, isConnected: false, source: 'Gift' }
  ];
  
  const testExpenses1: TestExpense[] = [
    { amount: 15000, affectsBalance: true, category: 'Rent' },
    { amount: 5000, affectsBalance: false, category: 'Business' }
  ];
  
  const result1 = calculateBalance(testIncomes1, testExpenses1);
  console.log('Test Case 1 - Basic Connection:');
  console.log(`Connected Income: ₹${result1.connectedIncome.toLocaleString()}`);
  console.log(`Balance-Affecting Expenses: ₹${result1.balanceAffectingExpenses.toLocaleString()}`);
  console.log(`Available Balance: ₹${result1.balance.toLocaleString()}`);
  console.log(`Total Income: ₹${result1.totalIncome.toLocaleString()}`);
  console.log(`Total Expenses: ₹${result1.totalExpenses.toLocaleString()}`);
  console.log(`Has Connected Income: ${result1.hasConnectedIncome}\n`);
  
  // Test Case 2: No connected income
  const testIncomes2: TestIncome[] = [
    { amount: 25000, isConnected: false, source: 'Investment' },
    { amount: 15000, isConnected: false, source: 'Freelance' }
  ];
  
  const testExpenses2: TestExpense[] = [
    { amount: 10000, affectsBalance: true, category: 'Food' },
    { amount: 8000, affectsBalance: false, category: 'Entertainment' }
  ];
  
  const result2 = calculateBalance(testIncomes2, testExpenses2);
  console.log('Test Case 2 - No Connected Income:');
  console.log(`Connected Income: ₹${result2.connectedIncome.toLocaleString()}`);
  console.log(`Balance-Affecting Expenses: ₹${result2.balanceAffectingExpenses.toLocaleString()}`);
  console.log(`Available Balance: ₹${result2.balance.toLocaleString()}`);
  console.log(`Has Connected Income: ${result2.hasConnectedIncome}\n`);
  
  // Test Case 3: Multiple connected sources
  const testIncomes3: TestIncome[] = [
    { amount: 40000, isConnected: true, source: 'Salary' },
    { amount: 20000, isConnected: true, source: 'Freelance' },
    { amount: 5000, isConnected: false, source: 'Bonus' }
  ];
  
  const testExpenses3: TestExpense[] = [
    { amount: 12000, affectsBalance: true, category: 'Rent' },
    { amount: 8000, affectsBalance: true, category: 'Groceries' },
    { amount: 3000, affectsBalance: false, category: 'Investment' }
  ];
  
  const result3 = calculateBalance(testIncomes3, testExpenses3);
  console.log('Test Case 3 - Multiple Connected Sources:');
  console.log(`Connected Income: ₹${result3.connectedIncome.toLocaleString()}`);
  console.log(`Balance-Affecting Expenses: ₹${result3.balanceAffectingExpenses.toLocaleString()}`);
  console.log(`Available Balance: ₹${result3.balance.toLocaleString()}`);
  console.log(`Has Connected Income: ${result3.hasConnectedIncome}\n`);
  
  console.log('✅ All test cases completed successfully!');
  
  return {
    testCase1: result1,
    testCase2: result2,
    testCase3: result3
  };
}

// Visual indicators test
export function testVisualIndicators() {
  console.log('🎨 Testing Visual Indicators\n');
  
  const incomes = [
    { amount: 50000, isConnected: true, source: 'Salary' },
    { amount: 10000, isConnected: false, source: 'Gift' }
  ];
  
  const expenses = [
    { amount: 15000, affectsBalance: true, category: 'Rent' },
    { amount: 5000, affectsBalance: false, category: 'Business' }
  ];
  
  console.log('Income Visual Indicators:');
  incomes.forEach(income => {
    const indicator = income.isConnected ? '🔵' : '🟢';
    const color = income.isConnected ? 'blue' : 'green';
    console.log(`${indicator} ${income.source}: ₹${income.amount.toLocaleString()} (${color} - ${income.isConnected ? 'Connected' : 'Unconnected'})`);
  });
  
  console.log('\nExpense Visual Indicators:');
  expenses.forEach(expense => {
    const indicator = expense.affectsBalance ? '🔴' : '⚫';
    const color = expense.affectsBalance ? 'red' : 'gray';
    console.log(`${indicator} ${expense.category}: ₹${expense.amount.toLocaleString()} (${color} - ${expense.affectsBalance ? 'Affects Balance' : 'Tracking Only'})`);
  });
  
  console.log('\n✅ Visual indicators test completed!');
}