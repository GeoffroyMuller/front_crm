import { Test, TestingModule } from '@nestjs/testing';
import { WorkspaceRolesController } from './workspace-roles.controller';

describe('WorkspaceRolesController', () => {
  let controller: WorkspaceRolesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkspaceRolesController],
    }).compile();

    controller = module.get<WorkspaceRolesController>(WorkspaceRolesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
