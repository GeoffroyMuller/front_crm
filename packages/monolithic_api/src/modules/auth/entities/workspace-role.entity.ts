import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { WorkspaceRight } from "./workspace-right.entity";
import { WorkspaceUser } from "./workspace-user.entity";
import { Workspace } from "./workspace.entity";

@Entity('workspaces_roles')
export class WorkspaceRole {
    @PrimaryGeneratedColumn()
    id: number;

    @JoinColumn()
    @ManyToOne(type => Workspace)
    workspace: Workspace;

    @OneToMany(type => WorkspaceRight, right => right.roleId)
    rights: WorkspaceRight[];
}