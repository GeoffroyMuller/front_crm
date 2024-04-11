import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Workspace } from "./workspace.entity";

@Entity('workspaces_rights')
export class WorkspaceRight {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    name: string;
    
    @Column()
    roleId: number;

    @JoinColumn()
    @ManyToOne(type => Workspace)
    workspace: Workspace;
}