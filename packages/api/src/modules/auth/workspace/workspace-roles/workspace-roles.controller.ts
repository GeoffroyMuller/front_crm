import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CreateWorkspaceRoleDTO } from '../workspace.validator';
import { WorkspaceRolesService } from './workspace-roles.service';
import { Auth } from 'src/decorators/auth.decorator';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('workspaces/:idWorkspace/roles')
export class WorkspaceRolesController {
  constructor(private workspaceRolesService: WorkspaceRolesService) {}

  @UseGuards(AuthGuard)
  @Get()
  findAll(@Param('idWorkspace') idWorkspace: number, @Auth() auth) {
    return this.workspaceRolesService.findAll(idWorkspace, auth);
  }

  @UseGuards(AuthGuard)
  @Post()
  create(
    @Param('idWorkspace') idWorkspace: number,
    @Body() body: CreateWorkspaceRoleDTO,
    @Auth() auth,
  ) {
    return this.workspaceRolesService.create(idWorkspace, body, auth);
  }
}
