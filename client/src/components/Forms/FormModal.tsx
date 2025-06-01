import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FormSchema, FormData } from '@/types/forms';
import { DynamicForm } from './DynamicForm';

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  formSchema: FormSchema | null;
  initialData?: FormData;
  onSave?: (data: FormData) => void;
}

export function FormModal({ isOpen, onClose, formSchema, initialData, onSave }: FormModalProps) {
  if (!formSchema) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">
            {formSchema.name}
          </DialogTitle>
        </DialogHeader>
        <DynamicForm
          formSchema={formSchema}
          initialData={initialData}
          onSave={onSave}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}
