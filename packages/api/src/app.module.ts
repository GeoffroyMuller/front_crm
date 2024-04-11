import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './modules/auth/entities/user.entity';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './modules/auth/auth.module';
import { Workspace } from './modules/auth/entities/workspace.entity';
import { WorkspaceUser } from './modules/auth/entities/workspace-user.entity';
import { WorkspaceRight } from './modules/auth/entities/workspace-right.entity';
import { WorkspaceRole } from './modules/auth/entities/workspace-role.entity';
import { InvoicingModule } from './modules/invoicing/invoicing.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [User, Workspace, WorkspaceRole, WorkspaceRight, WorkspaceUser],
      synchronize: Boolean(process.env.SYNC_DB_ENTITIES),
    }),
    AuthModule,
    InvoicingModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
