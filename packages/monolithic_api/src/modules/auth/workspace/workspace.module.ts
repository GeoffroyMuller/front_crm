import { Module } from '@nestjs/common';
import { WorkspaceController } from './workspace.controller';
import { WorkspaceService } from './workspace.service';
import { Workspace } from 'src/modules/auth/entities/workspace.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkspaceRightsModule } from './workspace-rights/workspace-rights.module';
import { WorkspaceUsersModule } from './workspace-users/workspace-users.module';
import { WorkspaceRolesModule } from './workspace-roles/workspace-roles.module';
import { WorkspaceRole } from 'src/modules/auth/entities/workspace-role.entity';
import { WorkspaceRight } from 'src/modules/auth/entities/workspace-right.entity';
import { WorkspaceUser } from 'src/modules/auth/entities/workspace-user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Workspace,
      WorkspaceRole,
      WorkspaceRight,
      WorkspaceUser,
    ]),
    WorkspaceRightsModule,
    WorkspaceUsersModule,
    WorkspaceRolesModule,
  ],
  controllers: [WorkspaceController],
  providers: [WorkspaceService],
})
export class WorkspaceModule {}
