import { useState, useEffect, useMemo } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import ReactMarkdown from 'react-markdown';
import { templateService } from '@/lib/adminFirestore';
import { Template, InsertTemplate } from '@/types/admin';
import { FormField } from '@/types/forms';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Save, Eye, Code, FileText } from 'lucide-react';

interface MarkdownTemplateEditorProps {
  template?: Template;
  categories: any[];
  onSave?: () => void;
  onCancel?: () => void;
}

export function MarkdownTemplateEditor({ template, categories, onSave, onCancel }: MarkdownTemplateEditorProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [markdownContent, setMarkdownContent] = useState(template?.markdownContent || '');
  const [formData, setFormData] = useState<Partial<InsertTemplate>>({
    name: template?.name || '',
    nameAr: template?.nameAr || '',
    description: template?.description || '',
    descriptionAr: template?.descriptionAr || '',
    categoryId: template?.categoryId || '',
    isActive: template?.isActive ?? true,
    order: template?.order || 1,
  });
  const [previewMode, setPreviewMode] = useState(false);

  // Extract field names from markdown content
  const extractedFields = useMemo(() => {
    const fieldRegex = /\/([a-zA-Z_][a-zA-Z0-9_]*)\b/g;
    const matches = [...markdownContent.matchAll(fieldRegex)];
    const uniqueFields = [...new Set(matches.map(match => match[1]))];

    return uniqueFields.map(fieldName => ({
      id: fieldName,
      type: 'text' as const,
      label: fieldName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      labelAr: fieldName.replace(/_/g, ' '),
      placeholder: '',
      placeholderAr: '',
      required: false,
    }));
  }, [markdownContent]);

  // Parse markdown and replace field placeholders with inputs
  const parsedContent = useMemo(() => {
    let content = markdownContent;

    // Replace field placeholders with styled input boxes
    extractedFields.forEach(field => {
      const regex = new RegExp(`\\/${field.id}\\b`, 'g');
      content = content.replace(regex, `<div class="field-placeholder">
        <label class="field-label">${field.label}:</label>
        <div class="field-input">____________________</div>
      </div>`);
    });

    return content;
  }, [markdownContent, extractedFields]);

  const createMutation = useMutation({
    mutationFn: async (data: InsertTemplate & { markdownContent: string }) => {
      const templateData = { ...data };
      delete (templateData as any).markdownContent;
      const templateId = await templateService.createTemplate(templateData);

      // Store markdown content separately or as part of template
      // For now, we'll add it to the template data
      await templateService.updateTemplate(templateId, { 
        markdownContent,
        fields: extractedFields 
      } as any);

      return templateId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'templates'] });
      toast({
        title: 'Succès',
        description: 'Template Markdown créé avec succès',
      });
      onSave?.();
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
    mutationFn: async (data: Partial<InsertTemplate> & { markdownContent: string }) => {
      if (!template?.id) throw new Error('Template ID required');

      const templateData = { ...data };
      delete (templateData as any).markdownContent;

      await templateService.updateTemplate(template.id, {
        ...templateData,
        markdownContent,
        fields: extractedFields
      } as any);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'templates'] });
      toast({
        title: 'Succès',
        description: 'Template Markdown mis à jour avec succès',
      });
      onSave?.();
    },
    onError: () => {
      toast({
        title: 'Erreur',
        description: 'Erreur lors de la mise à jour du template',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const templateData = {
      ...formData,
      fields: extractedFields,
    } as InsertTemplate;

    if (template) {
      updateMutation.mutate({ ...templateData, markdownContent });
    } else {
      createMutation.mutate({ ...templateData, markdownContent });
    }
  };

  const sampleMarkdown = `# Demande de Congé / طلب عجازة

## Informations Personnelles / المعلومات الشخصية

**Nom complet / الاسم الكامل:** /full_name

**Numéro d'employé / رقم الموظف:** /employee_id

**Département / القسم:** /department

**Poste / المنصب:** /position

---

## Détails du Congé / تفاصيل الإجازة

**Type de congé / نوع الإجازة:** /leave_type

**Date de début / تاريخ البداية:** /start_date

**Date de fin / تاريخ النهاية:** /end_date

**Nombre de jours / عدد الأيام:** /days_count

**Raison / السبب:** /reason

---

## Coordonnées pendant le congé / معلومات الاتصال أثناء الإجازة

**Téléphone / الهاتف:** /contact_phone

**Email / البريد الإلكتروني:** /contact_email

---

**Signature / التوقيع:** /signature

**Date / التاريخ:** /signature_date`;

  useEffect(() => {
    if (!markdownContent && !template) {
      setMarkdownContent(sampleMarkdown);
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {template ? 'Modifier Template Markdown' : 'Nouveau Template Markdown'}
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Créez des formulaires avec Markdown et des champs dynamiques
          </p>
        </div>

        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => setPreviewMode(!previewMode)}
            className="flex items-center space-x-2"
          >
            {previewMode ? <Code className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            <span>{previewMode ? 'Éditeur' : 'Aperçu'}</span>
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Template Info */}
        <Card>
          <CardHeader>
            <CardTitle>Informations du Template</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
          </CardContent>
        </Card>

        {/* Editor/Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Markdown Editor */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Code className="h-5 w-5" />
                <span>Éditeur Markdown</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="markdown">
                  Contenu Markdown 
                  <span className="text-sm text-muted-foreground ml-2">
                    (Utilisez /nom_du_champ pour les champs)
                  </span>
                </Label>
                <Textarea
                  id="markdown"
                  value={markdownContent}
                  onChange={(e) => setMarkdownContent(e.target.value)}
                  rows={20}
                  className="font-mono text-sm"
                  placeholder="Saisissez votre template Markdown ici..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Live Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="h-5 w-5" />
                <span>Aperçu du Document</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-white border border-gray-300 p-6 min-h-[500px] print-preview">
                <style>{`
                  .field-placeholder {
                    margin: 12px 0;
                    display: block;
                  }
                  .field-label {
                    font-weight: bold;
                    color: #000;
                    font-size: 14px;
                    display: block;
                    margin-bottom: 4px;
                  }
                  .field-input {
                    border-bottom: 1px solid #000;
                    padding-bottom: 2px;
                    min-height: 20px;
                    color: #000;
                    font-size: 12px;
                  }
                  .print-preview h1, .print-preview h2, .print-preview h3 {
                    color: #000;
                    margin-bottom: 16px;
                  }
                  .print-preview p, .print-preview div {
                    color: #000;
                    line-height: 1.6;
                  }
                  .print-preview hr {
                    border: none;
                    border-top: 1px solid #000;
                    margin: 20px 0;
                  }
                `}</style>
                <ReactMarkdown
                  components={{
                    div: ({ children, ...props }) => (
                      <div {...props} dangerouslySetInnerHTML={{ __html: children as string }} />
                    ),
                  }}
                >
                  {parsedContent}
                </ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detected Fields */}
        {extractedFields.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Champs Détectés ({extractedFields.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {extractedFields.map((field) => (
                  <div
                    key={field.id}
                    className="bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded text-sm"
                  >
                    <code className="font-mono">/{field.id}</code>
                    <div className="text-xs text-muted-foreground mt-1">
                      {field.label}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button 
            type="submit" 
            disabled={createMutation.isPending || updateMutation.isPending}
            className="flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>{template ? 'Mettre à jour' : 'Créer'}</span>
          </Button>
        </div>
      </form>
    </div>
  );
}