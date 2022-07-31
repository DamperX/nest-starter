import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { LocalAuthenticationGuard } from './localauth.guard';
import { JwtAuthenticationGuard } from './jwtAuth.guard';
import { UserService } from '../user/user.service';
import RequestWithUser from './requestWithUser.interface';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @HttpCode(200)
  @Post('/local/signup')
  async signUpLocal(@Body() dto: SignUpDto) {
    await this.authService.signUpLocal(dto);
  }

  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @Post('/local/signin')
  async signInLocal(@Req() req: RequestWithUser) {
    const { user, headers } = req;

    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(
      user.id,
    );
    const { cookie: refreshTokenCookie, token: refreshToken } =
      this.authService.getCookieWithJwtRefreshToken(user.id);

    await this.authService.updateToken({
      userId: user.id,
      fp: headers['user-agent'],
      rt: refreshToken,
    });

    req.res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  async authenticate(@Req() req: RequestWithUser) {
    return req.user;
  }

  @HttpCode(200)
  @UseGuards(JwtAuthenticationGuard)
  @Post('/logout')
  async logOut(@Req() req: RequestWithUser) {
    const { user, headers } = req;

    await this.userService.clearSession({
      userId: user.id,
      fp: headers['user-agent'],
    });

    req.res.setHeader('Set-Cookie', this.authService.getCookiesForLogOut());
  }

  @Get('/refresh')
  refreshTokens(@Req() req: RequestWithUser) {
    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(
      req.user.id,
    );

    req.res.setHeader('Set-Cookie', accessTokenCookie);
    return req.user;
  }
}
