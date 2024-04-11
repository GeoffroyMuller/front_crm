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

  @UseGuards(AuthGuard)
  @Get(':id')
  async findbyId(
    @Param('idWorkspace') idWorkspace: number,
    @Param('id') id: number,
    @Auth() auth,
  ) {
    const role = await this.workspaceRolesService.findOne(
      idWorkspace,
      id,
      auth,
    );
    if (!role) {
      throw new HttpException(
        'Role not found',
        HttpStatus.UNPROCESSABLE_ENTITY,
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
      idWorkspace,
      id,
      auth,
    );
    if (!deleted) {
      throw new HttpException(
        'Role not found',
        HttpStatus.UNPROCESSABLE_ENTITY,
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
      idWorkspace,
      id,
      body,
      auth,
    );
    if (!updated) {
      throw new HttpException(
        'Role not found',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    return updated;
  }
}
