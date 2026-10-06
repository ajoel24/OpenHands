import { BackNavButton } from "#/components/shared/buttons/back-nav-button";
import { TelegramSettings } from "#/components/features/settings/telegram-settings/telegram-settings";
import { useTranslation } from "react-i18next";
import { I18nKey } from "#/i18n/declaration";

export const handle = { hideTitle: true };

export function TelegramSettingsScreen() {
  const { t } = useTranslation("openhands");
  return (
    <div className="flex flex-col gap-4">
      <BackNavButton to="/settings" testId="back-to-settings">
        {t(I18nKey.BUTTON$BACK)}
      </BackNavButton>
      <TelegramSettings />
    </div>
  );
}

export default TelegramSettingsScreen;
