import { ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { existsSync, mkdirSync } from 'fs';
import * as multer from 'multer';
import { extname, join } from 'path';
import { v4 } from 'uuid';

export function createMulterModule(dir = '') {
  return MulterModule.registerAsync({
    useFactory: async (ConfigService: ConfigService) => {
      const dest = !dir
        ? ConfigService.get('UPLOADS_DEST')
        : join(ConfigService.get('UPLOADS_DEST'), dir);
      if (!existsSync(dest)) {
        mkdirSync(dest, { recursive: true });
      }
      const storage = multer.diskStorage({
        destination: (req, file, cb) => {
          cb(null, dest);
        },
        filename: (req, file, cb) => {
          const ext = extname(file.originalname);
          cb(null, `${v4()}${ext}`);
        },
      });
      return { storage };
    },
    inject: [ConfigService],
  });
}
