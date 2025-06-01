import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      nav: {
        dashboard: 'Dashboard',
        forms: 'Forms',
        documents: 'Documents',
      },
      sidebar: {
        dashboard: 'Dashboard',
        forms: 'Available Forms',
        saved: 'Saved Forms',
        generated: 'Generated Docs',
        settings: 'Settings',
      },
      dashboard: {
        title: 'Dashboard',
        subtitle: 'Generate and manage your administrative documents',
        quickActions: 'Quick Actions',
        availableForms: 'Available Forms',
        stats: {
          availableForms: 'Available Forms',
          savedForms: 'Saved Forms',
          generatedDocs: 'Generated Docs',
          thisMonth: 'This Month',
        }
      },
      forms: {
        birthCertificate: 'Birth Certificate',
        workCertificate: 'Work Certificate',
        residenceCertificate: 'Residence Certificate',
        schoolCertificate: 'School Certificate',
        nationalId: 'National ID Card',
        passport: 'Passport Application',
        marriageCertificate: 'Marriage Certificate',
        preview: 'Preview',
        save: 'Save Form',
        generate: 'Generate Document',
        downloading: 'Generating PDF...',
        download: 'Download PDF',
      },
      auth: {
        login: 'Sign In',
        register: 'Sign Up',
        logout: 'Sign Out',
        email: 'Email',
        password: 'Password',
        confirmPassword: 'Confirm Password',
        fullName: 'Full Name',
        forgotPassword: 'Forgot Password?',
        noAccount: "Don't have an account?",
        hasAccount: 'Already have an account?',
        signInWithGoogle: 'Sign in with Google',
        guest: 'Continue as Guest',
      },
      common: {
        loading: 'Loading...',
        error: 'Error',
        success: 'Success',
        cancel: 'Cancel',
        save: 'Save',
        delete: 'Delete',
        edit: 'Edit',
        view: 'View',
        close: 'Close',
      }
    }
  },
  fr: {
    translation: {
      nav: {
        dashboard: 'Tableau de bord',
        forms: 'Formulaires',
        documents: 'Documents',
      },
      sidebar: {
        dashboard: 'Tableau de bord',
        forms: 'Formulaires disponibles',
        saved: 'Formulaires sauvegardés',
        generated: 'Documents générés',
        settings: 'Paramètres',
      },
      dashboard: {
        title: 'Tableau de bord',
        subtitle: 'Générez et gérez vos documents administratifs',
        quickActions: 'Actions rapides',
        availableForms: 'Formulaires disponibles',
        stats: {
          availableForms: 'Formulaires disponibles',
          savedForms: 'Formulaires sauvegardés',
          generatedDocs: 'Documents générés',
          thisMonth: 'Ce mois-ci',
        }
      },
      forms: {
        birthCertificate: 'Acte de naissance',
        workCertificate: 'Certificat de travail',
        residenceCertificate: 'Certificat de résidence',
        schoolCertificate: 'Certificat scolaire',
        nationalId: 'Carte d\'identité nationale',
        passport: 'Demande de passeport',
        marriageCertificate: 'Acte de mariage',
        preview: 'Aperçu',
        save: 'Sauvegarder',
        generate: 'Générer le document',
        downloading: 'Génération PDF...',
        download: 'Télécharger PDF',
      },
      auth: {
        login: 'Se connecter',
        register: 'S\'inscrire',
        logout: 'Se déconnecter',
        email: 'Email',
        password: 'Mot de passe',
        confirmPassword: 'Confirmer le mot de passe',
        fullName: 'Nom complet',
        forgotPassword: 'Mot de passe oublié?',
        noAccount: 'Pas de compte?',
        hasAccount: 'Déjà un compte?',
        signInWithGoogle: 'Se connecter avec Google',
        guest: 'Continuer en invité',
      },
      common: {
        loading: 'Chargement...',
        error: 'Erreur',
        success: 'Succès',
        cancel: 'Annuler',
        save: 'Sauvegarder',
        delete: 'Supprimer',
        edit: 'Modifier',
        view: 'Voir',
        close: 'Fermer',
      }
    }
  },
  ar: {
    translation: {
      nav: {
        dashboard: 'لوحة التحكم',
        forms: 'النماذج',
        documents: 'الوثائق',
      },
      sidebar: {
        dashboard: 'لوحة التحكم',
        forms: 'النماذج المتاحة',
        saved: 'النماذج المحفوظة',
        generated: 'الوثائق المولدة',
        settings: 'الإعدادات',
      },
      dashboard: {
        title: 'لوحة التحكم',
        subtitle: 'إنشاء وإدارة وثائقك الإدارية',
        quickActions: 'إجراءات سريعة',
        availableForms: 'النماذج المتاحة',
        stats: {
          availableForms: 'النماذج المتاحة',
          savedForms: 'النماذج المحفوظة',
          generatedDocs: 'الوثائق المولدة',
          thisMonth: 'هذا الشهر',
        }
      },
      forms: {
        birthCertificate: 'شهادة الميلاد',
        workCertificate: 'شهادة العمل',
        residenceCertificate: 'شهادة الإقامة',
        schoolCertificate: 'شهادة مدرسية',
        nationalId: 'بطاقة الهوية الوطنية',
        passport: 'طلب جواز السفر',
        marriageCertificate: 'عقد الزواج',
        preview: 'معاينة',
        save: 'حفظ النموذج',
        generate: 'إنشاء الوثيقة',
        downloading: 'إنشاء PDF...',
        download: 'تحميل PDF',
      },
      auth: {
        login: 'تسجيل الدخول',
        register: 'إنشاء حساب',
        logout: 'تسجيل الخروج',
        email: 'البريد الإلكتروني',
        password: 'كلمة المرور',
        confirmPassword: 'تأكيد كلمة المرور',
        fullName: 'الاسم الكامل',
        forgotPassword: 'نسيت كلمة المرور؟',
        noAccount: 'ليس لديك حساب؟',
        hasAccount: 'لديك حساب بالفعل؟',
        signInWithGoogle: 'تسجيل الدخول بـ Google',
        guest: 'متابعة كضيف',
      },
      common: {
        loading: 'جاري التحميل...',
        error: 'خطأ',
        success: 'نجح',
        cancel: 'إلغاء',
        save: 'حفظ',
        delete: 'حذف',
        edit: 'تعديل',
        view: 'عرض',
        close: 'إغلاق',
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'fr', // default language
    fallbackLng: 'fr',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    }
  });

export default i18n;
