import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService, initializeDefaultCategories } from '@/lib/adminFirestore';
import { Category, InsertCategory } from '@/types/admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, FolderOpen } from 'lucide-react';

export function CategoryManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<InsertCategory>({
    name: '',
    nameAr: '',
    description: '',
    descriptionAr: '',
    order: 1,
    isActive: true,
  });

  // Initialize default categories on component mount
  useEffect(() => {
    initializeDefaultCategories();
  }, []);

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['admin', 'categories'],
    queryFn: categoryService.getCategories,
  });

  const createMutation = useMutation({
    mutationFn: categoryService.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
      toast({
        title: 'Succès',
        description: 'Catégorie créée avec succès',
      });
      resetForm();
    },
    onError: () => {
      toast({
        title: 'Erreur',
        description: 'Erreur lors de la création de la catégorie',
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<InsertCategory> }) =>
      categoryService.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
      toast({
        title: 'Succès',
        description: 'Catégorie mise à jour avec succès',
      });
      resetForm();
    },
    onError: () => {
      toast({
        title: 'Erreur',
        description: 'Erreur lors de la mise à jour de la catégorie',
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: categoryService.deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
      toast({
        title: 'Succès',
        description: 'Catégorie supprimée avec succès',
      });
    },
    onError: () => {
      toast({
        title: 'Erreur',
        description: 'Erreur lors de la suppression de la catégorie',
        variant: 'destructive',
      });
    },
  });

  const resetForm = () => {
    setFormData({
      name: '',
      nameAr: '',
      description: '',
      descriptionAr: '',
      order: categories.length + 1,
      isActive: true,
    });
    setEditingCategory(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      nameAr: category.nameAr,
      description: category.description,
      descriptionAr: category.descriptionAr,
      order: category.order,
      isActive: category.isActive,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (categoryId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      deleteMutation.mutate(categoryId);
    }
  };

  const handleNewCategory = () => {
    resetForm();
    setFormData(prev => ({ ...prev, order: categories.length + 1 }));
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Gestion des Catégories
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Organisez vos templates par catégories
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleNewCategory}>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle Catégorie
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom (Français)</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="nameAr">Nom (Arabe)</Label>
                  <Input
                    id="nameAr"
                    value={formData.nameAr}
                    onChange={(e) => setFormData(prev => ({ ...prev, nameAr: e.target.value }))}
                    dir="rtl"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="description">Description (Français)</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="descriptionAr">Description (Arabe)</Label>
                  <Textarea
                    id="descriptionAr"
                    value={formData.descriptionAr}
                    onChange={(e) => setFormData(prev => ({ ...prev, descriptionAr: e.target.value }))}
                    dir="rtl"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="order">Ordre d'affichage</Label>
                  <Input
                    id="order"
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) }))}
                    min="1"
                    required
                  />
                </div>
                
                <div className="flex items-center space-x-2 pt-8">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                  />
                  <Label htmlFor="isActive">Catégorie active</Label>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Annuler
                </Button>
                <Button 
                  type="submit" 
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {editingCategory ? 'Mettre à jour' : 'Créer'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card key={category.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <FolderOpen className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                    <p className="text-sm text-muted-foreground" dir="rtl">
                      {category.nameAr}
                    </p>
                  </div>
                </div>
                <Badge variant={category.isActive ? 'default' : 'secondary'}>
                  {category.isActive ? 'Actif' : 'Inactif'}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {category.description}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1" dir="rtl">
                  {category.descriptionAr}
                </p>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Ordre: {category.order}
                </span>
                
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(category)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(category.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}