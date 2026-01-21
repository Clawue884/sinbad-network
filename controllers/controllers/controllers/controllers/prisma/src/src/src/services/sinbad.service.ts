import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class SinbadService {
  constructor(private prisma: PrismaService) {}

  async startSession(gameId: string, address: string) {
    const player = await this.prisma.player.upsert({
      where: { address },
      update: {},
      create: { address },
    });

    return this.prisma.gameSession.create({
      data: {
        gameId,
        playerId: player.id,
      },
    });
  }

  async submitResult(sessionId: string, score: number, hash: string) {
    const session = await this.prisma.gameSession.update({
      where: { id: sessionId },
      data: { score, hash },
    });

    await this.prisma.leaderboard.create({
      data: {
        gameId: session.gameId,
        score,
        player: session.playerId,
      },
    });

    return session;
  }

  async claimReward(sessionId: string) {
    const reward = await this.prisma.reward.create({
      data: {
        sessionId,
        amount: 250,
        txHash: '0x' + Math.random().toString(16).substring(2),
      },
    });

    return reward;
  }

  async getLeaderboard(gameId: string) {
    return this.prisma.leaderboard.findMany({
      where: { gameId },
      orderBy: { score: 'desc' },
      take: 50,
    });
  }

  async mintNFT(itemId: string, player: string) {
    return this.prisma.nFT.create({
      data: {
        itemId,
        player,
        tokenId: Math.floor(Math.random() * 1e6),
        txHash: '0x' + Math.random().toString(16).substring(2),
      },
    });
  }

  async bridgeReward(player: string, targetChainId: number) {
    return {
      player,
      targetChainId,
      status: 'bridged',
      txHash: '0x' + Math.random().toString(16).substring(2),
    };
  }
}
