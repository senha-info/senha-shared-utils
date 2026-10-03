import fs from 'node:fs/promises';
import path from 'node:path';

export interface AppLogOptions {
  /**
   * Path to save the log file
   * @default "./api_logs"
   */
  logPath?: string;
}

export interface LogFileProps {
  /**
   * File name
   */
  file: string;
  /**
   * Log message
   */
  message: string;
  /**
   * Error message
   */
  error?: string;
  /**
   * Query string
   */
  query?: string;
}

function formatDate(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  const day = pad(d.getDate());
  const month = pad(d.getMonth() + 1);
  const year = d.getFullYear();
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  const seconds = pad(d.getSeconds());
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

export class AppLog {
  private options: Required<AppLogOptions> = {
    logPath: path.resolve('api_logs'),
  };

  /**
   * Constructor
   * @param options - Options for the log file
   */
  constructor(options?: AppLogOptions) {
    if (options) {
      Object.assign(this.options, options);
    }
  }

  /**
   * Save log file asynchronously without blocking the Node.js event loop
   */
  public async save({ file, message, error, query }: LogFileProps): Promise<void> {
    const now = new Date();
    const dateFormatted = formatDate(now);
    const currentTime = now.getTime();

    const logPath = this.options.logPath;

    await fs.mkdir(logPath, { recursive: true });

    const filename = path.resolve(logPath, `${currentTime}-${file}.txt`);

    let data = `Error on file ${file} - ${dateFormatted}`;
    data += `\n\nMessage: ${message}`;

    if (error) {
      data += `\nError: ${error}`;
    }

    if (query) {
      data += `\n\n${query.replace(/^ {6}/gm, '').replace(/\t\t/g, '\t').trim()}`;
    }

    await fs.writeFile(filename, data, 'utf-8');
  }
}
