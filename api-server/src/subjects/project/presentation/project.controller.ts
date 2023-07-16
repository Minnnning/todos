import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { LoginRequired } from 'src/authentication/decorators/login-require';
import { User } from 'src/authentication/decorators/user.decorator';
import { UserProfile } from 'src/type/user';
import { ProjectService } from '../application';
import { CreateProjectDto } from '../dto/create-project';
import { OwnerRequired } from 'src/authentication/decorators/owner-require';
import { OperatorRoleRequired } from 'src/authentication/decorators/role-required';
import { AddMemberDto } from '../dto/add-member';

@Controller('project')
export class ProjectController {
  constructor(private readonly _projectService: ProjectService) {}
  //전체 프로젝트 목록 가져오기 관리자 전용
  @OperatorRoleRequired
  @Get('/operatorall')
  async getAllProject() {
    return this._projectService.viewAll();
  }

  //프로젝트 생성
  @LoginRequired
  @Post()
  async creatProject(@User() user: UserProfile, @Body() dto: CreateProjectDto) {
    return this._projectService.createProject(user, dto);
  }

  //자기가 속한 프로젝트를 보여준다
  @LoginRequired
  @Get('/get')
  async viewProjects(@User() user: UserProfile) {
    return this._projectService.viewProjects(user);
  }

  //프로젝트에 포함되는 멤버만 볼 수 있는 가드
  @LoginRequired
  @Get(':id')
  async viewProject(@Param('id', ParseIntPipe) id: number) {
    return this._projectService.viewProject(id);
  }

  //프로젝트 수정 생성자 관리자만 가능
  @OwnerRequired
  @Put(':id')
  async modifyProject(
    @Body() dto: CreateProjectDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this._projectService.modifyProject(dto, id);
  }

  //삭제
  @OwnerRequired
  @Delete(':id')
  async deleteProject(@Param('id', ParseIntPipe) id: number) {
    return this._projectService.deleteProject(id);
  }

  //프로젝트 초대 관리자 or 생성자만 가능
  //프로젝트 멤버 뷰어
  @OwnerRequired
  @Get(':id/member')
  async viewMember(@Param('id', ParseIntPipe) id: number) {
    return this._projectService.viewMember(id);
  }

  //프로젝트 초대
  @OwnerRequired
  @Post(':id/member')
  async addMember(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AddMemberDto,
  ) {
    return this._projectService.addMember(id, dto);
  }
}
