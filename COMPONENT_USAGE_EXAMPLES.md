# 🔧 Component Usage Examples - How They Actually Work

## 1. **useModalState Hook** - Step by Step

### **Setup in Modal Component**

```typescript
// In AddExpenseModal component
const modalState = useModalState({
  onSuccess: () => {
    reset(); // Reset form
    onOpenChange(false); // Close modal
    onExpenseAdded?.(); // Callback
  },
  successMessage: expenses?.addSuccess || 'Expense added successfully',
});
```

### **What This Creates**

```typescript
// modalState object contains:
{
  isLoading: false,      // For data fetching
  isSubmitting: false,   // For form submission
  error: null,           // Error message to display
  setLoading: (bool) => void,
  setSubmitting: (bool) => void,
  executeAsync: (asyncFn) => Promise,
  handleError: (error) => void,
  handleSuccess: (message) => void,
  reset: () => void
}
```

## 2. **Real Usage in Form Submission**

### **Before (Old Way)**

```typescript
const onSubmit = async (data) => {
  setIsSubmitting(true);
  try {
    const response = await fetch('/api/expenses', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      toast.error(error.message);
      return;
    }

    toast.success('Expense added successfully');
    reset();
    onOpenChange(false);
  } catch (error) {
    toast.error('Failed to add expense');
  } finally {
    setIsSubmitting(false);
  }
};
```

### **After (New Way)**

```typescript
const onSubmit = async (data) => {
  await modalState.executeAsync(async () => {
    // Just the business logic
    const requestData = { ...data, type: expenseType };
    const res = await dispatch(addExpense(requestData)).unwrap();
    dispatch(addExpenseOptimistic(res));
    return res;
  }, expenses?.addSuccess || 'Expense added successfully');
};
```

## 3. **Loading States in UI**

### **Data Fetching Loading**

```typescript
// In useEffect
useEffect(() => {
  const fetchData = async () => {
    modalState.setLoading(true); // Show loading
    try {
      const response = await fetch('/api/incomes/connected');
      const incomes = await response.json();
      setConnectedIncomes(incomes);
    } catch (error) {
      modalState.handleError(error); // Show error + toast
    } finally {
      modalState.setLoading(false); // Hide loading
    }
  };

  if (open) fetchData();
}, [open]);
```

### **UI Shows Loading**

```typescript
{modalState.isLoading && (
  <div className="flex items-center justify-center py-4">
    <Loader2 className="h-6 w-6 animate-spin" />
    <span className="ml-2">Loading...</span>
  </div>
)}
```

## 4. **Error Display in UI**

### **Error Alert**

```typescript
{modalState.error && (
  <Alert variant="destructive" className="mb-4">
    <AlertCircle className="h-4 w-4" />
    <AlertDescription>{modalState.error}</AlertDescription>
  </Alert>
)}
```

### **Button Loading State**

```typescript
<Button
  type="submit"
  disabled={modalState.isSubmitting || modalState.isLoading}
>
  {modalState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
  {modalState.isSubmitting ? 'Adding...' : 'Add Expense'}
</Button>
```

## 5. **Toast Utils - Practical Examples**

### **Simple Usage**

```typescript
import { toastUtils, operationToasts } from '@/lib/toast-utils';

// Basic toasts
toastUtils.success('Operation completed');
toastUtils.error('Something went wrong');
toastUtils.warning('Please check your input');

// Operation-specific toasts
operationToasts.created('Expense'); // "Expense created successfully"
operationToasts.updated('Budget'); // "Budget updated successfully"
operationToasts.bulkDeleted(5, 'expense'); // "5 expenses deleted successfully"
```

### **Promise-based Toast**

```typescript
// Automatically shows loading, success, or error
toastUtils.promise(
  fetch('/api/expenses').then((r) => r.json()),
  {
    loading: 'Saving expense...',
    success: 'Expense saved successfully!',
    error: 'Failed to save expense',
  }
);
```

### **Advanced Usage with Actions**

```typescript
toastUtils.custom('Changes saved', {
  label: 'Undo',
  onClick: () => {
    // Undo logic
  },
});
```

## 6. **Error Boundary - How It Works**

### **Wrap Components**

```typescript
import { ModalErrorBoundary } from '@/components/ui/error-boundary';

<ModalErrorBoundary onError={() => onClose()}>
  <YourModalContent />
</ModalErrorBoundary>
```

### **What Happens When Error Occurs**

1. JavaScript error is caught
2. Error boundary shows fallback UI
3. User sees friendly error message
4. Options to retry or go home
5. Error is logged (in development)

## 7. **Loading Components - Visual Examples**

### **Different Loading Types**

```typescript
import { Loading, LoadingOverlay, SkeletonCard } from '@/components/ui/loading';

// Spinner loading
<Loading variant="spinner" size="md" text="Loading data..." />

// Dots loading
<Loading variant="dots" size="lg" />

// Skeleton loading
<SkeletonCard />

// Loading overlay
<LoadingOverlay isLoading={isLoading} text="Saving...">
  <YourContent />
</LoadingOverlay>
```

## 8. **Complete Flow Example**

### **User Clicks "Add Expense" Button**

1. Modal opens
2. `modalState.setLoading(true)` - Shows loading spinner
3. Fetches connected incomes from API
4. If successful: `modalState.setLoading(false)` - Hides loading
5. If error: `modalState.handleError(error)` - Shows error alert + toast

### **User Fills Form and Submits**

1. `modalState.executeAsync()` called
2. `modalState.setSubmitting(true)` - Button shows spinner
3. API call made
4. If successful:
   - `toast.success()` shown
   - `onSuccess()` callback runs
   - Form resets and modal closes
5. If error:
   - `toast.error()` shown
   - Error alert appears
   - Form stays open for retry

## 9. **Real Visual Flow**

```
User Opens Modal
       ↓
[Loading Spinner] "Loading..."
       ↓
Data Loaded Successfully
       ↓
[Form Displayed]
       ↓
User Submits Form
       ↓
[Button Spinner] "Adding..."
       ↓
Success: [Toast] "Expense added successfully!"
       ↓
Modal Closes
```

## 10. **Error Scenarios**

### **Network Error**

```
User Submits → Network Fails → [Error Alert] + [Toast] "Network error"
```

### **Validation Error**

```
User Submits → Validation Fails → [Error Alert] "Amount is required"
```

### **API Error**

```
User Submits → API Returns 400 → [Error Alert] + [Toast] "Invalid data"
```

## 11. **Key Benefits**

### **Before**

- Manual loading state management
- Inconsistent error handling
- Repeated toast logic
- No internationalization
- Poor user feedback

### **After**

- Automatic loading states
- Consistent error handling
- Centralized toast management
- Full internationalization
- Rich user feedback with icons and animations

## 12. **Where Components Are Used**

### **useModalState Hook**

- ✅ AddExpenseModal
- ✅ EditExpenseModal
- ✅ AddIncomeModal
- ✅ EditIncomeModal
- ✅ BudgetModal

### **Toast Utils**

- Used automatically by `useModalState`
- Can be used directly anywhere in the app
- Provides consistent notification experience

### **Error Boundary**

- Can wrap any component
- Especially useful for modals
- Catches JavaScript errors gracefully

### **Loading Components**

- Used in modals for loading states
- Can be used anywhere loading is needed
- Provides consistent loading experience

All these components work together to create a professional, user-friendly experience with proper error handling, loading states, and internationalization! 🎯
