import { useState } from 'react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CategoryManager } from './CategoryManager';
import { TemplateManager } from './TemplateManager';
import { 
  LogOut, 
  Settings, 
  FileText, 
  FolderOpen, 
  BarChart3,
  Users,
  Download 
} from 'lucide-react';

export function AdminDashboard() {
  const { logout } = useAdminAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = () => {
    logout();
  };

  const stats = [
    {
      name: 'Templates Actifs',
      value: '12',
      icon: FileText,
      color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    },
    {
      name: 'Catégories',
      value: '9',
      icon: FolderOpen,
      color: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    },
    {
      name: 'Documents Générés',
      value: '1,234',
      icon: Download,
      color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    },
    {
      name: 'Utilisateurs Actifs',
      value: '456',
      icon: Users,
      color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Settings className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold text-slate-900 dark:text-white">
                WathiqaPro Admin
              </span>
            </div>
            
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="categories">Catégories</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Vue d'ensemble
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Statistiques et gestion globale de la plateforme
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                        <div className="ml-4 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 truncate">
                              {stat.name}
                            </dt>
                            <dd className="text-2xl font-semibold text-slate-900 dark:text-white">
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
            <Card>
              <CardHeader>
                <CardTitle>Actions Rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button 
                    variant="outline" 
                    className="justify-start h-auto p-4"
                    onClick={() => setActiveTab('categories')}
                  >
                    <FolderOpen className="h-5 w-5 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">Gérer les Catégories</div>
                      <div className="text-sm text-muted-foreground">Ajouter, modifier ou supprimer des catégories</div>
                    </div>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="justify-start h-auto p-4"
                    onClick={() => setActiveTab('templates')}
                  >
                    <FileText className="h-5 w-5 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">Gérer les Templates</div>
                      <div className="text-sm text-muted-foreground">Créer et modifier les formulaires</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories">
            <CategoryManager />
          </TabsContent>

          <TabsContent value="templates">
            <TemplateManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}