import type { Service, ServiceConfig } from 'node-windows';

interface WindowsServiceOptions extends Partial<ServiceConfig> {
  name: string;
  description: string;
  script: string;
  logOnAs?: {
    account: string;
    password: string;
  };
}

export class WindowsService {
  private options: Partial<WindowsServiceOptions> = {};
  public service!: Service;

  /**
   * Constructor
   * @param {WindowsServiceOptions} options - Options for the Windows service
   *
   * @default { name: "Senha API - Service", script: "dist/server.js" }
   *
   * @example
   * const service = new WindowsService({ name: "My Service", script: "path/to/service" });
   */
  constructor(options: WindowsServiceOptions) {
    if (process.platform !== 'win32') {
      throw new Error('WindowsService is only supported on Windows platforms.');
    }

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const nodeWindows = require('node-windows');

    this.options = options;
    this.service = new nodeWindows.Service(options);

    if (options.logOnAs) {
      this.service.logOnAs.account = options.logOnAs.account;
      this.service.logOnAs.password = options.logOnAs.password;
    }

    this.initialize();
  }

  private initialize() {
    this.service
      .on('install', () => {
        this.service.start();
        console.log(`Service "${this.options.name}" installed`);
      })
      .on('alreadyinstalled', () => {
        console.log(`Service "${this.options.name}" is already installed`);
      })
      .on('uninstall', () => {
        console.log(`Service "${this.options.name}" uninstalled`);
      })
      .on('start', () => {
        console.log('Service started');
      })
      .on('stop', () => {
        console.log('Service stopped');
      });
  }
}
