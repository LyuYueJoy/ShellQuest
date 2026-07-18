import "@testing-library/jest-dom/vitest";
import {
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import DashboardPage from "../../src/pages/DashboardPage/DashboardPage";
import { completeCareTask } from "../../src/services/careTaskService";
import { getDashboard } from "../../src/services/dashboardService";

import type {
  CompleteCareTaskResponse,
  DashboardResponse,
} from "../../src/types/dashboard";

vi.mock("../../src/services/dashboardService", () => ({
  getDashboard: vi.fn(),
}));

vi.mock("../../src/services/careTaskService", () => ({
  completeCareTask: vi.fn(),
}));

const mockedGetDashboard = vi.mocked(getDashboard);
const mockedCompleteCareTask = vi.mocked(
  completeCareTask,
);

const dashboardResponse: DashboardResponse = {
  level: 2,
  totalXp: 120,
  currentLevelXp: 20,
  xpRequiredForNextLevel: 100,
  coins: 45,
  currentStreak: 3,
  longestStreak: 5,

  todayProgress: {
    completed: 0,
    total: 1,
    percentage: 0,
  },

  todayTasks: [
    {
      taskId: 10,
      taskType: "Feed",
      tortoiseId: 2,
      tortoiseName: "Sheldon",
      isCompleted: false,
      completedAt: null,
      xpReward: 10,
      coinReward: 5,
    },
  ],

  recentAchievement: {
    achievementId: 1,
    achievementType: "FIRST_TASK",
    title: "First Step",
    description:
      "Completed your first tortoise care task.",
    unlockedAt: "2026-07-18T00:00:00Z",
  },
};

const completedDashboardResponse: DashboardResponse = {
  ...dashboardResponse,

  totalXp: 130,
  currentLevelXp: 30,
  coins: 50,

  todayProgress: {
    completed: 1,
    total: 1,
    percentage: 100,
  },

  todayTasks: [
    {
      ...dashboardResponse.todayTasks[0],
      isCompleted: true,
      completedAt: "2026-07-18T01:00:00Z",
    },
  ],
};

const completionResponse: CompleteCareTaskResponse = {
  taskId: 10,
  isCompleted: true,
  completedAt: "2026-07-18T01:00:00Z",
  xpEarned: 10,
  coinsEarned: 5,
  totalXp: 130,
  coins: 50,
  level: 2,
  currentStreak: 3,
  unlockedAchievement: null,
};

describe("DashboardPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("displays loading state while dashboard is loading", () => {
    mockedGetDashboard.mockReturnValue(
      new Promise(() => undefined),
    );

    render(<DashboardPage />);

    expect(
      screen.getByText("Preparing your shell..."),
    ).toBeInTheDocument();
  });

  it("displays dashboard statistics and tasks", async () => {
    mockedGetDashboard.mockResolvedValue(
      dashboardResponse,
    );

    render(<DashboardPage />);

    expect(
      await screen.findByRole("heading", {
        name: "Your shell, your streak.",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText("120"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("45"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("3"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Feed"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Sheldon"),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Complete",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: "First Step",
      }),
    ).toBeInTheDocument();
  });

  it("displays an error when loading fails", async () => {
    mockedGetDashboard.mockRejectedValue(
      new Error("Unable to load dashboard."),
    );

    render(<DashboardPage />);

    expect(
      await screen.findByText(
        "Unable to load dashboard.",
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /try again/i,
      }),
    ).toBeInTheDocument();
  });

  it("loads dashboard again when retry is clicked", async () => {
    mockedGetDashboard
      .mockRejectedValueOnce(
        new Error("Unable to load dashboard."),
      )
      .mockResolvedValueOnce(dashboardResponse);

    const user = userEvent.setup();

    render(<DashboardPage />);

    expect(
      await screen.findByText(
        "Unable to load dashboard.",
      ),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", {
        name: /try again/i,
      }),
    );

    expect(
      await screen.findByRole("heading", {
        name: "Your shell, your streak.",
      }),
    ).toBeInTheDocument();

    expect(mockedGetDashboard).toHaveBeenCalledTimes(2);
  });

  it("displays empty task state when user has no tasks", async () => {
    mockedGetDashboard.mockResolvedValue({
      ...dashboardResponse,

      todayProgress: {
        completed: 0,
        total: 0,
        percentage: 0,
      },

      todayTasks: [],

      recentAchievement: null,
    });

    render(<DashboardPage />);

    expect(
      await screen.findByRole("heading", {
        name: "No care tasks yet",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Add a tortoise to begin your daily care routine.",
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: "Your next badge awaits",
      }),
    ).toBeInTheDocument();
  });

  it("completes a task and refreshes dashboard", async () => {
    mockedGetDashboard
      .mockResolvedValueOnce(dashboardResponse)
      .mockResolvedValueOnce(
        completedDashboardResponse,
      );

    mockedCompleteCareTask.mockResolvedValue(
      completionResponse,
    );

    const user = userEvent.setup();

    render(<DashboardPage />);

    await screen.findByText("Sheldon");

    await user.click(
      screen.getByRole("button", {
        name: "Complete",
      }),
    );

    await waitFor(() => {
      expect(
        mockedCompleteCareTask,
      ).toHaveBeenCalledWith(10);
    });

    expect(mockedGetDashboard).toHaveBeenCalledTimes(2);

    expect(
      await screen.findByRole("button", {
        name: "Completed",
      }),
    ).toBeDisabled();

    expect(
      screen.getByText(
        "Task complete! +10 XP and +5 Coins.",
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByText("100%"),
    ).toBeInTheDocument();
  });

  it("shows error when completing a task fails", async () => {
    mockedGetDashboard.mockResolvedValue(
      dashboardResponse,
    );

    mockedCompleteCareTask.mockRejectedValue(
      new Error("Unable to complete this task."),
    );

    const user = userEvent.setup();

    render(<DashboardPage />);

    await screen.findByText("Sheldon");

    await user.click(
      screen.getByRole("button", {
        name: "Complete",
      }),
    );

    expect(
      await screen.findByText(
        "Unable to complete this task.",
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Complete",
      }),
    ).toBeEnabled();

    expect(mockedGetDashboard).toHaveBeenCalledTimes(1);
  });
});