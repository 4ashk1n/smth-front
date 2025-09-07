import React, { Suspense, lazy, type ComponentType } from 'react';
import type { IconBaseProps } from 'react-icons';



// Маппинг библиотек иконок
export const iconComponents: { [key: string]: () => Promise<any> } = {
  Ai: () => import('react-icons/ai'),
  Bs: () => import('react-icons/bs'),
  Bi: () => import('react-icons/bi'),
  Ci: () => import('react-icons/ci'),
  Di: () => import('react-icons/di'),
  Fi: () => import('react-icons/fi'),
  Fc: () => import('react-icons/fc'),
  Fa: () => import('react-icons/fa6'),
  Gi: () => import('react-icons/gi'),
  Go: () => import('react-icons/go'),
  Gr: () => import('react-icons/gr'),
  Hi: () => import('react-icons/hi2'),
  Im: () => import('react-icons/im'),
  Lia: () => import('react-icons/lia'),
  Io: () => import('react-icons/io5'),
  Lu: () => import('react-icons/lu'),
  Md: () => import('react-icons/md'),
  Pi: () => import('react-icons/pi'),
  Rx: () => import('react-icons/rx'),
  Ri: () => import('react-icons/ri'),
  Si: () => import('react-icons/si'),
  Sl: () => import('react-icons/sl'),
  Tb: () => import('react-icons/tb'),
  Tfi: () => import('react-icons/tfi'),
  Ti: () => import('react-icons/ti'),
  Vsc: () => import('react-icons/vsc'),
  Wi: () => import('react-icons/wi'),
  Cg: () => import('react-icons/cg'),
};

// Тип для имен иконок (можно расширить по необходимости)
export type IconName = 
  | `Ai${string}`
  | `Bs${string}`
  | `Bi${string}`
  | `Ci${string}`
  | `Di${string}`
  | `Fi${string}`
  | `Fc${string}`
  | `Fa${string}`
  | `Gi${string}`
  | `Go${string}`
  | `Gr${string}`
  | `Hi${string}`
  | `Im${string}`
  | `Lia${string}`
  | `Io${string}`
  | `Lu${string}`
  | `Md${string}`
  | `Pi${string}`
  | `Rx${string}`
  | `Ri${string}`
  | `Si${string}`
  | `Sl${string}`
  | `Tb${string}`
  | `Tfi${string}`
  | `Ti${string}`
  | `Vsc${string}`
  | `Wi${string}`
  | `Cg${string}`;

interface ReactIconProps extends IconBaseProps {
  name: IconName;
  fallback?: React.ReactNode;
  loadingFallback?: React.ReactNode;
}


// Компонент для отображения ошибок
const ErrorFallback: React.FC<{ iconName: string }> = ({ iconName }) => (
  <div style={{ 
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ff6b6b',
    border: '1px dashed #ff6b6b',
    borderRadius: '4px',
    padding: '4px 8px',
    fontSize: '12px'
  }}>
    {iconName}
  </div>
);

const ReactIcon: React.FC<ReactIconProps> = ({ 
  name, 
  fallback = <ErrorFallback iconName={name} />,
  loadingFallback = null,
  ...props 
}) => {
  const libraryPrefix = name.substring(0, 2) as keyof typeof iconComponents;
  const importFunction = iconComponents[libraryPrefix];

  if (!importFunction) {
    console.warn(`Библиотека для префикса "${libraryPrefix}" не найдена`);
    return <>{fallback}</>;
  }

  let LazyIconComponent: ComponentType<IconBaseProps> | null = null;

  try {
    LazyIconComponent = lazy(async () => {
      const module = await importFunction();
      const icon = module[name];
      
      if (!icon) {
        console.warn(`Ошибка загрузки иконки "${name}":`, 'Иконка не найдена');
        return { default: () => <ErrorFallback iconName={name} /> };
      }
      
      return { default: icon };
    });
  } catch (error) {
    console.warn(`Ошибка загрузки иконки "${name}":`, error);
    return <>{fallback}</>;
  }

  return (
    <Suspense fallback={loadingFallback}>
      <LazyIconComponent {...props} />
    </Suspense>
  );
};

export default ReactIcon;