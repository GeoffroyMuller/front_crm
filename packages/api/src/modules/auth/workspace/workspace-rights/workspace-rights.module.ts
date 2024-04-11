import { Module } from '@nestjs/common';
import { WorkspaceRightsService } from './workspace-rights.service';
import { WorkspaceRightsController } from './workspace-rights.controller';

@Module({
  providers: [WorkspaceRightsService],
  controllers: [WorkspaceRightsController]
})
export class WorkspaceRightsModule {}
