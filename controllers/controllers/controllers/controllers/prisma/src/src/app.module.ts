import { Module } from '@nestjs/common';
import { GamesController } from './controllers/games.controller';
import { RewardsController } from './controllers/rewards.controller';
import { LeaderboardController } from './controllers/leaderboard.controller';
import { NftController } from './controllers/nft.controller';
import { BridgeController } from './controllers/bridge.controller';
import { SinbadService } from './services/sinbad.service';
import { PrismaService } from './prisma.service';

@Module({
  controllers: [
    GamesController,
    RewardsController,
    LeaderboardController,
    NftController,
    BridgeController,
  ],
  providers: [SinbadService, PrismaService],
})
export class AppModule {}
