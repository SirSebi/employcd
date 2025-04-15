interface Window {
    electron: {
      secureStorage: {
        get: (key: string) => Promise<string | null>;
        set: (key: string, value: string) => void;
        delete: (key: string) => void;
      };
    };
  }