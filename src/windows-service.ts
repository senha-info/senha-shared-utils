import { Service, ServiceConfig } from "node-windows";
import path from "node:path";

export class WindowsService {
  private options: ServiceConfig = {
    name: "Senha API - Service",
    description: "Senha API - Service",
    script: path.join("dist", "server.js"),
  };

  public service: Service = new Service(this.options);

  /**
   * Constructor
   * @param {ServiceConfig} config - Configuration for the Windows service
   *
   * @default { name: "Senha API - Service", script: "dist/server.js" }
   *
   * @example
   * const service = new WindowsService({ name: "My Service", script: "path/to/service" });
   */
  constructor(config?: ServiceConfig) {
    if (config) {
      Object.assign(this.options, config);
    }

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
