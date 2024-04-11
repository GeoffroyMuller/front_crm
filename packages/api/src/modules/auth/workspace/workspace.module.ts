import { Module } from '@nestjs/common';
import { WorkspaceController } from './workspace.controller';
import { WorkspaceService } from './workspace.service';
import { Workspace } from 'src/modules/auth/entities/workspace.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkspaceRole } from 'src/modules/auth/entities/workspace-role.entity';
import { WorkspaceRight } from 'src/modules/auth/entities/workspace-right.entity';
import { WorkspaceUser } from 'src/modules/auth/entities/workspace-user.entity';
import { WorkspaceRolesController } from './workspace-roles/workspace-roles.controller';
import { WorkspaceRightsController } from './workspace-rights/workspace-rights.controller';
import { WorkspaceUsersController } from './workspace-users/workspace-users.controller';
import { WorkspaceRightsService } from './workspace-rights/workspace-rights.service';
import { WorkspaceRolesService } from './workspace-roles/workspace-roles.service';
import { WorkspaceUsersService } from './workspace-users/workspace-users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Workspace,
      WorkspaceRole,
      WorkspaceRight,
      WorkspaceUser,
    ]),
  ],
  controllers: [
    WorkspaceController,
    WorkspaceRolesController,
    WorkspaceRightsController,
    WorkspaceUsersController,
  ],
  providers: [
    WorkspaceService,
    WorkspaceRolesService,
    WorkspaceRightsService,
    WorkspaceUsersService,
  ],
})
export class WorkspaceModule {}
