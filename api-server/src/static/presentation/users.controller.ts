import { Controller, Get, Res, Req } from '@nestjs/common';
import { Request, Response } from 'express';
import { createReadStream } from 'graceful-fs'; //too many open file 오류 해결
import { PrismaService } from 'src/database/prisma/prisma.service';

@Controller('static/users')
export class UsersController {
  constructor(private readonly _prisma: PrismaService) {}
  @Get('*')
  async getUserImage(@Req() request: Request, @Res() response: Response) {
    console.log(request.path);
    const key = request.path.replace('/static/', '');
    const path = './uploads/' + key;
    console.log(key);
    const file = await this._prisma.file.findUnique({ where: { key } });

    const { mimetype } = file;
    response.type(mimetype);
    const stream = createReadStream(path);
    stream.pipe(response);
  }
}
