import { Controller, Post, Body } from '@nestjs/common';
import { SinbadService } from '../services/sinbad.service';

@Controller('rewards')
export class RewardsController {
  constructor(private readonly sinbad: SinbadService) {}

  @Post('claim')
  claim(@Body() body: any) {
    return this.sinbad.claimReward(body.sessionId);
  }
}
