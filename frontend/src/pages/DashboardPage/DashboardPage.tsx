import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  CircularProgress,
  Snackbar,
  Typography,
} from "@mui/material";

import BoltRounded from "@mui/icons-material/BoltRounded";
import CalendarMonthRounded from "@mui/icons-material/CalendarMonthRounded";
import CheckCircleRounded from "@mui/icons-material/CheckCircleRounded";
import EmojiEventsRounded from "@mui/icons-material/EmojiEventsRounded";
import LocalFireDepartmentRounded from "@mui/icons-material/LocalFireDepartmentRounded";
import MilitaryTechRounded from "@mui/icons-material/MilitaryTechRounded";
import MonetizationOnRounded from "@mui/icons-material/MonetizationOnRounded";
import PetsRounded from "@mui/icons-material/PetsRounded";
import RefreshRounded from "@mui/icons-material/RefreshRounded";

import { completeCareTask } from "../../services/careTaskService";
import { getDashboard } from "../../services/dashboardService";

import type {
  DashboardResponse,
  DashboardTaskResponse,
} from "../../types/dashboard";

import {
  AchievementBody,
  AchievementIcon,
  CompleteButton,
  ContentGrid,
  EmptyState,
  HeroCard,
  HeroContent,
  HeroDescription,
  HeroLabel,
  HeroProgressHeader,
  HeroTitle,
  PageContainer,
  ProgressDetails,
  ProgressPanel,
  SectionCard,
  SectionHeader,
  SectionTitleGroup,
  StatCard,
  StatIcon,
  StatLabel,
  StatValue,
  StatusCard,
  StatusContainer,
  SummaryGrid,
  TaskIcon,
  TaskInformation,
  TaskList,
  TaskRewards,
  TaskRow,
  TodayProgress,
  XpProgress,
} from "./DashboardPage.styles";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}

