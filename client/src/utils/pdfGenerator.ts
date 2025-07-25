import html2pdf from 'html2pdf.js';
import { FormSchema, FormData } from '@/types/forms';
import { Template } from '@/types/admin';
import { documentsService } from '@/lib/firestore';
import { auth } from '@/lib/firebase';

export interface PDFOptions {
  margin: number;
  filename: string;
  image: { type: string; quality: number };
  html2canvas: { scale: number };
  jsPDF: { unit: string; format: string; orientation: string };
}

const defaultOptions: PDFOptions = {
  margin: 1,
  filename: 'document.pdf',
  image: { type: 'jpeg', quality: 0.98 },
  html2canvas: { scale: 2 },
  jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
};

export function generatePDF(
  formSchema: FormSchema,
  formData: FormData,
  language: string = 'fr',
  options: Partial<PDFOptions> = {}
): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      const finalOptions = { ...defaultOptions, ...options };
      finalOptions.filename = `${formSchema.id}-${Date.now()}.pdf`;

      const htmlContent = generateHTMLContent(formSchema, formData, language);
      
      // Generate and save PDF
      await html2pdf()
        .from(htmlContent)
        .set(finalOptions)
        .save();

      // Record generation in Firestore if user is authenticated
      const currentUser = auth.currentUser;
      if (currentUser) {
        try {
          await documentsService.recordGeneration(currentUser.uid, {
            formId: formSchema.id,
            formType: formSchema.category,
            title: language === 'ar' ? formSchema.nameAr : formSchema.name
          });
        } catch (firestoreError) {
          console.error('Error recording document generation:', firestoreError);
          // Don't fail the PDF generation if Firestore fails
        }
      }

      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

export function generateMarkdownPDF(
  template: Template,
  formData: FormData,
  language: string = 'fr',
  options: Partial<PDFOptions> = {}
): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      const finalOptions = { ...defaultOptions, ...options };
      finalOptions.filename = `${template.id}-${Date.now()}.pdf`;

      const htmlContent = generateMarkdownHTMLContent(template, formData, language);
      
      // Generate and save PDF
      await html2pdf()
        .from(htmlContent)
        .set(finalOptions)
        .save();

      // Record generation in Firestore if user is authenticated
      const currentUser = auth.currentUser;
      if (currentUser) {
        try {
          await documentsService.recordGeneration(currentUser.uid, {
            formId: template.id,
            formType: template.categoryId,
            title: language === 'ar' ? template.nameAr : template.name
          });
        } catch (firestoreError) {
          console.error('Error recording document generation:', firestoreError);
          // Don't fail the PDF generation if Firestore fails
        }
      }

      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

function generateHTMLContent(
  formSchema: FormSchema,
  formData: FormData,
  language: string
): string {
  const isRTL = language === 'ar';
  const title = isRTL ? formSchema.nameAr : formSchema.name;
  
  const fields = formSchema.fields.map(field => {
    const label = isRTL ? field.labelAr : field.label;
    const value = formData[field.id] || '-';
    
    return `
      <div class="field" style="margin-bottom: 20px;">
        <label style="font-weight: bold; display: block; margin-bottom: 5px; color: #000000; font-size: 14px;">${label}:</label>
        <div style="border-bottom: 1px solid #000000; padding-bottom: 5px; min-height: 20px; color: #000000; font-size: 12px;">${value}</div>
      </div>
    `;
  }).join('');

  return `
    <div style="
      font-family: 'Arial', sans-serif;
      direction: ${isRTL ? 'rtl' : 'ltr'};
      text-align: ${isRTL ? 'right' : 'left'};
      padding: 40px;
      max-width: 800px;
      margin: 0 auto;
      line-height: 1.6;
      background-color: #ffffff;
      color: #000000;
    ">
      <div style="text-align: center; margin-bottom: 40px;">
        <h1 style="color: #000000; margin-bottom: 10px; font-size: 24px; font-weight: bold;">${title}</h1>
        <p style="color: #000000; font-size: 12px; margin-bottom: 10px;">
          ${language === 'ar' ? 'الجمهورية الجزائرية الديمقراطية الشعبية' : 'République Algérienne Démocratique et Populaire'}
        </p>
        <hr style="border: none; border-top: 2px solid #000000; width: 200px; margin: 20px auto;">
      </div>
      
      <div style="margin-bottom: 40px;">
        ${fields}
      </div>
      
      <div style="margin-top: 60px; text-align: center;">
        <p style="color: #000000; font-size: 10px; margin-bottom: 5px;">
          ${language === 'ar' ? 'تم إنشاء هذه الوثيقة إلكترونياً' : 'Document généré électroniquement'}
        </p>
        <p style="color: #000000; font-size: 10px;">
          ${language === 'ar' ? 'التاريخ: ' : 'Date: '}${new Date().toLocaleDateString(
            language === 'ar' ? 'ar-DZ' : 'fr-FR'
          )}
        </p>
      </div>
    </div>
  `;
}

