import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Check } from "lucide-react";
import { useTelegramStatus } from "#/hooks/query/use-telegram-status";
import { useTelegramChats } from "#/hooks/query/use-telegram-chats";
import { useTelegramStart } from "#/hooks/mutation/use-telegram-start";
import { useTelegramStop } from "#/hooks/mutation/use-telegram-stop";
import { BrandButton } from "#/components/features/settings/brand-button";
import { SettingsInput } from "#/components/features/settings/settings-input";
import { LoadingSpinner } from "#/components/shared/loading-spinner";
import { Typography } from "#/ui/typography";
import { I18nKey } from "#/i18n/declaration";
import {
  settingsListContainerClassName,
  settingsListDividerClassName,
  settingsListRowClassName,
} from "#/utils/settings-list-classes";
import { extensionModuleEmptyStateClassName } from "#/utils/extension-module-card-classes";

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
      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <Typography.H2>{t(I18nKey.TELEGRAM$TITLE)}</Typography.H2>
          <p className="text-sm leading-5 text-tertiary-light">
            {t(I18nKey.TELEGRAM$DESCRIPTION)}
          </p>
        </div>

        {statusLoading ? (
          <LoadingSpinner size="small" />
        ) : (
          <div
            data-testid="telegram-status-badge"
            className={
              isRunning
                ? "flex items-start gap-2 rounded-xl border border-green-500/40 bg-green-500/10 px-4 py-3 text-sm text-green-200"
                : "flex items-start gap-2 rounded-xl border border-border bg-base-secondary px-4 py-3 text-sm text-muted"
            }
          >
            {isRunning && (
              <Check
                className="mt-0.5 size-4 shrink-0 text-green-400"
                aria-hidden
              />
            )}
            <span>
              {t(I18nKey.TELEGRAM$STATUS)}:{" "}
              {isRunning
                ? t(I18nKey.TELEGRAM$RUNNING)
                : t(I18nKey.TELEGRAM$STOPPED)}
            </span>
          </div>
        )}

        {!isRunning && (
          <div className="flex items-end gap-2">
            <SettingsInput
              testId="telegram-bot-token-input"
              label={t(I18nKey.TELEGRAM$BOT_TOKEN_LABEL)}
              type={showToken ? "text" : "password"}
              value={botToken}
              onChange={setBotToken}
              placeholder={t(I18nKey.TELEGRAM$BOT_TOKEN_PLACEHOLDER)}
              hint={t(I18nKey.TELEGRAM$BOT_TOKEN_HELP)}
            />
            <BrandButton
              type="button"
              variant="tertiary"
              onClick={() => setShowToken((v) => !v)}
            >
              {showToken ? t(I18nKey.TELEGRAM$HIDE) : t(I18nKey.TELEGRAM$SHOW)}
            </BrandButton>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {!isRunning ? (
            <BrandButton
              testId="telegram-start-button"
              type="button"
              variant="primary"
              isDisabled={isStarting}
              onClick={handleStart}
            >
              {isStarting
                ? t(I18nKey.TELEGRAM$STARTING)
                : t(I18nKey.TELEGRAM$START)}
            </BrandButton>
          ) : (
            <BrandButton
              testId="telegram-stop-button"
              type="button"
              variant="tertiary"
              isDisabled={isStopping}
              onClick={handleStop}
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
            className="flex gap-4 text-sm text-tertiary-light"
          >
            <Typography.Text>
              {t(I18nKey.TELEGRAM$ACTIVE_CHATS)}: {status.active_chats}
            </Typography.Text>
            <Typography.Text>
              {t(I18nKey.TELEGRAM$TOTAL_MESSAGES)}: {status.total_messages}
            </Typography.Text>
          </div>
        )}
      </section>

      {isRunning && (
        <section className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <Typography.H2>{t(I18nKey.TELEGRAM$CHATS_TITLE)}</Typography.H2>
          </div>
          {chatsLoading ? (
            <LoadingSpinner size="small" />
          ) : !chats || chats.length === 0 ? (
            <div className={extensionModuleEmptyStateClassName}>
              <Typography.Paragraph
                testId="telegram-no-chats"
                className="text-sm leading-5 text-tertiary-light"
              >
                {t(I18nKey.TELEGRAM$NO_CHATS)}
              </Typography.Paragraph>
            </div>
          ) : (
            <div
              data-testid="telegram-chats-list"
              className={
                settingsListContainerClassName +
                " " +
                settingsListDividerClassName
              }
            >
              {chats.map((chat) => (
                <div
                  key={chat.chat_id}
                  data-testid={`telegram-chat-${chat.chat_id}`}
                  className={settingsListRowClassName + " justify-between"}
                >
                  <div className="flex min-w-0 flex-col">
                    <Typography.Text className="truncate">
                      {chat.chat_title ||
                        chat.chat_username ||
                        `Chat ${chat.chat_id}`}
                    </Typography.Text>
                    <span className="text-xs text-tertiary-light">
                      {t(I18nKey.TELEGRAM$MESSAGES)}: {chat.message_count} •{" "}
                      {chat.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
