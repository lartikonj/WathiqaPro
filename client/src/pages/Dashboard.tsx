import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Layout } from '@/components/Layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FormModal } from '@/components/Forms/FormModal';
import { formSchemas } from '@/data/formSchemas';
import { FormSchema, FormData } from '@/types/forms';
import { 
  FileText, 
  Bookmark, 
  Download, 
  Clock, 
  Eye, 
  ChevronRight,
  ArrowRight,
  Baby,
  Briefcase,
  Home,
  GraduationCap,
  CreditCard,
  Tickets,
  Heart,
  Languages
} from 'lucide-react';

export default function Dashboard() {
  const { t, i18n } = useTranslation();
  const [selectedForm, setSelectedForm] = useState<FormSchema | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const isRTL = i18n.language === 'ar';

  // Mock stats data
  const stats = [
    {
      name: t('dashboard.stats.availableForms'),
      value: formSchemas.length,
      icon: FileText,
      color: 'bg-primary/10 text-primary',
    },
    {
      name: t('dashboard.stats.savedForms'),
      value: 3,
      icon: Bookmark,
      color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
    },
    {
      name: t('dashboard.stats.generatedDocs'),
      value: 8,
      icon: Download,
      color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
    },
    {
      name: t('dashboard.stats.thisMonth'),
      value: 24,
      icon: Clock,
      color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    },
  ];

  const getFormIcon = (iconString: string) => {
    const iconMap: Record<string, any> = {
      'fas fa-baby': Baby,
      'fas fa-briefcase': Briefcase,
      'fas fa-home': Home,
      'fas fa-graduation-cap': GraduationCap,
      'fas fa-id-card': CreditCard,
      'fas fa-passport': Tickets,
      'fas fa-heart': Heart,
    };
    return iconMap[iconString] || FileText;
  };

  const getFormColor = (category: string) => {
    const colorMap: Record<string, string> = {
      civil: 'bg-primary/10 text-primary',
      employment: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
      residence: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
      education: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
      identity: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
    };
    return colorMap[category] || 'bg-primary/10 text-primary';
  };

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
    // Here you would save to backend
    closeForm();
  };

  const quickActionForms = formSchemas.slice(0, 3);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className={`text-2xl font-bold text-slate-900 dark:text-white mb-2 ${isRTL ? 'text-right' : ''}`}>
            {t('dashboard.title')}
          </h1>
          <p className={`text-slate-600 dark:text-slate-400 ${isRTL ? 'text-right' : ''}`}>
            {t('dashboard.subtitle')}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.name}>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>
                    <div className={`ml-4 w-0 flex-1 ${isRTL ? 'mr-4 ml-0' : ''}`}>
                      <dl>
                        <dt className={`text-sm font-medium text-slate-500 dark:text-slate-400 truncate ${isRTL ? 'text-right' : ''}`}>
                          {stat.name}
                        </dt>
                        <dd className={`text-2xl font-semibold text-slate-900 dark:text-white ${isRTL ? 'text-right' : ''}`}>
                          {stat.value}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader className="border-b border-slate-200 dark:border-slate-700">
            <CardTitle className={isRTL ? 'text-right' : ''}>
              {t('dashboard.quickActions')}
            </CardTitle>
            <p className={`text-sm text-slate-500 dark:text-slate-400 mt-1 ${isRTL ? 'text-right' : ''}`}>
              Start generating documents with these popular forms
            </p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quickActionForms.map((form) => {
                const Icon = getFormIcon(form.icon);
                const colorClass = getFormColor(form.category);
                
                return (
                  <Button
                    key={form.id}
                    variant="ghost"
                    className={`group relative h-auto p-6 text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 ${
                      isRTL ? 'text-right' : ''
                    }`}
                    onClick={() => openForm(form)}
                  >
                    <div className="flex items-center mb-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${isRTL ? 'ml-3 mr-0' : ''} ${colorClass}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                        {isRTL ? form.nameAr : form.name}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {isRTL ? form.descriptionAr : form.description}
                    </p>
                    <div className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} opacity-0 group-hover:opacity-100 transition-opacity`}>
                      <ArrowRight className="h-4 w-4 text-primary" />
                    </div>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Available Forms */}
        <Card>
          <CardHeader className="border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className={isRTL ? 'text-right' : ''}>
                  {t('dashboard.availableForms')}
                </CardTitle>
                <p className={`text-sm text-slate-500 dark:text-slate-400 mt-1 ${isRTL ? 'text-right' : ''}`}>
                  All administrative document forms you can generate
                </p>
              </div>
              <Button>
                View All
                <ArrowRight className={`ml-2 h-4 w-4 ${isRTL ? 'mr-2 ml-0 rotate-180' : ''}`} />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
              {formSchemas.map((form) => {
                const Icon = getFormIcon(form.icon);
                const colorClass = getFormColor(form.category);
                
                return (
                  <div
                    key={form.id}
                    className="p-6 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
                    onClick={() => openForm(form)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClass}`}>
                            <Icon className="h-5 w-5" />
                          </div>
                        </div>
                        <div className={`ml-4 ${isRTL ? 'mr-4 ml-0' : ''}`}>
                          <h3 className={`text-sm font-medium text-slate-900 dark:text-white ${isRTL ? 'text-right' : ''}`}>
                            {isRTL ? form.nameAr : form.name}
                          </h3>
                          <p className={`text-sm text-slate-500 dark:text-slate-400 ${isRTL ? 'text-right' : ''}`}>
                            {isRTL ? form.descriptionAr : form.description}
                          </p>
                          <div className={`flex items-center mt-2 space-x-4 ${isRTL ? 'space-x-reverse' : ''}`}>
                            <Badge variant="secondary" className="gap-1">
                              <Clock className="h-3 w-3" />
                              {form.estimatedTime}
                            </Badge>
                            <Badge variant="outline" className="gap-1">
                              <Languages className="h-3 w-3" />
                              AR/FR
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className={`flex items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Bookmark className="h-4 w-4" />
                        </Button>
                        <ChevronRight className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
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
