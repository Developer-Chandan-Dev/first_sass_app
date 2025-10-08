# 🔗 Component Relationships - Visual Guide

## 📱 **UI Component Hierarchy**

```
Dashboard Layout
│
├── Sidebar Navigation
│   └── Expenses Link → /dashboard/expenses
│
└── Main Content Area
    └── ExpensePage Component
        │
        ├── 📊 Expense Stats Cards
        │   ├── Total Expenses Card
        │   ├── Monthly Expenses Card
        │   ├── Categories Count Card
        │   └── Average Per Day Card
        │
        ├── 🔍 Expense Filters
        │   ├── Search Input
        │   ├── Category Filter
        │   ├── Date Range Filter
        │   └── Type Filter (Free/Budget)
        │
        ├── 📋 Expense Table
        │   ├── Table Header (sortable columns)
        │   ├── Expense Rows
        │   │   ├── Amount Column
        │   │   ├── Category Column
        │   │   ├── Description Column
        │   │   ├── Date Column
        │   │   └── Actions Column
        │   │       ├── Edit Button → EditExpenseModal
        │   │       └── Delete Button → DeleteConfirmation
        │   └── Pagination Controls
        │
        ├── ➕ Add Expense Button → AddExpenseModal
        │
        └── 📊 Charts Section (optional)
            ├── Category Pie Chart
            └── Monthly Trend Chart
```

## 🔄 **Data Flow Between Components**

### **1. Page Load Flow**
```
User visits /dashboard/expenses
         ↓
ExpensePage component mounts
         ↓
useEffect triggers data fetching
         ↓
Redux dispatch(fetchExpenses())
         ↓
API call to /api/expenses
         ↓
Database query for user's expenses
         ↓
API returns expense array
         ↓
Redux updates store
         ↓
Components re-render with new data
         ↓
UI shows expense list, stats, charts
```

### **2. Add Expense Flow**
```
User clicks "Add Expense"
         ↓
setShowAddModal(true)
         ↓
AddExpenseModal opens
         ↓
Modal fetches connected incomes
         ↓
User fills form and submits
         ↓
modalState.executeAsync() called
         ↓
Redux dispatch(addExpense())
         ↓
API saves expense to database
         ↓
Redux updates store optimistically
         ↓
Modal closes, parent refreshes
         ↓
ExpenseTable shows new expense
         ↓
Stats cards update with new totals
```

### **3. Edit Expense Flow**
```
User clicks Edit button on expense row
         ↓
setSelectedExpense(expense)
setShowEditModal(true)
         ↓
EditExpenseModal opens with expense data
         ↓
Form pre-fills with existing values
         ↓
User modifies and submits
         ↓
Redux dispatch(updateExpense())
         ↓
API updates expense in database
         ↓
Redux updates store
         ↓
Modal closes, table refreshes
         ↓
Updated expense shows in table
```

## 🏪 **Redux Store Structure**

```typescript
// Global Redux Store
{
  expenses: {
    // All user's expenses
    expenses: [
      {
        _id: "exp1",
        amount: 50,
        category: "food",
        reason: "Lunch",
        date: "2024-01-15",
        type: "free",
        userId: "user123"
      }
    ],
    loading: false,
    error: null,
    totalCount: 25,
    currentPage: 1
  },
  
  overview: {
    // Dashboard statistics
    totalExpenses: 1250,
    monthlyExpenses: 450,
    categoryCounts: {
      food: 8,
      transport: 5,
      entertainment: 3
    },
    trends: [...]
  },
  
  budgets: {
    // Budget-related expenses
    budgets: [...],
    budgetExpenses: [...]
  },
  
  incomes: {
    // Connected income sources
    incomes: [
      {
        _id: "inc1",
        source: "Salary",
        amount: 3000,
        isConnected: true
      }
    ]
  }
}
```

## 🎯 **Component Props Flow**

