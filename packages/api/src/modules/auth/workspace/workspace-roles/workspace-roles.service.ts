import { Injectable } from '@nestjs/common';
import { WorkspaceRole } from '../../entities/workspace-role.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import {
  CreateWorkspaceRoleDTO,
  UpdateWorkspaceRoleDTO,
} from '../workspace.validator';
import { Workspace } from '../../entities/workspace.entity';
import { WorkspaceService } from '../workspace.service';

@Injectable()
export class WorkspaceRolesService {
  constructor(
    @InjectRepository(WorkspaceRole)
    private workspaceRolesRepository: Repository<WorkspaceRole>,
    @InjectRepository(Workspace)
    private workspaceRepository: Repository<Workspace>,
    private workspaceService: WorkspaceService
  ) {}


  async findAll(workspace: Workspace, auth: User): Promise<WorkspaceRole[]> {
  
    return this.workspaceRolesRepository.find({
      where: { workspace },
    });
  }

  async create(
    workspace: Workspace,
    workspaceRole: CreateWorkspaceRoleDTO,
    auth: User,
  ): Promise<WorkspaceRole> {
  
    return this.workspaceRolesRepository.save({
      ...workspaceRole,
      workspace,
    });
  }

  async findOne(
    workspace: Workspace,
    id: number,
    auth: User,
  ): Promise<WorkspaceRole | null> {
  
    return this.workspaceRolesRepository.findOne({
      where: { id, workspace },
    });
  }

  async remove(workspace: Workspace, id: number, auth: User): Promise<boolean> {
  
    const deleteResult = await this.workspaceRolesRepository.delete({
      id,
      workspace,
    });
    return deleteResult.affected > 0;
  }

  async update(
    workspace: Workspace,
    id: number,
    data: UpdateWorkspaceRoleDTO,
    auth: User,
  ): Promise<WorkspaceRole | null> {
  
    const updateResult = await this.workspaceRolesRepository.update(
      { id, workspace },
      {
        ...data,
      },
    );
    if (updateResult.affected === 0) return null;
    return this.workspaceRolesRepository.findOneBy({ id });
  }
}
