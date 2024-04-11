import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { WorkspaceRole } from '../../entities/workspace-role.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import {
  CreateWorkspaceRoleDTO,
  UpdateWorkspaceRoleDTO,
} from '../workspace.validator';
import { Workspace } from '../../entities/workspace.entity';

@Injectable()
export class WorkspaceRolesService {
  constructor(
    @InjectRepository(WorkspaceRole)
    private workspaceRolesRepository: Repository<WorkspaceRole>,
    @InjectRepository(Workspace)
    private workspaceRepository: Repository<Workspace>,
  ) {}

  private async getWorkspace(workspaceId: number, auth: User) {
    const workspace = await this.workspaceRepository.findOne({
      where: {
        id: workspaceId,
        owner: auth,
      },
    });
    if (!workspace) {
      throw new HttpException(
        'Workspace not found',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    return workspace;
  }

  async findAll(workspaceId: number, auth: User): Promise<WorkspaceRole[]> {
    const workspace = await this.getWorkspace(workspaceId, auth);
    return this.workspaceRolesRepository.find({
      where: { workspace },
    });
  }

  async create(
    workspaceId: number,
    workspaceRole: CreateWorkspaceRoleDTO,
    auth: User,
  ): Promise<WorkspaceRole> {
    const workspace = await this.getWorkspace(workspaceId, auth);
    return this.workspaceRolesRepository.save({
      ...workspaceRole,
      workspace,
    });
  }

  async findOne(
    workspaceId: number,
    id: number,
    auth: User,
  ): Promise<WorkspaceRole | null> {
    const workspace = await this.getWorkspace(workspaceId, auth);
    return this.workspaceRolesRepository.findOne({
      where: { id, workspace },
    });
  }

  async remove(workspaceId: number, id: number, auth: User): Promise<boolean> {
    const workspace = await this.getWorkspace(workspaceId, auth);
    const deleteResult = await this.workspaceRolesRepository.delete({
      id,
      workspace,
    });
    return deleteResult.affected > 0;
  }

  async update(
    workspaceId: number,
    id: number,
    data: UpdateWorkspaceRoleDTO,
    auth: User,
  ): Promise<WorkspaceRole | null> {
    const workspace = await this.getWorkspace(workspaceId, auth);
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
