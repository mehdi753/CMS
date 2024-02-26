import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { destination, filename, fileFilter } from 'src/utils/upload';
import { Express, Response } from 'express';

@Controller('storage')
export class StorageController {
  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({ destination, filename }),
      fileFilter,
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return `${process.env.URL}/storage/${file.filename}`;
  }

  @Get(':path')
  getFile(@Param('path') image: string, @Res() res: Response): void {
    return res.sendFile(image, { root: process.env.UPLOADS_DIR_PATH });
  }
}
