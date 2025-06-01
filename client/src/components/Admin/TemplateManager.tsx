import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { templateService } from '@/lib/adminFirestore';
import { categoryService } from '@/lib/adminFirestore';
import { Template, InsertTemplate, Category } from '@/types/admin';
import { FormField } from '@/types/forms';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, FileText, Settings, Copy, Code } from 'lucide-react';
import { MarkdownTemplateEditor } from './MarkdownTemplateEditor';

export function TemplateManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [isMarkdownEditorOpen, setIsMarkdownEditorOpen] = useState(false);
  const [editingMarkdownTemplate, setEditingMarkdownTemplate] = useState<Template | null>(null);
  const [formData, setFormData] = useState<InsertTemplate>({
    name: '',
    nameAr: '',
    description: '',
    descriptionAr: '',
    categoryId: '',
    fields: [],
    isActive: true,
    order: 1,
  });

  const { data: templates = [], isLoading: templatesLoading } = useQuery({
    queryKey: ['admin', 'templates'],
    queryFn: templateService.getTemplates,
  });

  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['admin', 'categories'],
    queryFn: categoryService.getActiveCategories,
  });

  const createMutation = useMutation({
    mutationFn: templateService.createTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'templates'] });
      toast({
        title: 'Succès',
        description: 'Template créé avec succès',
      });
      resetForm();
    },
    onError: () => {
      toast({
        title: 'Erreur',
        description: 'Erreur lors de la création du template',
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<InsertTemplate> }) =>
      templateService.updateTemplate(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'templates'] });
      toast({
        title: 'Succès',
        description: 'Template mis à jour avec succès',
      });
      resetForm();
    },
    onError: () => {
      toast({
        title: 'Erreur',
        description: 'Erreur lors de la mise à jour du template',
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: templateService.deleteTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'templates'] });
      toast({
        title: 'Succès',
        description: 'Template supprimé avec succès',
      });
    },
    onError: () => {
      toast({
        title: 'Erreur',
        description: 'Erreur lors de la suppression du template',
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
      categoryId: '',
      fields: [],
      isActive: true,
      order: templates.length + 1,
    });
    setEditingTemplate(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (template: Template) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      nameAr: template.nameAr,
      description: template.description,
      descriptionAr: template.descriptionAr,
      categoryId: template.categoryId,
      fields: template.fields,
      isActive: template.isActive,
      order: template.order,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingTemplate) {
      updateMutation.mutate({ id: editingTemplate.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (templateId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce template ?')) {
      deleteMutation.mutate(templateId);
    }
  };

  const handleNewTemplate = () => {
    resetForm();
    setFormData(prev => ({ ...prev, order: templates.length + 1 }));
    setIsDialogOpen(true);
  };

  const handleNewMarkdownTemplate = () => {
    setEditingMarkdownTemplate(null);
    setIsMarkdownEditorOpen(true);
  };

  const handleEditMarkdownTemplate = (template: Template) => {
    setEditingMarkdownTemplate(template);
    setIsMarkdownEditorOpen(true);
  };

  const handleMarkdownEditorClose = () => {
    setIsMarkdownEditorOpen(false);
    setEditingMarkdownTemplate(null);
  };

  const addField = () => {
    const newField: FormField = {
      id: `field_${Date.now()}`,
      type: 'text',
      label: '',
      labelAr: '',
      placeholder: '',
      placeholderAr: '',
      required: false,
    };
    setFormData(prev => ({ ...prev, fields: [...prev.fields, newField] }));
  };

  const updateField = (index: number, field: FormField) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.map((f, i) => i === index ? field : f)
    }));
  };

  const removeField = (index: number) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.filter((_, i) => i !== index)
    }));
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Catégorie inconnue';
  };

  if (templatesLoading || categoriesLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isMarkdownEditorOpen) {
    return (
      <MarkdownTemplateEditor
        template={editingMarkdownTemplate || undefined}
        onSave={handleMarkdownEditorClose}
        onCancel={handleMarkdownEditorClose}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Gestion des Templates
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Créez et gérez les formulaires de documents
          </p>
        </div>
      </div>

      <Tabs defaultValue="form" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="form">Templates Formulaire</TabsTrigger>
          <TabsTrigger value="markdown">Templates Markdown</TabsTrigger>
        </TabsList>
        
        <TabsContent value="form" className="space-y-6">
          <div className="flex justify-end">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleNewTemplate}>
              <Plus className="h-4 w-4 mr-2" />
              Nouveau Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingTemplate ? 'Modifier le template' : 'Nouveau template'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6">
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
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="categoryId">Catégorie</Label>
                  <Select value={formData.categoryId} onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
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
                  <Label htmlFor="isActive">Template actif</Label>
                </div>
              </div>

              {/* Fields Section */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Champs du formulaire</h3>
                  <Button type="button" variant="outline" onClick={addField}>
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter un champ
                  </Button>
                </div>

                {formData.fields.map((field, index) => (
                  <Card key={field.id} className="p-4">
                    <div className="grid grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label>Type de champ</Label>
                        <Select 
                          value={field.type} 
                          onValueChange={(value) => updateField(index, { ...field, type: value as FormField['type'] })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="text">Texte</SelectItem>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="tel">Téléphone</SelectItem>
                            <SelectItem value="date">Date</SelectItem>
                            <SelectItem value="textarea">Zone de texte</SelectItem>
                            <SelectItem value="select">Liste déroulante</SelectItem>
                            <SelectItem value="checkbox">Case à cocher</SelectItem>
                            <SelectItem value="radio">Bouton radio</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Label (FR)</Label>
                        <Input
                          value={field.label}
                          onChange={(e) => updateField(index, { ...field, label: e.target.value })}
                          placeholder="Libellé en français"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Label (AR)</Label>
                        <Input
                          value={field.labelAr}
                          onChange={(e) => updateField(index, { ...field, labelAr: e.target.value })}
                          placeholder="الملصق بالعربية"
                          dir="rtl"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Actions</Label>
                        <div className="flex space-x-2">
                          <Switch
                            checked={field.required}
                            onCheckedChange={(checked) => updateField(index, { ...field, required: checked })}
                          />
                          <span className="text-sm">Requis</span>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeField(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}

                {formData.fields.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    Aucun champ ajouté. Cliquez sur "Ajouter un champ" pour commencer.
                  </div>
                )}
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Annuler
                </Button>
                <Button 
                  type="submit" 
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {editingTemplate ? 'Mettre à jour' : 'Créer'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card key={template.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <p className="text-sm text-muted-foreground" dir="rtl">
                      {template.nameAr}
                    </p>
                  </div>
                </div>
                <Badge variant={template.isActive ? 'default' : 'secondary'}>
                  {template.isActive ? 'Actif' : 'Inactif'}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {template.description}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1" dir="rtl">
                  {template.descriptionAr}
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Catégorie:</span>
                  <span>{getCategoryName(template.categoryId)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Champs:</span>
                  <span>{template.fields.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Ordre:</span>
                  <span>{template.order}</span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(template)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(template.id)}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </TabsContent>

    <TabsContent value="markdown" className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={handleNewMarkdownTemplate}>
          <Code className="h-4 w-4 mr-2" />
          Nouveau Template Markdown
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates
          .filter(template => template.markdownContent)
          .map((template) => (
          <Card key={template.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <Code className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <p className="text-sm text-muted-foreground" dir="rtl">
                      {template.nameAr}
                    </p>
                  </div>
                </div>
                <Badge variant={template.isActive ? 'default' : 'secondary'}>
                  {template.isActive ? 'Actif' : 'Inactif'}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {template.description}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1" dir="rtl">
                  {template.descriptionAr}
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Catégorie:</span>
                  <span>{getCategoryName(template.categoryId)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Champs:</span>
                  <span>{template.fields.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Type:</span>
                  <span className="text-blue-600 font-medium">Markdown</span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditMarkdownTemplate(template)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(template.id)}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </TabsContent>
  </Tabs>
    </div>
  );
}