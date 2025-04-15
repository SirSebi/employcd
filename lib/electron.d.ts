interface SecureStorage {
  set: (key: string, value: string) => Promise<boolean>;
  get: (key: string) => Promise<string | null>;
  delete: (key: string) => Promise<boolean>;
}

interface ElectronVersions {
  node: () => string;
  chrome: () => string;
  electron: () => string;
}

interface ElectronOS {
  platform: () => NodeJS.Platform;
}

interface ElectronAPI {
  versions: ElectronVersions;
  secureStorage: SecureStorage;
  os: ElectronOS;
  send: (channel: string, data: any) => void;
  receive: (channel: string, func: (...args: any[]) => void) => void;
}

declare global {
  interface Window {
    electron: ElectronAPI;
  }
} 