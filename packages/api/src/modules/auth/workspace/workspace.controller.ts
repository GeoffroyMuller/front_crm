import {
  Body,
  Controller,
  Delete,
  Get,
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
    return this.workspaceService.findOne(id, auth);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() workspace: UpdateWorkspaceDTO,
    @Auth() auth,
  ) {
    return this.workspaceService.update(id, workspace, auth);
  }

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() workspace: CreateWorkspaceDTO, @Auth() auth) {
    return this.workspaceService.create(workspace, auth);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id') id, @Auth() auth) {
    return this.workspaceService.remove(id, auth);
  }
}
