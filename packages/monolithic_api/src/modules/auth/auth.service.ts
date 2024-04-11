import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as fs from 'fs';
import * as path from 'path';
import { AuthRegisterDto } from './auth.validators';

const PRIVATE_KEY = fs.readFileSync(
  path.join(__dirname, '../../../private.key'),
  'utf8',
);

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  getToken(user: User): string {
    return jwt.sign({ ...user }, PRIVATE_KEY || '', {
      algorithm: 'RS256',
      expiresIn: process.env.JWT_EXPIRATION,
    });
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    return await bcrypt.compare(password, user.password);
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ user: User; token: string }> {
    const user = await this.usersRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'lastname', 'firstname'],
    });
    if (!user) throw new Error('User not found');
    if (!(await this.validatePassword(user, password)))
      throw new Error('Invalid password');
    delete user.password;
    return { user, token: await this.getToken(user) };
  }

  async register(data: AuthRegisterDto): Promise<User> {
    try {
      const user = await this.usersRepository.save({
        ...data,
        password: await bcrypt.hash(data.password, 10),
      });
      delete user.password;
      return user;
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new HttpException(
          'Email already exist',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
      throw new Error(error);
    }
  }
}
