import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useTelegramStatus } from "#/hooks/query/use-telegram-status";
import { useTelegramChats } from "#/hooks/query/use-telegram-chats";
import { useTelegramStart } from "#/hooks/mutation/use-telegram-start";
import { useTelegramStop } from "#/hooks/mutation/use-telegram-stop";
import { BrandButton } from "#/components/features/settings/brand-button";
import { LoadingSpinner } from "#/components/shared/loading-spinner";
import { Typography } from "#/ui/typography";
import { I18nKey } from "#/i18n/declaration";
import { cn } from "#/utils/utils";

export function TelegramSettings() {
  const { t } = useTranslation("openhands");
  const [botToken, setBotToken] = useState("");
  const [showToken, setShowToken] = useState(false);

  const { data: status, isLoading: statusLoading } = useTelegramStatus();
  const { data: chats, isLoading: chatsLoading } = useTelegramChats(
    status?.status === "running",
  );

  const { mutate: startBot, isPending: isStarting } = useTelegramStart();
  const { mutate: stopBot, isPending: isStopping } = useTelegramStop();

  const isRunning = status?.status === "running";

  const handleStart = () => {
    startBot({ bot_token: botToken || undefined });
  };

  const handleStop = () => {
    stopBot();
  };

  return (
    <div className="flex flex-col gap-6" data-testid="telegram-settings">
      <div className="flex flex-col gap-2">
        <Typography.H3>{t(I18nKey.TELEGRAM$TITLE)}</Typography.H3>
        <Typography.Text className="text-secondary">
          {t(I18nKey.TELEGRAM$DESCRIPTION)}
        </Typography.Text>
      </div>

      <div className="flex flex-col gap-4 rounded-xl border border-tertiary p-4">
        <div className="flex items-center justify-between">
          <Typography.Text className="font-semibold">
            {t(I18nKey.TELEGRAM$STATUS)}
          </Typography.Text>
          {statusLoading ? (
            <LoadingSpinner size="small" />
          ) : (
            <span
              data-testid="telegram-status-badge"
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium",
                isRunning
                  ? "bg-success/15 text-success"
                  : "bg-tertiary text-secondary",
              )}
            >
              {isRunning
                ? t(I18nKey.TELEGRAM$RUNNING)
                : t(I18nKey.TELEGRAM$STOPPED)}
            </span>
          )}
        </div>

        {!isRunning && (
          <div className="flex flex-col gap-2">
            <label
              htmlFor="telegram-bot-token"
              className="text-sm font-medium text-primary"
            >
              {t(I18nKey.TELEGRAM$BOT_TOKEN_LABEL)}
            </label>
            <div className="flex gap-2">
              <input
                id="telegram-bot-token"
                data-testid="telegram-bot-token-input"
                type={showToken ? "text" : "password"}
                value={botToken}
                onChange={(e) => setBotToken(e.target.value)}
                placeholder={t(I18nKey.TELEGRAM$BOT_TOKEN_PLACEHOLDER)}
                className="flex-1 rounded-lg border border-tertiary bg-primary px-3 py-2 text-sm text-primary placeholder:text-tertiary"
              />
              <button
                type="button"
                onClick={() => setShowToken((v) => !v)}
                className="rounded-lg border border-tertiary px-3 py-2 text-sm text-secondary hover:text-primary"
              >
                {showToken
                  ? t(I18nKey.TELEGRAM$HIDE)
                  : t(I18nKey.TELEGRAM$SHOW)}
              </button>
            </div>
            <p className="text-xs text-secondary">
              {t(I18nKey.TELEGRAM$BOT_TOKEN_HELP)}
            </p>
          </div>
        )}

        <div className="flex gap-2">
          {!isRunning ? (
            <BrandButton
              testId="telegram-start-button"
              onClick={handleStart}
              isDisabled={isStarting}
              variant="primary"
              type="button"
            >
              {isStarting
                ? t(I18nKey.TELEGRAM$STARTING)
                : t(I18nKey.TELEGRAM$START)}
            </BrandButton>
          ) : (
            <BrandButton
              testId="telegram-stop-button"
              onClick={handleStop}
              isDisabled={isStopping}
              variant="secondary"
              type="button"
            >
              {isStopping
                ? t(I18nKey.TELEGRAM$STOPPING)
                : t(I18nKey.TELEGRAM$STOP)}
            </BrandButton>
          )}
        </div>

        {isRunning && status && (
          <div
            data-testid="telegram-stats"
            className="flex gap-4 text-sm text-secondary"
          >
            <span>
              {t(I18nKey.TELEGRAM$ACTIVE_CHATS)}: {status.active_chats}
            </span>
            <span>
              {t(I18nKey.TELEGRAM$TOTAL_MESSAGES)}: {status.total_messages}
            </span>
          </div>
        )}
      </div>

      {isRunning && (
        <div className="flex flex-col gap-2">
          <Typography.Text className="font-semibold">
            {t(I18nKey.TELEGRAM$CHATS_TITLE)}
          </Typography.Text>
          {chatsLoading ? (
            <LoadingSpinner size="small" />
          ) : !chats || chats.length === 0 ? (
            <p
              data-testid="telegram-no-chats"
              className="text-sm text-secondary"
            >
              {t(I18nKey.TELEGRAM$NO_CHATS)}
            </p>
          ) : (
            <div
              data-testid="telegram-chats-list"
              className="flex flex-col gap-2"
            >
              {chats.map((chat) => (
                <div
                  key={chat.chat_id}
                  data-testid={`telegram-chat-${chat.chat_id}`}
                  className="flex items-center justify-between rounded-lg border border-tertiary px-3 py-2"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-primary">
                      {chat.chat_title ||
                        chat.chat_username ||
                        `Chat ${chat.chat_id}`}
                    </span>
                    <span className="text-xs text-secondary">
                      {t(I18nKey.TELEGRAM$MESSAGES)}: {chat.message_count} •{" "}
                      {chat.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
