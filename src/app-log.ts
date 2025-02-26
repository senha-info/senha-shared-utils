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

  constructor(options?: AppLogOptions) {
    if (options) {
      Object.assign(this.options, options);
    }
  }

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
