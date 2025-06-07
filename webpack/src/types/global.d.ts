// 扩展Window对象
interface Window {
  __MY_APP_STATE__: any;
}

// 通用别名声明
declare module '@/*' {
  const value: any;
  export default value;
}

// 声明图片等静态资源
declare module '*.png' {
  const value: string;
  export default value;
}

declare module '*.svg' {
  import React = require('react');
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}