import html2pdf from 'html2pdf.js';
import { FormSchema, FormData } from '@/types/forms';
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
        <label style="font-weight: bold; display: block; margin-bottom: 5px;">${label}:</label>
        <div style="border-bottom: 1px solid #ccc; padding-bottom: 5px; min-height: 20px;">${value}</div>
      </div>
    `;
  }).join('');

  return `
    <div style="
      font-family: Arial, sans-serif;
      direction: ${isRTL ? 'rtl' : 'ltr'};
      text-align: ${isRTL ? 'right' : 'left'};
      padding: 40px;
      max-width: 800px;
      margin: 0 auto;
      line-height: 1.6;
    ">
      <div style="text-align: center; margin-bottom: 40px;">
        <h1 style="color: #2563eb; margin-bottom: 10px; font-size: 28px;">${title}</h1>
        <p style="color: #666; font-size: 14px;">
          ${language === 'ar' ? 'الجمهورية الجزائرية الديمقراطية الشعبية' : 'République Algérienne Démocratique et Populaire'}
        </p>
        <hr style="border: none; border-top: 2px solid #2563eb; width: 200px; margin: 20px auto;">
      </div>
      
      <div style="margin-bottom: 40px;">
        ${fields}
      </div>
      
      <div style="margin-top: 60px; text-align: center;">
        <p style="color: #666; font-size: 12px;">
          ${language === 'ar' ? 'تم إنشاء هذه الوثيقة إلكترونياً' : 'Document généré électroniquement'}
        </p>
        <p style="color: #666; font-size: 12px;">
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
