import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { WorkspaceRole } from '../../entities/workspace-role.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { CreateWorkspaceRoleDTO } from '../workspace.validator';
import { Workspace } from '../../entities/workspace.entity';

@Injectable()
export class WorkspaceRolesService {
  constructor(
    @InjectRepository(WorkspaceRole)
    private workspaceRolesRepository: Repository<WorkspaceRole>,
    @InjectRepository(WorkspaceRole)
    private workspaceRepository: Repository<Workspace>,
  ) {}

  async findAll(workspaceId: number, auth: User): Promise<WorkspaceRole[]> {
    const workspace = await this.workspaceRepository.findOneBy({
      id: workspaceId,
    });
    return this.workspaceRolesRepository.find({
      where: { workspace },
    });
  }

  findOne(workspaceId: number, id: number, auth: User): Promise<WorkspaceRole> {
    const workspaceRole = this.workspaceRolesRepository.findOne({
      where: { id, workspace: { id: workspaceId } },
    });
    if (!workspaceRole) {
      throw new HttpException(
        'Workspace not found',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    return workspaceRole;
  }

  async remove(id: number, auth: User): Promise<void> {
    const deleteResult = await this.workspaceRolesRepository.delete({ id });
    if (deleteResult.affected === 0) {
      throw new HttpException(
        'Workspace not found',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  async create(
    workspaceId: number,
    workspaceRole: CreateWorkspaceRoleDTO,
    auth: User,
  ): Promise<WorkspaceRole> {
    const workspace = await this.workspaceRepository.findOneBy({
      id: workspaceId,
    });
    return this.workspaceRolesRepository.save({
      ...workspaceRole,
      workspace,
    });
  }
}
