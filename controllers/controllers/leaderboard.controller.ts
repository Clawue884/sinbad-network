import { Controller, Get, Param } from '@nestjs/common';
import { SinbadService } from '../services/sinbad.service';

@Controller('leaderboard')
export class LeaderboardController {
  constructor(private readonly sinbad: SinbadService) {}

  @Get(':gameId')
  get(@Param('gameId') gameId: string) {
    return this.sinbad.getLeaderboard(gameId);
  }
}
