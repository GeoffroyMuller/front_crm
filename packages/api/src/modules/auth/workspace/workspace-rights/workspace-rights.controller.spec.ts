import { Test, TestingModule } from '@nestjs/testing';
import { WorkspaceRightsController } from './workspace-rights.controller';

describe('WorkspaceRightsController', () => {
  let controller: WorkspaceRightsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkspaceRightsController],
    }).compile();

    controller = module.get<WorkspaceRightsController>(WorkspaceRightsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
