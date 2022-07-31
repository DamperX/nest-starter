import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AtStrategy, RtStrategy, LocalStrategy } from './strategies';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [UserModule, PassportModule, ConfigModule, JwtModule.register({})],
  providers: [AuthService, LocalStrategy, AtStrategy, RtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
