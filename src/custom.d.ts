declare module '*.css';
declare module '*.scss';
declare module '*.sass';

declare module "*.svg" {
    import {SVGProps} from "react";
    const content: React.FC<SVGProps<any>>;
    export default content;
}