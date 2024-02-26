import { HttpException, HttpStatus } from '@nestjs/common';
import { extname } from 'path';
import { randomBytes } from 'crypto';
import { Request } from 'express';

export const destination = (
  _req: Request,
  _file: Express.Multer.File,
  callback: (error: Error | null, destination: string) => void,
): void => callback(null, process.env.UPLOADS_DIR_PATH);

export const fileFilter = (
  _req: Request,
  file: {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    size: number;
    destination: string;
    filename: string;
    path: string;
    buffer: Buffer;
  },
  callback: (error: Error | null, acceptFile: boolean) => void,
): void => {
  if (file?.mimetype && !file.mimetype.match(/\/(jpg|jpeg|png|gif)$/))
    return callback(
      new HttpException(
        `Only image files are allowed!, received "${file.mimetype}".`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      ),
      false,
    );
  return callback(null, true);
};

export const filename = (
  req: any,
  file: any,
  callback: (error: Error | null, newName: string) => void,
): void =>
  callback(
    null,
    `${randomBytes(16).toString('hex')}${extname(file.originalname)}`,
  );
