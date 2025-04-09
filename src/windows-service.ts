import { Service, ServiceConfig } from "node-windows";

interface WindowsServiceOptions extends Partial<ServiceConfig> {
  name: string;
  description: string;
  script: string;
}

export class WindowsService {
  private options: ServiceConfig;
  public service: Service;

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
    Object.assign(this.options, options);

    this.service
      .on("install", () => {
        this.service.start();
        console.log(`Service "${this.options.name}" installed`);
      })
      .on("alreadyinstalled", () => {
        console.log(`Service "${this.options.name}" is already installed`);
      })
      .on("uninstall", () => {
        console.log(`Service "${this.options.name}" uninstalled`);
      })
      .on("start", () => {
        console.log("Service started");
      })
      .on("stop", () => {
        console.log("Service stopped");
      });
  }
}
