import { Injectable } from '@nestjs/common';

@Injectable()
export class SinbadService {
  private sessions = new Map<string, any>();
  private leaderboard: Record<string, any[]> = {};

  startSession(gameId: string, player: string) {
    const sessionId = 'sess_' + Math.random().toString(36).substring(2);
    const session = { sessionId, gameId, player, startTime: Date.now() };
    this.sessions.set(sessionId, session);
    return session;
  }

  submitResult(sessionId: string, score: number) {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error('Session not found');

    if (!this.leaderboard[session.gameId]) {
      this.leaderboard[session.gameId] = [];
    }

    this.leaderboard[session.gameId].push({
      player: session.player,
      score,
      time: Date.now(),
    });

    return { status: 'ok', score };
  }

  claimReward(sessionId: string) {
    return {
      sessionId,
      reward: 250,
      txHash: '0x' + Math.random().toString(16).substring(2),
    };
  }

  getLeaderboard(gameId: string) {
    return this.leaderboard[gameId] || [];
  }

  mintNFT(itemId: string, player: string) {
    return {
      itemId,
      player,
      tokenId: Math.floor(Math.random() * 1e6),
      txHash: '0x' + Math.random().toString(16).substring(2),
    };
  }

  bridgeReward(player: string, targetChainId: number) {
    return {
      player,
      targetChainId,
      status: 'bridged',
      txHash: '0x' + Math.random().toString(16).substring(2),
    };
  }
}