### **ExpensePage (Parent)**
```typescript
function ExpensePage() {
  // State for modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  
  // Redux data
  const expenses = useSelector(state => state.expenses.expenses);
  const loading = useSelector(state => state.expenses.loading);
  
  return (
    <>
      {/* Stats Cards */}
      <ExpenseStats expenses={expenses} />
      
      {/* Filters */}
      <ExpenseFilters onFilterChange={handleFilterChange} />
      
      {/* Table */}
      <ExpenseTable 
        expenses={expenses}
        loading={loading}
        onEdit={(expense) => {
          setSelectedExpense(expense);
          setShowEditModal(true);
        }}
        onDelete={handleDelete}
      />
      
      {/* Add Button */}
      <Button onClick={() => setShowAddModal(true)}>
        Add Expense
      </Button>
      
      {/* Modals */}
      <AddExpenseModal 
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onExpenseAdded={() => {
          // Refresh data
          dispatch(fetchExpenses());
        }}
      />
      
      <EditExpenseModal
        open={showEditModal}
        expense={selectedExpense}
        onOpenChange={setShowEditModal}
        onExpenseUpdated={() => {
          // Refresh data
          dispatch(fetchExpenses());
        }}
      />
    </>
  );
}
```

### **ExpenseTable (Child)**
```typescript
function ExpenseTable({ expenses, loading, onEdit, onDelete }) {
  return (
    <Table>
      {expenses.map(expense => (
        <ExpenseRow 
          key={expense._id}
          expense={expense}
          onEdit={() => onEdit(expense)}
          onDelete={() => onDelete(expense._id)}
        />
      ))}
    </Table>
  );
}
```

### **ExpenseRow (Grandchild)**
```typescript
function ExpenseRow({ expense, onEdit, onDelete }) {
  return (
    <TableRow>
      <TableCell>{expense.amount}</TableCell>
      <TableCell>{expense.category}</TableCell>
      <TableCell>{expense.reason}</TableCell>
      <TableCell>{expense.date}</TableCell>
      <TableCell>
        <Button onClick={onEdit}>Edit</Button>
        <Button onClick={onDelete}>Delete</Button>
      </TableCell>
    </TableRow>
  );
}
```

## 🔧 **Hook Connections**

### **Custom Hooks Used**
```typescript
// Translation hook
const { expenses, common, errors } = useAppTranslations();

// Modal state hook
const modalState = useModalState({
  onSuccess: () => { /* close modal */ },
  successMessage: expenses?.addSuccess
});

// Redux hooks
const dispatch = useAppDispatch();
const expenses = useAppSelector(state => state.expenses.expenses);

// Form hook
const { register, handleSubmit, formState } = useForm({
  resolver: zodResolver(expenseSchema)
});
```

## 🌐 **API Integration Points**

### **API Routes**
```
GET    /api/expenses          → Fetch all expenses
POST   /api/expenses          → Create new expense
PUT    /api/expenses/[id]     → Update expense
DELETE /api/expenses/[id]     → Delete expense
GET    /api/incomes/connected → Fetch connected incomes
```

### **API Call Flow**
```typescript
// Component calls Redux action
dispatch(addExpense(data))
  ↓
// Redux action calls API
fetch('/api/expenses', { method: 'POST', body: data })
  ↓
// API route processes request
export async function POST(request) {
  // Validate, save to DB, return response
}
  ↓
// Response flows back to component
// Component updates UI based on success/error
```

## 🎨 **Styling & UI Integration**

### **Component Styling**
```typescript
// Tailwind CSS classes
<Dialog className="w-[95vw] max-w-md mx-auto">
<Button className="w-full sm:w-auto">
<Alert variant="destructive" className="mb-4">
```

### **Theme Integration**
```typescript
// Dark/Light mode support
<div className="bg-background text-foreground">
<Button variant="outline" className="border-input">
```

## 🔄 **State Synchronization**

### **Optimistic Updates**
```typescript
// Update UI immediately
dispatch(addExpenseOptimistic(newExpense));

// Then sync with server
dispatch(addExpense(newExpense));

// If server fails, revert optimistic update
```

### **Real-time Sync**
```typescript
// After any expense operation
useEffect(() => {
  // Refresh related data
  dispatch(fetchExpenses());
  dispatch(fetchOverviewStats());
}, [expenseUpdated]);
```

This shows how all the expense components are connected and work together as a cohesive system! 🎯