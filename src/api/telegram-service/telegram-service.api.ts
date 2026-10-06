import { TelegramClient } from "@openhands/typescript-client";
import type {
  TelegramChatSession,
  TelegramStartRequest,
  TelegramStatus,
} from "@openhands/typescript-client";
import { getAgentServerClientOptions } from "../agent-server-client-options";

/**
 * Telegram bot integration reads.
 *
 * All calls target the local agent-server via the typed `TelegramClient`.
 * Cloud backends are not supported: the Telegram bot runs against the
 * local agent-server's conversation service.
 */
class TelegramService {
  private static getClient(): TelegramClient {
    return new TelegramClient(getAgentServerClientOptions());
  }

  static async getStatus(): Promise<TelegramStatus> {
    const client = TelegramService.getClient();
    try {
      return await client.getStatus();
    } finally {
      client.close();
    }
  }

  static async start(request: TelegramStartRequest = {}): Promise<{
    status: string;
  }> {
    const client = TelegramService.getClient();
    try {
      return await client.start(request);
    } finally {
      client.close();
    }
  }

  static async stop(): Promise<{ status: string }> {
    const client = TelegramService.getClient();
    try {
      return await client.stop();
    } finally {
      client.close();
    }
  }

  static async listChats(): Promise<TelegramChatSession[]> {
    const client = TelegramService.getClient();
    try {
      return await client.listChats();
    } finally {
      client.close();
    }
  }
}

export default TelegramService;
