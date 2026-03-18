import { RouteParam, RouteParamsWithQueryOverload } from 'ziggy-js';
import { AxiosInstance } from 'axios';

interface ZiggyConfig {
    url: string;
    port: number | null;
    defaults: Record<string, any>;
    routes: Record<string, {
        uri: string;
        methods: string[];
        parameters?: string[];
        bindings?: Record<string, string>;
        wheres?: Record<string, string>;
    }>;
}

export interface AppConfig {
    author: string;
    linkedin: string;
    github: string;
}

declare global {
    function route(
        name?: string,
        params?: RouteParamsWithQueryOverload | RouteParam,
        absolute?: boolean,
        config?: ZiggyConfig
    ): string;
    
    interface Window {
        Ziggy: ZiggyConfig;
        axios: AxiosInstance;
    }
}

declare module '@inertiajs/react' {
    interface PageProps {
        app: AppConfig;
    }
}

declare module '@inertiajs/core' {
    interface PageProps {
        app: AppConfig;
    }
}

declare module './ziggy.js' {
    export const Ziggy: ZiggyConfig;
}