import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Home,
  FileText,
  Bookmark,
  Download,
  Settings,
} from 'lucide-react';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const { t } = useTranslation();
  const currentPath = window.location.pathname;

  const navigation = [
    {
      name: t('sidebar.dashboard'),
      href: '/',
      icon: Home,
      current: currentPath === '/',
    },
    {
      name: t('sidebar.forms'),
      href: '/forms',
      icon: FileText,
      current: currentPath === '/forms',
    },
    {
      name: t('sidebar.saved'),
      href: '/saved',
      icon: Bookmark,
      current: currentPath === '/saved',
    },
    {
      name: t('sidebar.generated'),
      href: '/generated',
      icon: Download,
      current: currentPath === '/generated',
    },
    {
      name: t('sidebar.settings'),
      href: '/settings',
      icon: Settings,
      current: currentPath === '/settings',
    },
  ];

  return (
    <aside className={cn(
      "flex flex-col w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transition-colors duration-300",
      className
    )}>
      <div className="flex-1 flex flex-col pt-6 pb-4 overflow-y-auto">
        <nav className="mt-6 flex-1 px-4 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.name}
                variant={item.current ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 text-sm font-medium",
                  item.current && "bg-primary/10 text-primary border-r-2 border-primary",
                  !item.current && "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white"
                )}
                asChild
              >
                <a href={item.href}>
                  <Icon className="h-4 w-4 shrink-0" />
                  {item.name}
                </a>
              </Button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
