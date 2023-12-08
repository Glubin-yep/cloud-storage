import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UserId } from 'src/decorators/user-id.decorator';

@Controller('users')
@ApiTags('users')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  getMe(@UserId() id: number) {
    return this.usersService.findById(id);
  }

  @Get('/statistic')
  @UseGuards(JwtAuthGuard)
  getStatistic(@UserId() id: number) {
    return this.usersService.getUserStatistics(id);
  }

  @Get('/storage')
  @UseGuards(JwtAuthGuard)
  getStorage(@UserId() id: number) {
    return this.usersService.getUserStorage(id);
  }

  @Get('/activity')
  @UseGuards(JwtAuthGuard)
  getActivity(@UserId() id: number) {
    return this.usersService.getActivity(id);
  }
}