function formatAchievementDate(date: string): string {
  return new Intl.DateTimeFormat("en-NZ", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export default function DashboardPage() {
  const [dashboard, setDashboard] =
    useState<DashboardResponse | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [completingTaskId, setCompletingTaskId] =
    useState<number | null>(null);

  const [successMessage, setSuccessMessage] = useState("");
  const [actionError, setActionError] = useState("");

  const loadDashboard = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await getDashboard();
      setDashboard(response);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  const levelProgress = useMemo(() => {
    if (!dashboard || dashboard.xpRequiredForNextLevel <= 0) {
      return 0;
    }

    return Math.min(
      100,
      Math.round(
        (dashboard.currentLevelXp /
          dashboard.xpRequiredForNextLevel) *
          100,
      ),
    );
  }, [dashboard]);

  async function handleCompleteTask(
    task: DashboardTaskResponse,
  ) {
    if (task.isCompleted || completingTaskId !== null) {
      return;
    }

    setCompletingTaskId(task.taskId);
    setActionError("");

    try {
      const result = await completeCareTask(task.taskId);

      const achievementMessage = result.unlockedAchievement
        ? ` Achievement unlocked: ${result.unlockedAchievement.title}!`
        : "";

      setSuccessMessage(
        `Task complete! +${result.xpEarned} XP and +${result.coinsEarned} Coins.${achievementMessage}`,
      );

      const refreshedDashboard = await getDashboard();
      setDashboard(refreshedDashboard);
    } catch (error) {
      setActionError(getErrorMessage(error));
    } finally {
      setCompletingTaskId(null);
    }
  }

  if (isLoading) {
    return (
      <StatusContainer>
        <Box>
          <CircularProgress size={52} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Preparing your shell...
          </Typography>
        </Box>
      </StatusContainer>
    );
  }

  if (errorMessage || !dashboard) {
    return (
      <StatusContainer>
        <StatusCard>
          <Alert severity="error" sx={{ mb: 3 }}>
            {errorMessage || "Dashboard could not be loaded."}
          </Alert>

          <CompleteButton
            variant="contained"
            startIcon={<RefreshRounded />}
            onClick={() => void loadDashboard()}
          >
            Try again
          </CompleteButton>
        </StatusCard>
      </StatusContainer>
    );
  }

  return (
    <PageContainer>
      <HeroCard>
        <HeroContent>
          <HeroLabel variant="body2">
            ShellQuest Dashboard
          </HeroLabel>

          <HeroTitle variant="h3">
            Your shell, your streak.
          </HeroTitle>

          <HeroDescription variant="body1">
            Complete today&apos;s care tasks, grow your streak,
            and keep every tortoise happy and healthy.
          </HeroDescription>

          <HeroProgressHeader>
            <span>Level {dashboard.level}</span>

            <span>
              {dashboard.currentLevelXp} /{" "}
              {dashboard.xpRequiredForNextLevel} XP
            </span>
          </HeroProgressHeader>

          <XpProgress
            variant="determinate"
            value={levelProgress}
            aria-label="Level XP progress"
          />
        </HeroContent>
      </HeroCard>

      <SummaryGrid>
        <StatCard>
          <StatIcon>
            <MilitaryTechRounded />
          </StatIcon>

          <div>
            <StatValue variant="h4">
              {dashboard.level}
            </StatValue>
            <StatLabel color="text.secondary">
              Current level
            </StatLabel>
          </div>
        </StatCard>

        <StatCard>
          <StatIcon>
            <BoltRounded />
          </StatIcon>

          <div>
            <StatValue variant="h4">
              {dashboard.totalXp}
            </StatValue>
            <StatLabel color="text.secondary">
              Total XP
            </StatLabel>
          </div>
        </StatCard>

        <StatCard>
          <StatIcon>
            <MonetizationOnRounded />
          </StatIcon>

          <div>
            <StatValue variant="h4">
              {dashboard.coins}
            </StatValue>
            <StatLabel color="text.secondary">
              Shell Coins
            </StatLabel>
          </div>
        </StatCard>

        <StatCard>
          <StatIcon>
            <LocalFireDepartmentRounded />
          </StatIcon>

          <div>
            <StatValue variant="h4">
              {dashboard.currentStreak}
            </StatValue>
            <StatLabel color="text.secondary">
              Day streak
            </StatLabel>
          </div>
        </StatCard>
      </SummaryGrid>

      <ContentGrid>
        <SectionCard>
          <SectionHeader>
            <SectionTitleGroup>
              <CalendarMonthRounded color="primary" />

              <div>
                <Typography variant="h5">
                  Today&apos;s Care
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Small routines make healthy shells.
                </Typography>
              </div>
            </SectionTitleGroup>

            <Typography
              variant="h6"
              color="primary.main"
              sx={{ fontWeight: 900 }}
            >
              {dashboard.todayProgress.percentage}%
            </Typography>
          </SectionHeader>

          <ProgressPanel>
            <ProgressDetails>
              <Typography sx={{ fontWeight: 800 }}>
                Today&apos;s progress
              </Typography>

              <Typography color="text.secondary">
                {dashboard.todayProgress.completed} of{" "}
                {dashboard.todayProgress.total} completed
              </Typography>
            </ProgressDetails>

            <TodayProgress
              variant="determinate"
              value={dashboard.todayProgress.percentage}
              aria-label="Today's task progress"
            />
          </ProgressPanel>

          {dashboard.todayTasks.length === 0 ? (
            <EmptyState>
              <PetsRounded sx={{ fontSize: 48, mb: 1 }} />

              <Typography variant="h6">
                No care tasks yet
              </Typography>

              <Typography>
                Add a tortoise to begin your daily care routine.
              </Typography>
            </EmptyState>
          ) : (
            <TaskList>
              {dashboard.todayTasks.map((task) => (
                <TaskRow key={task.taskId}>
                  <TaskInformation>
                    <TaskIcon>
                      {task.isCompleted ? (
                        <CheckCircleRounded />
                      ) : (
                        <PetsRounded />
                      )}
                    </TaskIcon>

                    <div>
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 900 }}
                      >
                        {task.taskType}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        {task.tortoiseName}
                      </Typography>

                      <TaskRewards>
                        <span>+{task.xpReward} XP</span>
                        <span>•</span>
                        <span>+{task.coinReward} Coins</span>
                      </TaskRewards>
                    </div>
                  </TaskInformation>

                  <CompleteButton
                    variant={
                      task.isCompleted ? "outlined" : "contained"
                    }
                    color={task.isCompleted ? "success" : "primary"}
                    disabled={
                      task.isCompleted ||
                      completingTaskId !== null
                    }
                    startIcon={
                      task.isCompleted ? (
                        <CheckCircleRounded />
                      ) : undefined
                    }
                    onClick={() =>
                      void handleCompleteTask(task)
                    }
                  >
                    {task.isCompleted
                      ? "Completed"
                      : completingTaskId === task.taskId
                        ? "Completing..."
                        : "Complete"}
                  </CompleteButton>
                </TaskRow>
              ))}
            </TaskList>
          )}
        </SectionCard>

        <SectionCard>
          <SectionHeader>
            <SectionTitleGroup>
              <EmojiEventsRounded color="secondary" />

              <div>
                <Typography variant="h5">
                  Recent Achievement
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Your latest ShellQuest milestone.
                </Typography>
              </div>
            </SectionTitleGroup>
          </SectionHeader>

          <AchievementBody>
            {dashboard.recentAchievement ? (
              <>
                <AchievementIcon>
                  <EmojiEventsRounded />
                </AchievementIcon>

                <Typography variant="h5" sx={{ mb: 1 }}>
                  {dashboard.recentAchievement.title}
                </Typography>

                <Typography
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  {dashboard.recentAchievement.description}
                </Typography>

                <Typography
                  variant="caption"
                  sx={{ fontWeight: 800 }}
                >
                  Unlocked{" "}
                  {formatAchievementDate(
                    dashboard.recentAchievement.unlockedAt,
                  )}
                </Typography>
              </>
            ) : (
              <>
                <AchievementIcon>
                  <EmojiEventsRounded />
                </AchievementIcon>

                <Typography variant="h6" sx={{ mb: 1 }}>
                  Your next badge awaits
                </Typography>

                <Typography color="text.secondary">
                  Complete a care task to unlock your first
                  achievement.
                </Typography>
              </>
            )}
          </AchievementBody>
        </SectionCard>
      </ContentGrid>

      <Snackbar
        open={Boolean(successMessage)}
        autoHideDuration={5000}
        onClose={() => setSuccessMessage("")}
        message={successMessage}
      />

      <Snackbar
        open={Boolean(actionError)}
        autoHideDuration={5000}
        onClose={() => setActionError("")}
      >
        <Alert
          severity="error"
          onClose={() => setActionError("")}
        >
          {actionError}
        </Alert>
      </Snackbar>
    </PageContainer>
  );
}