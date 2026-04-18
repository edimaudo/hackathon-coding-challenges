declare module "*.svg?react" {
2  import React = require("react");
3  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
4  const src: string;
5  export default src;
6}