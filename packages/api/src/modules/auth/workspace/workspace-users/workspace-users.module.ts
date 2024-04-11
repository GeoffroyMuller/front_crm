import { Module } from '@nestjs/common';
import { WorkspaceUsersService } from './workspace-users.service';
import { WorkspaceUsersController } from './workspace-users.controller';

@Module({
  providers: [WorkspaceUsersService],
  controllers: [WorkspaceUsersController]
})
export class WorkspaceUsersModule {}