function generateMarkdownHTMLContent(
  template: Template,
  formData: FormData,
  language: string
): string {
  const isRTL = language === 'ar';
  const title = isRTL ? template.nameAr : template.name;
  
  if (!template.markdownContent) {
    throw new Error('Template markdown content is missing');
  }

  let content = template.markdownContent;
  
  // Replace field placeholders with actual values
  template.fields.forEach(field => {
    const regex = new RegExp(`\\/${field.id}\\b`, 'g');
    const value = formData[field.id] || '____________________';
    const label = isRTL ? (field.labelAr || field.label) : field.label;
    
    const fieldHTML = `
      <div style="margin: 12px 0; display: block;">
        <strong style="font-weight: bold; color: #000000; font-size: 14px; display: block; margin-bottom: 4px;">${label}:</strong>
        <div style="border-bottom: 1px solid #000000; padding-bottom: 5px; min-height: 20px; color: #000000; font-size: 12px;">${value}</div>
      </div>
    `;
    
    content = content.replace(regex, fieldHTML);
  });

  // Convert markdown to HTML (basic conversion)
  content = content
    .replace(/^# (.*$)/gim, '<h1 style="color: #000000; margin-bottom: 16px; font-size: 24px; font-weight: bold;">$1</h1>')
    .replace(/^## (.*$)/gim, '<h2 style="color: #000000; margin-bottom: 14px; font-size: 20px; font-weight: bold;">$1</h2>')
    .replace(/^### (.*$)/gim, '<h3 style="color: #000000; margin-bottom: 12px; font-size: 16px; font-weight: bold;">$1</h3>')
    .replace(/\*\*(.*)\*\*/gim, '<strong style="font-weight: bold;">$1</strong>')
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
    .replace(/^---$/gim, '<hr style="border: none; border-top: 1px solid #000000; margin: 20px 0;">')
    .replace(/\n\n/g, '</p><p style="color: #000000; line-height: 1.6; margin-bottom: 10px;">')
    .replace(/\n/g, '<br>');

  content = `<p style="color: #000000; line-height: 1.6; margin-bottom: 10px;">${content}</p>`;

  return `
    <div style="
      font-family: 'Arial', sans-serif;
      direction: ${isRTL ? 'rtl' : 'ltr'};
      text-align: ${isRTL ? 'right' : 'left'};
      padding: 40px;
      max-width: 800px;
      margin: 0 auto;
      line-height: 1.6;
      background-color: #ffffff;
      color: #000000;
    ">
      <div style="text-align: center; margin-bottom: 40px;">
        <p style="color: #000000; font-size: 12px; margin-bottom: 10px;">
          ${language === 'ar' ? 'الجمهورية الجزائرية الديمقراطية الشعبية' : 'République Algérienne Démocratique et Populaire'}
        </p>
        <hr style="border: none; border-top: 2px solid #000000; width: 200px; margin: 20px auto;">
      </div>
      
      <div style="margin-bottom: 40px;">
        ${content}
      </div>
      
      <div style="margin-top: 60px; text-align: center;">
        <p style="color: #000000; font-size: 10px; margin-bottom: 5px;">
          ${language === 'ar' ? 'تم إنشاء هذه الوثيقة إلكترونياً' : 'Document généré électroniquement'}
        </p>
        <p style="color: #000000; font-size: 10px;">
          ${language === 'ar' ? 'التاريخ: ' : 'Date: '}${new Date().toLocaleDateString(
            language === 'ar' ? 'ar-DZ' : 'fr-FR'
          )}
        </p>
      </div>
    </div>
  `;
}

export function previewHTML(
  formSchema: FormSchema,
  formData: FormData,
  language: string = 'fr'
): string {
  return generateHTMLContent(formSchema, formData, language);
}

export function previewMarkdownHTML(
  template: Template,
  formData: FormData,
  language: string = 'fr'
): string {
  return generateMarkdownHTMLContent(template, formData, language);
}
