import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';
import { RecoverUserDto } from './dto/recover-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SendVerifyDto } from './dto/send-verify.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUsersDto } from './dto/get-users.dto';
import { PaginatedResults } from 'src/@types/misc';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async getUsers(
    @Body() filters: GetUsersDto,
  ): Promise<PaginatedResults<User>> {
    return await this.usersService.getUsers(filters);
  }

  @Get('validate/recover/token/:token')
  async validateRecoverToken(
    @Param('token') token: string,
  ): Promise<{ isValid: boolean }> {
    return await this.usersService.validateRecoverToken(token);
  }

  @Get('verify/:token')
  async verifyUser(@Param('token') token: string): Promise<void> {
    return await this.usersService.verifyUser(token);
  }

  @Post('add')
  @UseGuards(JwtAuthGuard)
  async addUser(@Body() user: CreateUserDto): Promise<User> {
    return await this.usersService.addUser(user);
  }

  @Post('signup')
  async signup(@Body() user: CreateUserDto): Promise<void> {
    return await this.usersService.signup(user);
  }

  @Post('recover')
  async recover(@Body() user: RecoverUserDto): Promise<void> {
    return await this.usersService.recover(user);
  }

  @Post('reset/password')
  async resetPassword(@Body() user: ResetPasswordDto): Promise<void> {
    return await this.usersService.resetPassword(user);
  }

  @Post('send/verify')
  async sendVerify(@Body() user: SendVerifyDto): Promise<void> {
    return await this.usersService.sendVerify(user);
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  async updateUser(@Body() user: UpdateUserDto): Promise<User> {
    return await this.usersService.updateUser(user);
  }

  @Delete(':email')
  @UseGuards(JwtAuthGuard)
  async deleteUser(@Param('email') email: string): Promise<void> {
    return await this.usersService.deleteUser(email);
  }
}
