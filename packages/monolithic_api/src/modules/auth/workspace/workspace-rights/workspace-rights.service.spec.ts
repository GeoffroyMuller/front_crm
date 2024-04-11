import { Test, TestingModule } from '@nestjs/testing';
import { WorkspaceRightsService } from './workspace-rights.service';

describe('WorkspaceRightsService', () => {
  let service: WorkspaceRightsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkspaceRightsService],
    }).compile();

    service = module.get<WorkspaceRightsService>(WorkspaceRightsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
