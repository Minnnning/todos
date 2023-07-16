import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { CreateProjectDto } from '../dto/create-project';
import { UserProfile } from 'src/type/user';
import { AddMemberDto } from '../dto/add-member';

@Injectable()
export class ProjectService {
  constructor(private _prisma: PrismaService) {}

  async viewAll() {
    const projects = await this._prisma.project.findMany();
    return projects;
  }

  async createProject(user: UserProfile, dto: CreateProjectDto) {
    const data = {
      ...dto,
      creator: {
        connect: { id: user.id },
      },
    };
    return await this._prisma.project.create({ data });
  }

  //자신의 프로젝트를 보여줌
  async viewProjects(user: UserProfile) {
    const id = user.id;
    const projs = await this._prisma.project.findMany({
      include: { members: true, creator: true },
      where: {
        OR: [
          {
            userId: id,
          },
          { members: { some: { id: id } } },
        ],
      },
    });
    if (!projs) throw new UnauthorizedException();
    return projs;
  }

  async viewProject(id: number) {
    const proj = await this._prisma.project.findUnique({ where: { id } });
    if (!proj) throw new UnauthorizedException();
    return proj;
  }

  async modifyProject(dto: CreateProjectDto, id: number) {
    const { name: projName, description: projDescrption } = dto;

    const proj = await this._prisma.project.findUnique({ where: { id } });
    if (!proj) throw new UnauthorizedException();

    await this._prisma.project.update({
      where: { id: id },
      data: { name: projName, description: projDescrption },
    });
  }

  async deleteProject(id: number) {
    const proj = await this._prisma.project.findUnique({ where: { id } });
    if (!proj) throw new UnauthorizedException();
    await this._prisma.project.delete({
      where: { id: id },
    });
  }

  async viewMember(id: number) {
    const proj = await this._prisma.project.findUnique({
      where: { id },
      include: { members: true, creator: true },
    });
    if (!proj) throw new UnauthorizedException();

    console.log(proj);
    return proj;
  }

  async addMember(id: number, dto: AddMemberDto) {
    const email = String(dto.email);
    const user = await this._prisma.user.findUnique({ where: { email } });
    const proj = await this._prisma.project.update({
      where: { id },
      data: {
        members: {
          connect: [{ id: user.id }],
        },
      },
    });
    return proj;
  }
}
