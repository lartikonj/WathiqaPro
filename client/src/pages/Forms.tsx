import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Layout } from '@/components/Layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { FormModal } from '@/components/Forms/FormModal';
import { formSchemas } from '@/data/formSchemas';
import { FormSchema, FormData } from '@/types/forms';
import { 
  Search,
  Filter,
  Eye,
  Bookmark,
  Clock,
  Languages,
  FileText,
  Baby,
  Briefcase,
  Home,
  GraduationCap,
  CreditCard,
  Tickets,
  Heart,
} from 'lucide-react';

export default function Forms() {
  const { t, i18n } = useTranslation();
  const [selectedForm, setSelectedForm] = useState<FormSchema | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const isRTL = i18n.language === 'ar';

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

  const categories = [
    { id: 'all', name: 'All Forms', nameAr: 'جميع النماذج' },
    { id: 'civil', name: 'Civil Registry', nameAr: 'الحالة المدنية' },
    { id: 'employment', name: 'Employment', nameAr: 'التوظيف' },
    { id: 'residence', name: 'Residence', nameAr: 'الإقامة' },
    { id: 'education', name: 'Education', nameAr: 'التعليم' },
    { id: 'identity', name: 'Identity', nameAr: 'الهوية' },
  ];

  const filteredForms = formSchemas.filter(form => {
    const matchesSearch = searchQuery === '' || 
      form.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      form.nameAr.includes(searchQuery) ||
      form.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      form.descriptionAr.includes(searchQuery);
    
    const matchesCategory = selectedCategory === 'all' || form.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

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
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className={`text-2xl font-bold text-slate-900 dark:text-white mb-2 ${isRTL ? 'text-right' : ''}`}>
            {t('sidebar.forms')}
          </h1>
          <p className={`text-slate-600 dark:text-slate-400 ${isRTL ? 'text-right' : ''}`}>
            Browse and fill out administrative document forms
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search forms..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  dir={isRTL ? 'rtl' : 'ltr'}
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {isRTL ? category.nameAr : category.name}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Forms Grid */}
        {filteredForms.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                No forms found
              </h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredForms.map((form) => {
              const Icon = getFormIcon(form.icon);
              const colorClass = getFormColor(form.category);
              
              return (
                <Card key={form.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClass}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Bookmark className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <CardTitle className={`text-lg ${isRTL ? 'text-right' : ''}`}>
                      {isRTL ? form.nameAr : form.name}
                    </CardTitle>
                    <p className={`text-sm text-muted-foreground ${isRTL ? 'text-right' : ''}`}>
                      {isRTL ? form.descriptionAr : form.description}
                    </p>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className={`flex items-center gap-2 mb-4 ${isRTL ? 'justify-end' : ''}`}>
                      <Badge variant="secondary" className="gap-1">
                        <Clock className="h-3 w-3" />
                        {form.estimatedTime}
                      </Badge>
                      <Badge variant="outline" className="gap-1">
                        <Languages className="h-3 w-3" />
                        AR/FR
                      </Badge>
                    </div>
                    <Button 
                      className="w-full group-hover:bg-primary/90 transition-colors"
                      onClick={() => openForm(form)}
                    >
                      {t('common.view')} Form
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
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
