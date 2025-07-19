declare module '@/components/*' {
  import type { ComponentType } from 'react';
  const component: ComponentType;
  export default component;
}

declare module '@/*' {
  const value: any;
  export default value;
}