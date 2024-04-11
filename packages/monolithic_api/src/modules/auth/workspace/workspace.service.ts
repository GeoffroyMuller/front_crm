import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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

  findOne(id: number, auth: User): Promise<Workspace> {
    const workspace = this.workspacesRepository.findOne({ where: { id } });
    if (!workspace) {
      throw new HttpException('Workspace not found', HttpStatus.UNPROCESSABLE_ENTITY);
    }
    return workspace;
  }

  async remove(id: number, auth: User): Promise<void> {
    const deleteResult = await this.workspacesRepository.delete({id, owner: auth});
    if (deleteResult.affected === 0) {
      throw new HttpException('Workspace not found', HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  async create(workspace: CreateWorkspaceDTO, auth: User): Promise<Workspace> {
    return this.workspacesRepository.save({ ...workspace, owner: auth });
  }

  async update(
    id: number,
    data: UpdateWorkspaceDTO,
    auth: User,
  ): Promise<Workspace> {
    const updateResult = await this.workspacesRepository.update(
      { id, owner: auth },
      data,
    );
    if (updateResult.affected > 0) {
      return await this.workspacesRepository.findOne({
        where: { id, owner: auth },
      });
    }

    throw new HttpException(
      'Workspace not found',
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }
}
