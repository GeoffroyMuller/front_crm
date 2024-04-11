import { Test, TestingModule } from '@nestjs/testing';
import { WorkspaceRolesService } from './workspace-roles.service';

describe('WorkspaceRolesService', () => {
  let service: WorkspaceRolesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkspaceRolesService],
    }).compile();

    service = module.get<WorkspaceRolesService>(WorkspaceRolesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
