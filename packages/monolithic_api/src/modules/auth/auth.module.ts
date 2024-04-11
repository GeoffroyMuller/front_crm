import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/modules/auth/entities/user.entity';
import { UsersModule } from './users/users.module';
import { WorkspaceModule } from './workspace/workspace.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), UsersModule, WorkspaceModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
