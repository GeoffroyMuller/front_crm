import { Module } from '@nestjs/common';
import { WorkspaceRolesService } from './workspace-roles.service';
import { WorkspaceRolesController } from './workspace-roles.controller';

@Module({
  providers: [WorkspaceRolesService],
  controllers: [WorkspaceRolesController]
})
export class WorkspaceRolesModule {}
