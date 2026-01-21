import { Controller, Post, Body } from '@nestjs/common';
import { SinbadService } from '../services/sinbad.service';

@Controller('nft')
export class NftController {
  constructor(private readonly sinbad: SinbadService) {}

  @Post('mint')
  mint(@Body() body: any) {
    return this.sinbad.mintNFT(body.itemId, body.player);
  }
}
