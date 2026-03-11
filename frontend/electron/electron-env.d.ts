/// <reference types="vite-plugin-electron/electron-env" />

declare namespace NodeJS {
  interface ProcessEnv {
    /**
     * The built directory structure
     *
     * ```tree
     * ├─┬─┬ dist
     * │ │ └── index.html
     * │ │
     * │ ├─┬ dist-electron
     * │ │ ├── main.js
     * │ │ └── preload.js
     * │
     * ```
     */
    APP_ROOT: string
    /** /dist/ or /public/ */
    VITE_PUBLIC: string
  }
}

// Used in Renderer process, expose in `preload.ts`
interface Window {
  ipcRenderer: import('electron').IpcRenderer;
  secureToken: {
    save: (token: string) => Promise<{ success: boolean; error?: any }>;
    get: () => Promise<string | null>;
    clear: () => Promise<boolean>;
  };
  app: {
    getVersion: () => Promise<string>;
    checkForUpdates: () => Promise<void>;
    onUpdateStatus: (callback: (status: any) => void) => () => void;
  };
}
