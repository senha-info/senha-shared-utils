import { MultipartFile } from "@fastify/multipart";
import { format } from "date-fns";
import { FastifyRequest } from "fastify";
import fs from "node:fs";
import path from "node:path";
import promises from "node:stream/promises";
import { Exceptions } from ".";

export class ProcessFormData {
  private async downloadFile(data: MultipartFile, uploadDir: string) {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const basename = data.filename.split(".").shift();
    const extension = path.extname(data.filename);
    const filename = `${format(new Date(), "yyyy-MM-dd")}-${basename}${extension}`;
    const uploadPath = path.join(uploadDir, filename);

    await promises.pipeline(data.file, fs.createWriteStream(uploadPath));

    return {
      filename,
    };
  }

  /**
   * Process the form data and download files to the specified directory
   *
   * @param {FastifyRequest<{ Body?: T }>} request - The Fastify request object
   * @param {string} uploadDir - The directory to save the uploaded files
   * @returns {Promise<{ body: T; files: string[] }>} - The processed form data and list of uploaded files
   */
  async execute<T>(request: FastifyRequest<{ Body?: T }>, uploadDir: string): Promise<{ body: T; files: string[] }> {
    if (!request.isMultipart()) {
      throw new Exceptions.BadRequestException({
        message: "A requisição não é multipart/form-data",
      });
    }

    const parts = request.parts();

    const body: Record<string, any> = {};
    const files: string[] = [];

    for await (const part of parts) {
      if (part.type === "field") {
        const match = part.fieldname.match(/^(.+)\[(\d+)\]$/);

        if (match) {
          const [, fieldname, index] = match;

          if (!body[fieldname]) {
            body[fieldname] = [];
          }

          body[fieldname][index] = part.value;

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
