import { useMutation, useQueryClient } from "@tanstack/react-query";
import TelegramService from "#/api/telegram-service/telegram-service.api";
import type { TelegramStartRequest } from "@openhands/typescript-client";
import { TELEGRAM_CHATS_QUERY_KEY } from "#/hooks/query/use-telegram-chats";
import { TELEGRAM_STATUS_QUERY_KEY } from "#/hooks/query/use-telegram-status";

export const useTelegramStart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: TelegramStartRequest) =>
      TelegramService.start(request),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: TELEGRAM_STATUS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: TELEGRAM_CHATS_QUERY_KEY });
    },
  });
};
