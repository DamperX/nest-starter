import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto';
import { EmailExistException } from './exception/emailExist.exception';
import { RepoService } from '../repo/repo.service';
import { CreateTokenDto } from './dto/createToken.dto';
import { SessionDto } from '../auth/dto/sessionDto.dto';

@Injectable()
export class UserService {
  constructor(private repoService: RepoService) {}

  async createUser(dto: CreateUserDto) {
    try {
      const user = this.repoService.userRepo.create(dto);
      return await this.repoService.userRepo.save(user);
    } catch (_) {
      throw new EmailExistException(dto.email);
    }
  }

  async saveCurrentToken(dto: CreateTokenDto) {
    try {
      const [entity, count] = await this.repoService.sessionRepo.findAndCountBy(
        {
          userId: dto.userId,
        },
      );

      if (count === 5) {
        await this.repoService.sessionRepo.upsert(
          {
            userId: entity[0].userId,
          },
          ['id'],
        );
      } else {
        await this.repoService.sessionRepo.upsert(dto, ['id']);
      }
    } catch (e) {
      console.log(e);
    }
  }

  async clearSession(dto: SessionDto) {
    await this.repoService.sessionRepo.delete(dto);
  }

  async getUserByEmail(email: string) {
    return await this.repoService.userRepo.findOne({
      where: {
        email,
      },
    });
  }

  getUser(id: string) {
    return this.repoService.userRepo.findOne({
      where: {
        id,
      },
    });
  }
}
