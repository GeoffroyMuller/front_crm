import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { UsersService } from './users.service';
import { Auth } from 'src/decorators/auth.decorator';

@Controller('users')
export class UsersController {

    constructor(private usersService: UsersService) {}

    @UseGuards(AuthGuard)
    @Get() 
    async getUsers(@Auth() auth) {
        return this.usersService.getUsers(auth);
    }
}
