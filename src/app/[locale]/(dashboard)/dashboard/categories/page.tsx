'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PieChart, Plus, Edit, Trash2, Check, X } from 'lucide-react';
import { useDashboardTranslations } from '@/hooks/i18n';
import { useCategories } from '@/hooks/useCategories';
import { DEFAULT_CATEGORIES } from '@/lib/categories';
import { useState } from 'react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/dashboard/layout/page-header';

export default function CategoriesPage() {
  const { pages } = useDashboardTranslations();
  const { categoryOptions, addCustomCategory, loading, refetch } = useCategories();
  const [newCategory, setNewCategory] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    
    setIsAdding(true);
    const result = await addCustomCategory(newCategory.trim());
    
    if (result.success) {
      setNewCategory('');
      toast.success('Category added successfully!');
    } else {
      toast.error(result.error || 'Failed to add category');
    }
    setIsAdding(false);
  };

  const handleEditCategory = async (oldName: string, newName: string) => {
    if (!newName.trim() || newName === oldName) {
      setEditingCategory(null);
      return;
    }

    try {
      const response = await fetch('/api/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldName, newName: newName.trim() }),
      });

      if (response.ok) {
        toast.success('Category updated successfully!');
        refetch();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to update category');
      }
    } catch {
      toast.error('Failed to update category');
    }
    setEditingCategory(null);
  };

  const handleDeleteCategory = async (categoryName: string) => {
    setCategoryToDelete(categoryName);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;

    setIsDeleting(true);
    try {
      const response = await fetch('/api/categories', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: categoryToDelete }),
      });

      if (response.ok) {
        toast.success('Category deleted successfully!');
        refetch();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to delete category');
      }
    } catch {
      toast.error('Failed to delete category');
    }
    setIsDeleting(false);
    setDeleteConfirmOpen(false);
    setCategoryToDelete(null);
  };
  
  return (
    <div className="space-y-6">
      <PageHeader
        title={pages.categories.title}
        description={pages.categories.description}
      />

      {/* Add New Category */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add Custom Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Enter category name"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddCategory();
                }
              }}
            />
            <Button 
              onClick={handleAddCategory}
              disabled={!newCategory.trim() || isAdding}
            >
              {isAdding ? 'Adding...' : 'Add'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Categories List */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Default Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Default Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {DEFAULT_CATEGORIES.map((category) => {
                const option = categoryOptions.find(opt => opt.key === category.key);
                return (
                  <div key={category.key} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center gap-2">
                      <span>{category.icon}</span>
                      <span>{option?.label || category.key}</span>
                    </div>
                    <Badge variant="secondary">Default</Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Custom Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Custom Categories</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-4">Loading...</div>
            ) : (
              <div className="space-y-2">
                {categoryOptions.filter(cat => !cat.isDefault).length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    No custom categories yet
                  </div>
                ) : (
                  categoryOptions
                    .filter(cat => !cat.isDefault)
                    .map((category) => (
                      <div key={category.key} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center gap-2 flex-1">
                          <span>{category.icon}</span>
                          {editingCategory === category.key ? (
                            <div className="flex items-center gap-2 flex-1">
                              <Input
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                className="h-8"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    handleEditCategory(category.key, editValue);
                                  }
                                  if (e.key === 'Escape') {
                                    setEditingCategory(null);
                                  }
                                }}
                                autoFocus
                              />
                              <Button
                                size="sm"
                                onClick={() => handleEditCategory(category.key, editValue)}
                                className="h-8 w-8 p-0"
                              >
                                <Check className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingCategory(null)}
                                className="h-8 w-8 p-0"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ) : (
                            <span>{category.label}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">Custom</Badge>
                          {editingCategory !== category.key && (
                            <>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setEditingCategory(category.key);
                                  setEditValue(category.label);
                                }}
                                className="h-8 w-8 p-0"
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteCategory(category.key)}
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    ))
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete the category &quot;{categoryToDelete}&quot;? This action cannot be undone.
            </p>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setDeleteConfirmOpen(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}