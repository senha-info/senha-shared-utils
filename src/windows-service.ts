import { Service, ServiceConfig, User } from "node-windows";
import path from "node:path";

type WindowsServiceOptions = Partial<ServiceConfig> & {
  logOnAs?: User;
};

export class WindowsService {
  private options: WindowsServiceOptions;

  private service: Service = new Service({
    name: "Senha API - Service",
    description: "Senha API - Service",
    script: path.join("dist", "server.js"),
  });

  /**
   * Constructor
   * @param {WindowsServiceOptions} options - Options for the Windows service
   *
   * @default { name: "Senha API - Service", script: "dist/server.js" }
   *
   * @example
   * const service = new WindowsService({ name: "My Service", script: "path/to/service" });
   */
  constructor(options?: WindowsServiceOptions) {
    if (options?.logOnAs) {
      this.service.logOnAs = options.logOnAs;
      delete options.logOnAs;
    }

    if (options) {
      Object.assign(this.options, options);
    }

    this.service
      .on("install", () => {
        this.service.start();
        console.log(`\nService "${this.options.name}" installed\n`);
      })
      .on("alreadyinstalled", () => {
        console.log(`\nService "${this.options.name}" is already installed\n`);
      })
      .on("uninstall", () => {
        console.log(`\nService "${this.options.name}" uninstalled\n`);
      })
      .on("start", () => {
        console.log(`\nService started\n`);
      })
      .on("stop", () => {
        console.log(`\nService stopped\n`);
      });
  }

  public install() {
    this.service.install();
  }

  public uninstall() {
    this.service.uninstall();
  }

  public start() {
    this.service.start();
  }

  public stop() {
    this.service.stop();
  }

  public restart() {
    this.service.restart();
  }
}
