import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { FormSchema, FormField as FormFieldType, FormData } from '@/types/forms';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { generatePDF } from '@/utils/pdfGenerator';
import { savedFormsService } from '@/lib/firestore';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

interface DynamicFormProps {
  formSchema: FormSchema;
  initialData?: FormData;
  onSave?: (data: FormData) => void;
  onCancel?: () => void;
}

export function DynamicForm({ formSchema, initialData = {}, onSave, onCancel }: DynamicFormProps) {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const isRTL = i18n.language === 'ar';

  // Create dynamic validation schema
  const validationSchema = z.object(
    formSchema.fields.reduce((acc, field) => {
      let validator = z.string();
      
      if (field.required) {
        validator = validator.min(1, 'This field is required');
      } else {
        validator = validator.optional();
      }
      
      if (field.validation) {
        if (field.validation.min) {
          validator = validator.min(field.validation.min, field.validation.message || `Minimum ${field.validation.min} characters`);
        }
        if (field.validation.max) {
          validator = validator.max(field.validation.max, field.validation.message || `Maximum ${field.validation.max} characters`);
        }
        if (field.validation.pattern) {
          validator = validator.regex(new RegExp(field.validation.pattern), field.validation.message || 'Invalid format');
        }
      }
      
      acc[field.id] = validator;
      return acc;
    }, {} as Record<string, z.ZodString | z.ZodOptional<z.ZodString>>)
  );

  const form = useForm<FormData>({
    resolver: zodResolver(validationSchema),
    defaultValues: initialData,
  });

  const { register, handleSubmit, formState: { errors }, setValue, watch } = form;

  const formData = watch();

  const renderField = (field: FormFieldType) => {
    const label = isRTL ? field.labelAr : field.label;
    const placeholder = isRTL ? field.placeholderAr : field.placeholder;
    const fieldError = errors[field.id];

    switch (field.type) {
      case 'text':
      case 'email':
      case 'tel':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className={isRTL ? 'text-right' : ''}>
              {label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Input
              id={field.id}
              type={field.type}
              placeholder={placeholder}
              {...register(field.id)}
              className={fieldError ? 'border-destructive' : ''}
              dir={isRTL ? 'rtl' : 'ltr'}
            />
            {fieldError && (
              <p className="text-sm text-destructive">{fieldError.message}</p>
            )}
          </div>
        );

      case 'date':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className={isRTL ? 'text-right' : ''}>
              {label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Input
              id={field.id}
              type="date"
              {...register(field.id)}
              className={fieldError ? 'border-destructive' : ''}
            />
            {fieldError && (
              <p className="text-sm text-destructive">{fieldError.message}</p>
            )}
          </div>
        );

      case 'textarea':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className={isRTL ? 'text-right' : ''}>
              {label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Textarea
              id={field.id}
              placeholder={placeholder}
              {...register(field.id)}
              className={fieldError ? 'border-destructive' : ''}
              dir={isRTL ? 'rtl' : 'ltr'}
            />
            {fieldError && (
              <p className="text-sm text-destructive">{fieldError.message}</p>
            )}
          </div>
        );

      case 'select':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className={isRTL ? 'text-right' : ''}>
              {label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Select
              onValueChange={(value) => setValue(field.id, value)}
              defaultValue={initialData[field.id]}
            >
              <SelectTrigger className={fieldError ? 'border-destructive' : ''}>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {isRTL ? option.labelAr : option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fieldError && (
              <p className="text-sm text-destructive">{fieldError.message}</p>
            )}
          </div>
        );

      case 'checkbox':
        return (
          <div key={field.id} className="flex items-center space-x-2 rtl:space-x-reverse">
            <Checkbox
              id={field.id}
              {...register(field.id)}
            />
            <Label htmlFor={field.id} className={isRTL ? 'text-right' : ''}>
              {label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            {fieldError && (
              <p className="text-sm text-destructive">{fieldError.message}</p>
            )}
          </div>
        );

      case 'radio':
        return (
          <div key={field.id} className="space-y-3">
            <Label className={isRTL ? 'text-right' : ''}>
              {label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <RadioGroup
              onValueChange={(value) => setValue(field.id, value)}
              defaultValue={initialData[field.id]}
              className="flex flex-col space-y-2"
            >
              {field.options?.map((option) => (
                <div key={option.value} className="flex items-center space-x-2 rtl:space-x-reverse">
                  <RadioGroupItem value={option.value} id={`${field.id}-${option.value}`} />
                  <Label htmlFor={`${field.id}-${option.value}`}>
                    {isRTL ? option.labelAr : option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            {fieldError && (
              <p className="text-sm text-destructive">{fieldError.message}</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const onSubmit = async (data: FormData) => {
    if (onSave) {
      onSave(data);
    }
  };

  const handleSaveForm = async () => {
    const formData = watch();
    
    if (!user) {
      toast({
        title: t('common.error'),
        description: 'Please log in to save forms',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);
    try {
      const title = `${isRTL ? formSchema.nameAr : formSchema.name} - ${new Date().toLocaleDateString()}`;
      
      await savedFormsService.saveForm(user.uid, {
        formId: formSchema.id,
        formType: formSchema.category,
        title,
        formData
      });

      toast({
        title: t('common.success'),
        description: 'Form saved successfully!',
      });
    } catch (error) {
      console.error('Error saving form:', error);
      toast({
        title: t('common.error'),
        description: 'Failed to save form. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleGeneratePDF = async () => {
    setIsGenerating(true);
    try {
      await generatePDF(formSchema, formData, i18n.language);
      toast({
        title: t('common.success'),
        description: 'PDF generated successfully!',
      });
    } catch (error) {
      console.error('PDF generation error:', error);
      toast({
        title: t('common.error'),
        description: 'Failed to generate PDF. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className={isRTL ? 'text-right' : ''}>
          {isRTL ? formSchema.nameAr : formSchema.name}
        </CardTitle>
        <p className={`text-muted-foreground ${isRTL ? 'text-right' : ''}`}>
          {isRTL ? formSchema.descriptionAr : formSchema.description}
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {formSchema.fields.map(renderField)}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-end pt-6 border-t">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                {t('common.cancel')}
              </Button>
            )}
            {user && (
              <Button 
                type="button" 
                variant="secondary" 
                onClick={handleSaveForm}
                disabled={isSaving}
              >
                {isSaving ? t('common.loading') : t('forms.save')}
              </Button>
            )}
            <Button
              type="button"
              onClick={handleGeneratePDF}
              disabled={isGenerating}
            >
              {isGenerating ? t('forms.downloading') : t('forms.generate')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
