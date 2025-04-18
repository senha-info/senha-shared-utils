import { format } from "date-fns";
import fs from "node:fs";
import path from "node:path";

interface AppLogOptions {
  logPath: string;
}

interface LogFileProps {
  file: string;
  message: string;
  error?: string;
  query?: string;
}

export class AppLog {
  private options: AppLogOptions = {
    logPath: path.resolve("api_logs"),
  };

  /**
   * Constructor
   * @param {AppLogOptions} options - Options for the log file
   * @param {string} options.logPath - Path to save the log file
   *
   * @default { logPath: path.resolve("api_logs") }
   *
   * @example
   * const appLog = new AppLog({ logPath: "path/to/logs" });
   */
  constructor(options?: AppLogOptions) {
    if (options) {
      Object.assign(this.options, options);
    }
  }

  /**
   * Save log file
   * @param {LogFileProps} props
   * @param {string} props.file - File name
   * @param {string} props.message - Log message
   * @param {string} [props.error] - Error message
   * @param {string} [props.query] - Query string
   * @returns {Promise<void>}
   */
  public save({ file, message, error, query }: LogFileProps): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const date = format(new Date(), "dd/MM/yyyy HH:mm:ss");
      const currentTime = new Date().getTime();

      const logPath = this.options.logPath;

      if (!fs.existsSync(logPath)) {
        fs.mkdirSync(logPath);
      }

      const filename = path.resolve(logPath, `${currentTime}-${file}.txt`);

      let data = `Error on file ${file} - ${date}`;
      data += `\n\nMessage: ${message}`;

      if (error) {
        data += `\nError: ${error}`;
      }

      if (query) {
        data += `\n\n${query.replace(/^ {6}/gm, "").replace(/\t\t/g, "\t").trim()}`;
      }

      try {
        fs.writeFileSync(filename, data);
      } catch (error) {
        return reject(error);
      }

      return resolve();
    });
  }
}
