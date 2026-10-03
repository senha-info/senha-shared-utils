import type { MultipartFile } from '@fastify/multipart';
import type { FastifyRequest } from 'fastify';
import fs from 'node:fs';
import path from 'node:path';
import promises from 'node:stream/promises';
import { BadRequestException } from './exceptions/index.js';

function formatDateYearMonthDay(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export interface ProcessFormDataResult<T> {
  body: T;
  files: string[];
}

export class ProcessFormData {
  private async downloadFile(data: MultipartFile, uploadDir: string): Promise<{ filename: string }> {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const basename = data.filename.split('.').shift() || 'file';
    const extension = path.extname(data.filename);
    const datePrefix = formatDateYearMonthDay(new Date());
    const filename = `${datePrefix}-${basename}${extension}`;
    const uploadPath = path.join(uploadDir, filename);

    await promises.pipeline(data.file, fs.createWriteStream(uploadPath));

    return {
      filename,
    };
  }

  /**
   * Process the form data and download files to the specified directory
   *
   * @param request - The Fastify request object
   * @param uploadDir - The directory to save the uploaded files
   * @returns The processed form data and list of uploaded files
   */
  async execute<T>(
    request: FastifyRequest<{ Body?: T }>,
    uploadDir: string,
  ): Promise<ProcessFormDataResult<T>> {
    if (!request.isMultipart()) {
      throw new BadRequestException({
        message: 'A requisição não é multipart/form-data',
      });
    }

    const parts = request.parts();
    const body: Record<string, unknown> = {};
    const files: string[] = [];

    for await (const part of parts) {
      if (part.type === 'field') {
        const match = part.fieldname.match(/^(.+)\[(\d+)\]$/);

        if (match) {
          const [, fieldname, index] = match;

          if (!Array.isArray(body[fieldname])) {
            body[fieldname] = [];
          }

          (body[fieldname] as unknown[])[Number(index)] = part.value;
          continue;
        }

        body[part.fieldname] = part.value;
        continue;
      }

      const { filename } = await this.downloadFile(part, uploadDir);
      files.push(filename);
    }

    return {
      body: body as T,
      files,
    };
  }
}
