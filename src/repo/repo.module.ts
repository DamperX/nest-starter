import { Global, Module } from '@nestjs/common';
import { RepoService } from './repo.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../models/user.entity';
import { Session } from '../models/session.entity';
import { Role } from '../models/role.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([User, Session, Role])],
  providers: [RepoService],
  exports: [RepoService],
})
export class RepoModule {}
