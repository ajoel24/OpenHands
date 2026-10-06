import { render, screen, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { TelegramSettings } from "#/components/features/settings/telegram-settings/telegram-settings";

vi.mock("#/hooks/query/use-telegram-status", () => ({
  useTelegramStatus: vi.fn(),
}));

vi.mock("#/hooks/query/use-telegram-chats", () => ({
  useTelegramChats: vi.fn(),
}));

vi.mock("#/hooks/mutation/use-telegram-start", () => ({
  useTelegramStart: vi.fn(),
}));

vi.mock("#/hooks/mutation/use-telegram-stop", () => ({
  useTelegramStop: vi.fn(),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

import { useTelegramStatus } from "#/hooks/query/use-telegram-status";
import { useTelegramChats } from "#/hooks/query/use-telegram-chats";
import { useTelegramStart } from "#/hooks/mutation/use-telegram-start";
import { useTelegramStop } from "#/hooks/mutation/use-telegram-stop";

function renderWithClient(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
}

describe("TelegramSettings", () => {
  beforeEach(() => {
    vi.mocked(useTelegramStart).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    } as never);
    vi.mocked(useTelegramStop).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    } as never);
  });

  it("shows stopped badge when bot is not running", () => {
    vi.mocked(useTelegramStatus).mockReturnValue({
      data: { status: "stopped", active_chats: 0, total_messages: 0 },
      isLoading: false,
    } as never);
    vi.mocked(useTelegramChats).mockReturnValue({
      data: [],
      isLoading: false,
    } as never);

    renderWithClient(<TelegramSettings />);

    expect(screen.getByTestId("telegram-status-badge")).toBeInTheDocument();
    expect(screen.getByTestId("telegram-bot-token-input")).toBeInTheDocument();
    expect(screen.getByTestId("telegram-start-button")).toBeInTheDocument();
  });

  it("shows running badge and stats when bot is running", () => {
    vi.mocked(useTelegramStatus).mockReturnValue({
      data: { status: "running", active_chats: 2, total_messages: 10 },
      isLoading: false,
    } as never);
    vi.mocked(useTelegramChats).mockReturnValue({
      data: [],
      isLoading: false,
    } as never);

    renderWithClient(<TelegramSettings />);

    expect(screen.getByTestId("telegram-stop-button")).toBeInTheDocument();
    expect(screen.getByTestId("telegram-stats")).toBeInTheDocument();
  });

  it("calls start mutation with token on start click", () => {
    const mutate = vi.fn();
    vi.mocked(useTelegramStart).mockReturnValue({
      mutate,
      isPending: false,
    } as never);
    vi.mocked(useTelegramStatus).mockReturnValue({
      data: { status: "stopped", active_chats: 0, total_messages: 0 },
      isLoading: false,
    } as never);
    vi.mocked(useTelegramChats).mockReturnValue({
      data: [],
      isLoading: false,
    } as never);

    renderWithClient(<TelegramSettings />);

    fireEvent.change(screen.getByTestId("telegram-bot-token-input"), {
      target: { value: "test-token" },
    });
    fireEvent.click(screen.getByTestId("telegram-start-button"));

    expect(mutate).toHaveBeenCalledWith({ bot_token: "test-token" });
  });

  it("renders chat list when chats exist", () => {
    vi.mocked(useTelegramStatus).mockReturnValue({
      data: { status: "running", active_chats: 1, total_messages: 5 },
      isLoading: false,
    } as never);
    vi.mocked(useTelegramChats).mockReturnValue({
      data: [
        {
          chat_id: 123,
          chat_title: "Test Chat",
          status: "idle",
          message_count: 5,
          last_activity: new Date().toISOString(),
        },
      ],
      isLoading: false,
    } as never);

    renderWithClient(<TelegramSettings />);

    expect(screen.getByTestId("telegram-chats-list")).toBeInTheDocument();
    expect(screen.getByTestId("telegram-chat-123")).toBeInTheDocument();
  });

  it("shows empty state when no chats", () => {
    vi.mocked(useTelegramStatus).mockReturnValue({
      data: { status: "running", active_chats: 0, total_messages: 0 },
      isLoading: false,
    } as never);
    vi.mocked(useTelegramChats).mockReturnValue({
      data: [],
      isLoading: false,
    } as never);

    renderWithClient(<TelegramSettings />);

    expect(screen.getByTestId("telegram-no-chats")).toBeInTheDocument();
  });
});
