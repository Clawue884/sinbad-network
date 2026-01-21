import { Controller, Post, Body } from '@nestjs/common';
import { SinbadService } from '../services/sinbad.service';

@Controller('games')
export class GamesController {
  constructor(private readonly sinbad: SinbadService) {}

  @Post('start')
  start(@Body() body: any) {
    return this.sinbad.startSession(body.gameId, body.player);
  }

  @Post('submit')
  submit(@Body() body: any) {
    return this.sinbad.submitResult(body.sessionId, body.score);
  }
}
