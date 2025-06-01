import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/Layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FormModal } from '@/components/Forms/FormModal';
import { formSchemas } from '@/data/formSchemas';
import { FormSchema, FormData } from '@/types/forms';
import { 
  FileText, 
  Clock, 
  Shield, 
  Download, 
  Star,
  ArrowRight,
  Users,
  CheckCircle,
  Globe,
  Baby,
  Briefcase,
  Home as HomeIcon,
  GraduationCap,
  CreditCard,
  Languages
} from 'lucide-react';
import { templateService, categoryService } from '@/lib/adminFirestore';
import { useQuery } from '@tanstack/react-query';

export default function Home() {
  const { t, i18n } = useTranslation();
  const { user, isGuest } = useAuth();
  const [selectedForm, setSelectedForm] = useState<FormSchema | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const isRTL = i18n.language === 'ar';

  const getFormIcon = (iconString: string) => {
    const iconMap: Record<string, any> = {
      'fas fa-baby': Baby,
      'fas fa-briefcase': Briefcase,
      'fas fa-home': HomeIcon,
      'fas fa-graduation-cap': GraduationCap,
      'fas fa-id-card': CreditCard,
    };
    return iconMap[iconString] || FileText;
  };

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.getActiveCategories,
  });

  const { data: templates = [] } = useQuery({
    queryKey: ['templates'], 
    queryFn: templateService.getActiveTemplates,
  });

  const features = [
    {
      icon: Shield,
      title: i18n.language === 'ar' ? 'آمن ومعتمد' : 'Sécurisé et Fiable',
      description: i18n.language === 'ar' ? 'منصة آمنة لإنشاء الوثائق الرسمية' : 'Plateforme sécurisée pour générer des documents officiels'
    },
    {
      icon: Download,
      title: i18n.language === 'ar' ? 'تحميل فوري' : 'Téléchargement Instantané',
      description: i18n.language === 'ar' ? 'احصل على وثائقك بصيغة PDF فوراً' : 'Obtenez vos documents en PDF instantanément'
    },
    {
      icon: Languages,
      title: i18n.language === 'ar' ? 'متعدد اللغات' : 'Multilingue',
      description: i18n.language === 'ar' ? 'متوفر باللغتين العربية والفرنسية' : 'Disponible en arabe et français'
    },
    {
      icon: Users,
      title: i18n.language === 'ar' ? 'سهل الاستخدام' : 'Facile à Utiliser',
      description: i18n.language === 'ar' ? 'واجهة بسيطة وسهلة للجميع' : 'Interface simple et intuitive pour tous'
    }
  ];

  const stats = [
    { label: i18n.language === 'ar' ? 'نماذج متاحة' : 'Formulaires Disponibles', value: formSchemas.length },
    { label: i18n.language === 'ar' ? 'مستخدمين نشطين' : 'Utilisateurs Actifs', value: '10K+' },
    { label: i18n.language === 'ar' ? 'وثائق منجزة' : 'Documents Générés', value: '50K+' },
    { label: i18n.language === 'ar' ? 'تقييم المستخدمين' : 'Satisfaction Client', value: '4.9/5' }
  ];

  const popularForms = formSchemas.slice(0, 3);

  const openForm = (form: FormSchema) => {
    setSelectedForm(form);
    setIsFormModalOpen(true);
  };

  const closeForm = () => {
    setSelectedForm(null);
    setIsFormModalOpen(false);
  };

  const handleSaveForm = (data: FormData) => {
    console.log('Saving form data:', data);
    closeForm();
  };

  return (
    <Layout showSidebar={false}>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/5 via-accent/5 to-primary/10 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className={`text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6 ${isRTL ? 'text-right' : ''}`}>
                {i18n.language === 'ar' ? 'وثيقة برو' : 'WathiqaPro'}
              </h1>
              <p className={`text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-3xl mx-auto ${isRTL ? 'text-right' : ''}`}>
                {i18n.language === 'ar' 
                  ? 'منصة شاملة لإنشاء الوثائق الإدارية الجزائرية بسهولة وأمان. احصل على شهادات الميلاد وشهادات العمل والوثائق الرسمية الأخرى في دقائق.'
                  : 'Plateforme complète pour générer facilement et en toute sécurité des documents administratifs algériens. Obtenez des actes de naissance, certificats de travail et autres documents officiels en quelques minutes.'
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {!user && !isGuest && (
                  <>
                    <Button size="lg" asChild>
                      <a href="/login">
                        {i18n.language === 'ar' ? 'ابدأ الآن' : 'Commencer'}
                        <ArrowRight className={`ml-2 h-5 w-5 ${isRTL ? 'mr-2 ml-0 rotate-180' : ''}`} />
                      </a>
                    </Button>
                    <Button variant="outline" size="lg" asChild>
                      <a href="/forms">
                        {i18n.language === 'ar' ? 'استكشف النماذج' : 'Explorer les Formulaires'}
                      </a>
                    </Button>
                  </>
                )}
                {(user || isGuest) && (
                  <Button size="lg" asChild>
                    <a href="/dashboard">
                      {i18n.language === 'ar' ? 'انتقل إلى لوحة التحكم' : 'Aller au Tableau de Bord'}
                      <ArrowRight className={`ml-2 h-5 w-5 ${isRTL ? 'mr-2 ml-0 rotate-180' : ''}`} />
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white dark:bg-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className={`text-center ${isRTL ? 'text-right' : ''}`}>
                  <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-slate-50 dark:bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className={`text-3xl font-bold text-slate-900 dark:text-white mb-4 ${isRTL ? 'text-right' : ''}`}>
                {i18n.language === 'ar' ? 'لماذا تختار وثيقة برو؟' : 'Pourquoi Choisir WathiqaPro?'}
              </h2>
              <p className={`text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto ${isRTL ? 'text-right' : ''}`}>
                {i18n.language === 'ar' 
                  ? 'نوفر لك أفضل تجربة لإنشاء الوثائق الإدارية بطريقة احترافية وآمنة'
                  : 'Nous vous offrons la meilleure expérience pour créer des documents administratifs de manière professionnelle et sécurisée'
                }
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className={`text-lg font-semibold text-slate-900 dark:text-white mb-2 ${isRTL ? 'text-right' : ''}`}>
                        {feature.title}
                      </h3>
                      <p className={`text-slate-600 dark:text-slate-400 text-sm ${isRTL ? 'text-right' : ''}`}>
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Popular Forms Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className={`text-3xl font-bold text-slate-900 dark:text-white mb-4 ${isRTL ? 'text-right' : ''}`}>
                {i18n.language === 'ar' ? 'النماذج الأكثر استخداماً' : 'Formulaires Les Plus Populaires'}
              </h2>
              <p className={`text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto ${isRTL ? 'text-right' : ''}`}>
                {i18n.language === 'ar' 
                  ? 'ابدأ بإنشاء الوثائق الأكثر طلباً'
                  : 'Commencez par créer les documents les plus demandés'
                }
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {templates && templates.map((template) => {
                const Icon = getFormIcon(template.icon);
                return (
                  <Card key={template.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <Badge variant="secondary" className="gap-1">
                          <Clock className="h-3 w-3" />
                          {template.estimatedTime}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{template.nameAr}</p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                        {template.description}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400" dir="rtl">
                        {template.descriptionAr}
                      </p>
                      <Button className="w-full group-hover:bg-primary/90 transition-colors" asChild>
                        <a to={`/forms/${template.name.toLowerCase().replace(/\s+/g, '-')}`}>
                          {i18n.language === 'ar' ? 'ابدأ الآن' : 'Commencer'}
                          <ArrowRight className={`ml-2 h-4 w-4 ${isRTL ? 'mr-2 ml-0 rotate-180' : ''}`} />
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            <div className="text-center mt-12">
              <Button variant="outline" size="lg" asChild>
                <a href="/forms">
                  {i18n.language === 'ar' ? 'عرض جميع النماذج' : 'Voir Tous les Formulaires'}
                  <ArrowRight className={`ml-2 h-4 w-4 ${isRTL ? 'mr-2 ml-0 rotate-180' : ''}`} />
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className={`text-3xl font-bold text-white mb-4 ${isRTL ? 'text-right' : ''}`}>
              {i18n.language === 'ar' ? 'جاهز لبدء إنشاء وثائقك؟' : 'Prêt à Créer Vos Documents?'}
            </h2>
            <p className={`text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto ${isRTL ? 'text-right' : ''}`}>
              {i18n.language === 'ar' 
                ? 'انضم إلى آلاف المستخدمين الذين يثقون في وثيقة برو لإنشاء وثائقهم الرسمية'
                : 'Rejoignez des milliers d\'utilisateurs qui font confiance à WathiqaPro pour créer leurs documents officiels'
              }
            </p>
            {!user && !isGuest && (
              <Button size="lg" variant="secondary" asChild>
                <a href="/login">
                  {i18n.language === 'ar' ? 'ابدأ مجاناً' : 'Commencer Gratuitement'}
                  <ArrowRight className={`ml-2 h-5 w-5 ${isRTL ? 'mr-2 ml-0 rotate-180' : ''}`} />
                </a>
              </Button>
            )}
          </div>
        </section>
      </div>

      <FormModal
        isOpen={isFormModalOpen}
        onClose={closeForm}
        formSchema={selectedForm}
        onSave={handleSaveForm}
      />
    </Layout>
  );
}