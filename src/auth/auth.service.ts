import { BadRequestException, Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/signup.dto';
import * as argon2 from 'argon2';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CreateTokenDto } from '../user/dto/createToken.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signUpLocal(dto: SignUpDto) {
    const hash = await this.hashData(dto.password);
    return await this.userService.createUser({
      email: dto.email,
      password: hash,
    });
  }

  getCookieWithJwtAccessToken(userId: string) {
    const token = this.jwtService.sign(
      {
        userId,
      },
      {
        secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
        expiresIn: `${this.configService.get(
          'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
        )}s`,
      },
    );

    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
    )}`;
  }

  getCookieWithJwtRefreshToken(userId: string) {
    const token = this.jwtService.sign(
      {
        userId,
      },
      {
        secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
        expiresIn: `${this.configService.get(
          'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
        )}s`,
      },
    );

    const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
    )}`;

    return {
      token,
      cookie,
    };
  }

  async getAuthenticatedUser(email: string, plainPassword: string) {
    try {
      const user = await this.userService.getUserByEmail(email);
      await this.verifyPassword(plainPassword, user.password);
      return user;
    } catch (_) {
      throw new BadRequestException('Wrong credentials provided');
    }
  }

  getCookiesForLogOut() {
    return [
      'Authentication=; HttpOnly; Path=/; Max-Age=0',
      'Refresh=; HttpOnly; Path=/; Max-Age=0',
    ];
  }

  async updateToken(dto: CreateTokenDto) {
    const hashedRt = await this.hashData(dto.rt);
    return this.userService.saveCurrentToken({
      ...dto,
      rt: hashedRt,
    });
  }

  private async verifyPassword(plain: string, hash: string) {
    const isMatch = await argon2.verify(hash, plain);

    if (!isMatch) {
      throw new BadRequestException('Wrong credentials provided');
    }
  }

  async hashData(data: string) {
    return await argon2.hash(data);
  }
}
