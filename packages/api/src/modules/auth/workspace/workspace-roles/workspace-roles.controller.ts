import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  CreateWorkspaceRoleDTO,
  UpdateWorkspaceRoleDTO,
} from '../workspace.validator';
import { WorkspaceRolesService } from './workspace-roles.service';
import { Auth } from 'src/decorators/auth.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { WorkspaceService } from '../workspace.service';

@Controller('workspaces/:idWorkspace/roles')
export class WorkspaceRolesController {
  constructor(
    private workspaceRolesService: WorkspaceRolesService,
    private workspaceService: WorkspaceService,
  ) {}

  private async getWorkspace(idWorkspace: number, auth) {
    const workspace = await this.workspaceService.findOne(idWorkspace, auth);
    if (!workspace) {
      throw new HttpException(
        'Workspace not found',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    return workspace;
  }

  @UseGuards(AuthGuard)
  @Get()
  async findAll(@Param('idWorkspace') idWorkspace: number, @Auth() auth) {
    return this.workspaceRolesService.findAll(
      await this.getWorkspace(idWorkspace, auth),
      auth,
    );
  }

  @UseGuards(AuthGuard)
  @Post()
  async create(
    @Param('idWorkspace') idWorkspace: number,
    @Body() body: CreateWorkspaceRoleDTO,
    @Auth() auth,
  ) {
    return this.workspaceRolesService.create(
      await this.getWorkspace(idWorkspace, auth),
      body,
      auth,
    );
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findbyId(
    @Param('idWorkspace') idWorkspace: number,
    @Param('id') id: number,
    @Auth() auth,
  ) {
    const role = await this.workspaceRolesService.findOne(
      await this.getWorkspace(idWorkspace, auth),
      id,
      auth,
    );
    if (!role) {
      throw new HttpException(
        'Role not found',
        HttpStatus.NOT_FOUND,
      );
    }
    return role;
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(
    @Param('idWorkspace') idWorkspace: number,
    @Param('id') id: number,
    @Auth() auth,
  ) {
    const deleted = await this.workspaceRolesService.remove(
      await this.getWorkspace(idWorkspace, auth),
      id,
      auth,
    );
    if (!deleted) {
      throw new HttpException(
        'Role not found',
        HttpStatus.NOT_FOUND,
      );
    }
    return deleted;
  }
  @UseGuards(AuthGuard)
  @Put(':id')
  async update(
    @Param('idWorkspace') idWorkspace: number,
    @Param('id') id: number,
    @Auth() auth,
    @Body() body: UpdateWorkspaceRoleDTO,
  ) {
    const updated = await this.workspaceRolesService.update(
      await this.getWorkspace(idWorkspace, auth),
      id,
      body,
      auth,
    );
    if (!updated) {
      throw new HttpException(
        'Role not found',
        HttpStatus.NOT_FOUND,
      );
    }
    return updated;
  }
}
