import { Controller, Post, Body } from '@nestjs/common';
import { SinbadService } from '../services/sinbad.service';

@Controller('bridge')
export class BridgeController {
  constructor(private readonly sinbad: SinbadService) {}

  @Post('reward')
  bridge(@Body() body: any) {
    return this.sinbad.bridgeReward(body.player, body.targetChainId);
  }
}
