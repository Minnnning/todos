import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { existsSync, unlink } from 'fs';
import { promisify } from 'util';

const unlinkAsync = promisify(unlink);
const unlinkFile = async (path: string) => {
  if (existsSync(path)) {
    await unlinkAsync(path);
  }
};

@Injectable()
export class UserService {
  constructor(private readonly _prisma: PrismaService) {}

  async findUser(id: number) {
    const user = await this._prisma.user.findUnique({ where: { id } });
    console.log(user);
    return this._prisma.exclude(user, ['password']);
  }

  async findUsers() {
    const users = await this._prisma.user.findMany();
    const userList = [];
    users.map((user) => {
      userList.push(this._prisma.exclude(user, ['password']));
    });
    return userList;
  }

  async createUserImag(file: Express.Multer.File, userId: number) {
    const user = await this._prisma.user.findUnique({ where: { id: userId } });
    if (user.image) {
      await Promise.all([
        unlinkFile('/uploads/' + user.image),
        this._prisma.file.deleteMany({ where: { key: user.image } }),
      ]);
    }
    const { originalname: filename, path, mimetype, size } = file;
    const key = path.replace(/^uploads\//, '');
    await Promise.all([
      this._prisma.user.update({ where: { id: userId }, data: { image: key } }),
      this._prisma.file.create({
        data: { filename, key, mimetype, size, userId },
      }),
    ]);
  }
}
