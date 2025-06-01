export interface FormField {
  id: string;
  type: 'text' | 'email' | 'tel' | 'date' | 'select' | 'textarea' | 'checkbox' | 'radio';
  label: string;
  labelAr: string;
  placeholder?: string;
  placeholderAr?: string;
  required?: boolean;
  options?: Array<{ value: string; label: string; labelAr: string }>;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
    messageAr?: string;
  };
}

export interface FormSchema {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  category: string;
  estimatedTime: string;
  icon: string;
  fields: FormField[];
}

export interface FormData {
  [key: string]: any;
}
