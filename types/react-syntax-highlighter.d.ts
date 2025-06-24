declare module 'react-syntax-highlighter' {
  import React from 'react';
  
  export const Prism: React.ComponentType<any>;
  export const Light: React.ComponentType<any>;
}

declare module 'react-syntax-highlighter/dist/cjs/styles/prism' {
  export const atomDark: any;
  export const prism: any;
}

declare module 'react-syntax-highlighter/dist/cjs/styles/hljs' {
  export const docco: any;
  export const github: any;
  export const a11yDark: any;
} 