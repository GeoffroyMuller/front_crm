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
import { WorkspaceService } from './workspace.service';
import { Auth } from 'src/decorators/auth.decorator';
import { CreateWorkspaceDTO, UpdateWorkspaceDTO } from './workspace.validator';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('workspaces')
export class WorkspaceController {
  constructor(private workspaceService: WorkspaceService) {}

  @UseGuards(AuthGuard)
  @Get()
  async findAll(@Auth() auth) {
    return this.workspaceService.findAll(auth);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Body() { id }: { id: number }, @Auth() auth) {
    const workspace = await this.workspaceService.findOne(id, auth);
    if (!workspace) {
      throw new HttpException(
        'Workspace not found',
        HttpStatus.NOT_FOUND,
      );
    }
    return workspace;
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() data: UpdateWorkspaceDTO,
    @Auth() auth,
  ) {
    const workspace = await this.workspaceService.update(id, data, auth);
    if (!workspace) {
      throw new HttpException(
        'Workspace not found',
        HttpStatus.NOT_FOUND,
      );
    }
    return workspace;
  }

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() workspace: CreateWorkspaceDTO, @Auth() auth) {
    return this.workspaceService.create(workspace, auth);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id') id, @Auth() auth) {
    const deleted = await this.workspaceService.remove(id, auth);
    if (!deleted) {
      throw new HttpException(
        'Workspace not found',
        HttpStatus.NOT_FOUND,
      );
    }
    return;
  }
}
