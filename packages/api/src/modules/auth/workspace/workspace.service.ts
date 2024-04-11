import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/auth/entities/user.entity';
import { Workspace } from 'src/modules/auth/entities/workspace.entity';
import { Repository } from 'typeorm';
import { CreateWorkspaceDTO, UpdateWorkspaceDTO } from './workspace.validator';

@Injectable()
export class WorkspaceService {
  constructor(
    @InjectRepository(Workspace)
    private workspacesRepository: Repository<Workspace>,
  ) {}

  findAll(auth: User): Promise<Workspace[]> {
    return this.workspacesRepository.find();
  }

  findOne(id: number, auth: User): Promise<Workspace | null> {
    const workspace = this.workspacesRepository.findOne({ where: { id } });
    if (!workspace) return null;
    return workspace;
  }

  async remove(id: number, auth: User): Promise<boolean> {
    const deleteResult = await this.workspacesRepository.delete({
      id,
      owner: auth,
    });
    return deleteResult.affected > 0;
  }

  async create(workspace: CreateWorkspaceDTO, auth: User): Promise<Workspace> {
    return this.workspacesRepository.save({ ...workspace, owner: auth });
  }

  async update(
    id: number,
    data: UpdateWorkspaceDTO,
    auth: User,
  ): Promise<Workspace | null> {
    const updateResult = await this.workspacesRepository.update(
      { id, owner: auth },
      data,
    );
    if (updateResult.affected > 0) {
      return await this.workspacesRepository.findOne({
        where: { id, owner: auth },
      });
    }
    return null;
  }
}
