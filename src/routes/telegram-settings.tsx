import { TelegramSettings } from "#/components/features/settings/telegram-settings/telegram-settings";
import { useTranslation } from "react-i18next";
import { Typography } from "#/ui/typography";
import { I18nKey } from "#/i18n/declaration";

export const handle = { hideTitle: true };

export function TelegramSettingsScreen() {
  const { t } = useTranslation("openhands");
  return (
    <div
      data-testid="integrations-settings-screen"
      className="flex flex-col gap-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 space-y-1">
          <Typography.H2>{t(I18nKey.SETTINGS$NAV_INTEGRATIONS)}</Typography.H2>
          <p
            data-testid="settings-page-subtitle"
            className="text-sm leading-5 text-tertiary-light"
          >
            {t(I18nKey.SETTINGS$PAGE_INTEGRATIONS_SUBLINE)}
          </p>
        </div>
      </div>
      <TelegramSettings />
    </div>
  );
}

export default TelegramSettingsScreen;
