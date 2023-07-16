import { Module } from '@nestjs/common';
import { ProjectService } from './application';
import { ProjectController } from './presentation';

@Module({
  providers: [ProjectService],
  controllers: [ProjectController],
})
export class ProjectModule {}
