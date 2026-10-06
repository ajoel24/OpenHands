import { useQuery } from "@tanstack/react-query";
import TelegramService from "#/api/telegram-service/telegram-service.api";

export const TELEGRAM_STATUS_QUERY_KEY = ["telegram-status"];

export function useTelegramStatus(enabled = true) {
  return useQuery({
    queryKey: TELEGRAM_STATUS_QUERY_KEY,
    queryFn: () => TelegramService.getStatus(),
    enabled,
    retry: false,
    refetchInterval: 10000,
  });
}
