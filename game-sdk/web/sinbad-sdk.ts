// sinbad-sdk.ts
import { ethers } from "ethers";

type SinbadConfig = {
  backendUrl: string;
  chainId: number;
  contractAddresses: {
    rewardVault: string;
    nft: string;
  };
};

type SessionData = {
  sessionId: string;
  gameId: string;
  startTime: number;
};

type EventHandler = (data: any) => void;

export class SinbadSDK {
  private provider!: ethers.BrowserProvider;
  private signer!: ethers.Signer;
  private address!: string;
  private config: SinbadConfig;
  private events: Record<string, EventHandler[]> = {};

  constructor(config: SinbadConfig) {
    this.config = config;
  }

  /* =========================
     🔑 WALLET
  ========================= */

  async connectWallet() {
    if (!window.ethereum) throw new Error("Wallet not found");

    this.provider = new ethers.BrowserProvider(window.ethereum);
    await window.ethereum.request({ method: "eth_requestAccounts" });

    this.signer = await this.provider.getSigner();
    this.address = await this.signer.getAddress();

    return {
      address: this.address,
      chainId: await this.getChainId(),
    };
  }

  async getChainId() {
    const network = await this.provider.getNetwork();
    return Number(network.chainId);
  }

  async switchChain(chainId: number) {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: ethers.toBeHex(chainId) }],
    });
  }

  /* =========================
     🎮 GAME SESSION
  ========================= */

  async startSession(gameId: string): Promise<SessionData> {
    const res = await fetch(`${this.config.backendUrl}/games/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gameId, player: this.address }),
    });
    return res.json();
  }

  async submitResult(sessionId: string, score: number, gameplayHash: string) {
    const signature = await this.signGameplay(gameplayHash);

    const res = await fetch(`${this.config.backendUrl}/games/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        score,
        gameplayHash,
        signature,
        player: this.address,
      }),
    });

    return res.json();
  }

  async signGameplay(hash: string) {
    return await this.signer.signMessage(hash);
  }

  /* =========================
     💰 REWARD
  ========================= */

  async claimReward(sessionId: string) {
    const res = await fetch(`${this.config.backendUrl}/rewards/claim`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, player: this.address }),
    });

    const data = await res.json();
    this.emit("rewardClaimed", data);
    return data;
  }

  /* =========================
     🎁 NFT
  ========================= */

  async mintNFT(itemId: string) {
    const res = await fetch(`${this.config.backendUrl}/nft/mint`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId, player: this.address }),
    });

    const data = await res.json();
    this.emit("nftMinted", data);
    return data;
  }

  /* =========================
     📊 LEADERBOARD
  ========================= */

  async getLeaderboard(gameId: string) {
    const res = await fetch(`${this.config.backendUrl}/leaderboard/${gameId}`);
    return res.json();
  }

  /* =========================
     🌉 MULTI-CHAIN
  ========================= */

  async bridgeReward(targetChainId: number) {
    const res = await fetch(`${this.config.backendUrl}/bridge/reward`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ player: this.address, targetChainId }),
    });
    return res.json();
  }

  /* =========================
     📡 EVENT SYSTEM
  ========================= */

  on(event: string, handler: EventHandler) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(handler);
  }

  emit(event: string, data: any) {
    if (!this.events[event]) return;
    this.events[event].forEach(fn => fn(data));
  }
}

/* =========================
   🧪 USAGE EXAMPLE
========================= */

// const sinbad = new SinbadSDK({
//   backendUrl: "https://api.sinbad.network",
//   chainId: 1,
//   contractAddresses: {
//     rewardVault: "0xVault...",
//     nft: "0xNFT..."
//   }
// });

// await sinbad.connectWallet();
// const session = await sinbad.startSession("sinbad-racer");
// await sinbad.submitResult(session.sessionId, 9999, "0xHASH");
// await sinbad.claimReward(session.sessionId);
// sinbad.on("rewardClaimed", data => console.log("Reward:", data));
