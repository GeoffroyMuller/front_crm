import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Workspace } from "./workspace.entity";
import { User } from "./user.entity";
import { WorkspaceRole } from "./workspace-role.entity";

@Entity('workspaces_users')
export class WorkspaceUser {
    @PrimaryGeneratedColumn()
    id: number;
  
    @JoinColumn()
    @ManyToOne(type => Workspace)
    workspace: Workspace;

    @JoinColumn()
    @ManyToOne(type => User)
    user: User;

    @JoinColumn()
    @ManyToOne(type => WorkspaceRole)
    role: WorkspaceRole;
}