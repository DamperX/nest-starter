import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../models/user.entity';
import { Repository } from 'typeorm';
import { Role } from '../models/role.entity';
import { Session } from '../models/session.entity';

@Injectable()
export class RepoService {
  constructor(
    @InjectRepository(User) readonly userRepo: Repository<User>,
    @InjectRepository(Role) readonly roleRepo: Repository<Role>,
    @InjectRepository(Session) readonly sessionRepo: Repository<Session>,
  ) {}
}
