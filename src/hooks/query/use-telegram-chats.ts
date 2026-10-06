import { useQuery } from "@tanstack/react-query";
import TelegramService from "#/api/telegram-service/telegram-service.api";

export const TELEGRAM_CHATS_QUERY_KEY = ["telegram-chats"];

export function useTelegramChats(enabled = true) {
  return useQuery({
    queryKey: TELEGRAM_CHATS_QUERY_KEY,
    queryFn: () => TelegramService.listChats(),
    enabled,
    retry: false,
    refetchInterval: 15000,
  });
}
