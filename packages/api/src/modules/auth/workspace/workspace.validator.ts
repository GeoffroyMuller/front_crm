import { IsNotEmpty } from 'class-validator';

export class CreateWorkspaceDTO {
  @IsNotEmpty()
  name: string;
}

export class UpdateWorkspaceDTO {
  name: string;
}

export class CreateWorkspaceRoleDTO {
  @IsNotEmpty()
  name: string;
}

export class UpdateWorkspaceRoleDTO {
  name: string;
}