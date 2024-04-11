import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDto, AuthRegisterDto } from './auth.validators';
import { AuthGuard } from './auth.guard';
import { Auth } from './decorators/auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard)
  @Get('me')
  test(@Auth() auth) {
    return auth;
  }

  @Post('login')
  login(@Body() body: AuthLoginDto) {
    try {
      return this.authService.login(body.email, body.password);
    } catch (error) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
  }

  @Post('register')
  register(@Body() body: AuthRegisterDto) {
    return this.authService.register(body);
  }
}
