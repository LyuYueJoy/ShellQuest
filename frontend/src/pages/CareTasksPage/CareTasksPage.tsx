import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";

import BathRounded from "@mui/icons-material/BathtubRounded";
import BoltRounded from "@mui/icons-material/BoltRounded";
import CheckCircleRounded from "@mui/icons-material/CheckCircleRounded";
import CleaningServicesRounded from "@mui/icons-material/CleaningServicesRounded";
import DeviceThermostatRounded from "@mui/icons-material/DeviceThermostatRounded";
import PetsRounded from "@mui/icons-material/PetsRounded";
import RefreshRounded from "@mui/icons-material/RefreshRounded";
import RestaurantRounded from "@mui/icons-material/RestaurantRounded";
import TaskAltRounded from "@mui/icons-material/TaskAltRounded";
import WbSunnyRounded from "@mui/icons-material/WbSunnyRounded";

import { completeCareTask } from "../../services/careTaskService";
import { getDashboard } from "../../services/dashboardService";

import type {
  DashboardResponse,
  DashboardTaskResponse,
} from "../../types/dashboard";

import {
  CompleteButton,
  EmptyState,
  FilterCard,
  FilterGroup,
  HeaderCard,
  HeaderContent,
  PageContainer,
  ProgressBar,
  RewardBadge,
  RewardRow,
  StatusCard,
  StatusContainer,
  SummaryCard,
  SummaryGrid,
  SummaryHeader,
  TaskCard,
  TaskCardHeader,
  TaskGrid,
  TaskIcon,
} from "./CareTasksPage.styles";

type TaskFilter = "all" | "pending" | "completed";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}

function getTaskIcon(taskType: string) {
  switch (taskType.toLowerCase()) {
    case "feed":
      return <RestaurantRounded />;

    case "bath":
      return <BathRounded />;

    case "clean":
      return <CleaningServicesRounded />;

    case "uvb":
      return <WbSunnyRounded />;

    case "temperature":
      return <DeviceThermostatRounded />;

    default:
      return <PetsRounded />;
  }
}

export default function CareTasksPage() {
  const [dashboard, setDashboard] =
    useState<DashboardResponse | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [actionError, setActionError] = useState("");

  const [taskFilter, setTaskFilter] =
    useState<TaskFilter>("all");

  const [tortoiseFilter, setTortoiseFilter] =
    useState("all");

  const [completingTaskId, setCompletingTaskId] =
    useState<number | null>(null);

  const loadTasks = useCallback(async () => {
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
    void loadTasks();
  }, [loadTasks]);

  const tortoises = useMemo(() => {
    if (!dashboard) {
      return [];
    }

    return Array.from(
      new Map(
        dashboard.todayTasks.map((task) => [
          task.tortoiseId,
          {
            tortoiseId: task.tortoiseId,
            tortoiseName: task.tortoiseName,
          },
        ]),
      ).values(),
    );
  }, [dashboard]);

  const filteredTasks = useMemo(() => {
    if (!dashboard) {
      return [];
    }

    return dashboard.todayTasks.filter((task) => {
      const matchesStatus =
        taskFilter === "all" ||
        (taskFilter === "completed" &&
          task.isCompleted) ||
        (taskFilter === "pending" &&
          !task.isCompleted);

      const matchesTortoise =
        tortoiseFilter === "all" ||
        task.tortoiseId.toString() === tortoiseFilter;

      return matchesStatus && matchesTortoise;
    });
  }, [dashboard, taskFilter, tortoiseFilter]);

  async function handleComplete(
    task: DashboardTaskResponse,
  ) {
    if (task.isCompleted || completingTaskId !== null) {
      return;
    }

    setCompletingTaskId(task.taskId);
    setActionError("");

    try {
      const result = await completeCareTask(task.taskId);

      const achievementText = result.unlockedAchievement
        ? ` Achievement unlocked: ${result.unlockedAchievement.title}!`
        : "";

      setSuccessMessage(
        `Care task complete! +${result.xpEarned} XP and +${result.coinsEarned} Coins.${achievementText}`,
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
            Loading today&apos;s care plan...
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
            {errorMessage || "Care tasks could not be loaded."}
          </Alert>

          <CompleteButton
            variant="contained"
            startIcon={<RefreshRounded />}
            onClick={() => void loadTasks()}
          >
            Try again
          </CompleteButton>
        </StatusCard>
      </StatusContainer>
    );
  }

  const pendingCount =
    dashboard.todayProgress.total -
    dashboard.todayProgress.completed;

  return (
    <PageContainer>
      <HeaderCard>
        <HeaderContent>
          <Typography
            variant="overline"
            sx={{
              fontWeight: 900,
              letterSpacing: "0.1em",
              opacity: 0.8,
            }}
          >
            Daily Care Routine
          </Typography>

          <Typography variant="h3" sx={{ mb: 1 }}>
            Today&apos;s Care Tasks
          </Typography>

          <Typography sx={{ opacity: 0.85 }}>
            Every small task helps your tortoises stay happy,
            healthy, and thriving.
          </Typography>
        </HeaderContent>
      </HeaderCard>

      <SummaryGrid>
        <SummaryCard>
          <SummaryHeader>
            <Typography color="text.secondary">
              Completed
            </Typography>

            <TaskAltRounded color="success" />
          </SummaryHeader>

          <Typography variant="h4">
            {dashboard.todayProgress.completed}
          </Typography>
        </SummaryCard>

        <SummaryCard>
          <SummaryHeader>
            <Typography color="text.secondary">
              Still to do
            </Typography>

            <PetsRounded color="primary" />
          </SummaryHeader>

          <Typography variant="h4">
            {pendingCount}
          </Typography>
        </SummaryCard>

        <SummaryCard>
          <SummaryHeader>
            <Typography color="text.secondary">
              Today&apos;s progress
            </Typography>

            <Typography
              color="primary.main"
              sx={{ fontWeight: 900 }}
            >
              {dashboard.todayProgress.percentage}%
            </Typography>
          </SummaryHeader>

          <ProgressBar
            variant="determinate"
            value={dashboard.todayProgress.percentage}
            aria-label="Today's care progress"
          />
        </SummaryCard>
      </SummaryGrid>

      <FilterCard>
        <FilterGroup>
          <Typography sx={{ fontWeight: 900, mr: 1 }}>
            Show:
          </Typography>

          <ToggleButtonGroup
            exclusive
            size="small"
            value={taskFilter}
            onChange={(_, value: TaskFilter | null) => {
              if (value) {
                setTaskFilter(value);
              }
            }}
            aria-label="Task status filter"
          >
            <ToggleButton value="all">
              All
            </ToggleButton>

            <ToggleButton value="pending">
              Pending
            </ToggleButton>

            <ToggleButton value="completed">
              Completed
            </ToggleButton>
          </ToggleButtonGroup>
        </FilterGroup>

        <FormControl size="small" sx={{ minWidth: 190 }}>
          <InputLabel id="tortoise-filter-label">
            Tortoise
          </InputLabel>

          <Select
            labelId="tortoise-filter-label"
            value={tortoiseFilter}
            label="Tortoise"
            onChange={(event) =>
              setTortoiseFilter(event.target.value)
            }
          >
            <MenuItem value="all">
              All tortoises
            </MenuItem>

            {tortoises.map((tortoise) => (
              <MenuItem
                key={tortoise.tortoiseId}
                value={tortoise.tortoiseId.toString()}
              >
                {tortoise.tortoiseName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </FilterCard>

      <TaskGrid>
        {filteredTasks.length === 0 ? (
          <EmptyState>
            <PetsRounded sx={{ fontSize: 52, mb: 1 }} />

            <Typography variant="h5" sx={{ mb: 1 }}>
              No matching care tasks
            </Typography>

            <Typography>
              Try changing the current filters, or add a
              tortoise if no daily tasks exist.
            </Typography>
          </EmptyState>
        ) : (
          filteredTasks.map((task) => (
            <TaskCard key={task.taskId}>
              <TaskCardHeader>
                <TaskIcon>
                  {getTaskIcon(task.taskType)}
                </TaskIcon>

                <Chip
                  label={
                    task.isCompleted
                      ? "Completed"
                      : "Pending"
                  }
                  color={
                    task.isCompleted
                      ? "success"
                      : "default"
                  }
                  size="small"
                />
              </TaskCardHeader>

              <Typography variant="h5" sx={{ mb: 0.5 }}>
                {task.taskType}
              </Typography>

              <Typography color="text.secondary">
                Care task for {task.tortoiseName}
              </Typography>

              <RewardRow>
                <RewardBadge>
                  <BoltRounded
                    sx={{
                      fontSize: 15,
                      verticalAlign: "middle",
                    }}
                  />{" "}
                  +{task.xpReward} XP
                </RewardBadge>

                <RewardBadge>
                  +{task.coinReward} Coins
                </RewardBadge>
              </RewardRow>

              <CompleteButton
                variant={
                  task.isCompleted ? "outlined" : "contained"
                }
                color={
                  task.isCompleted ? "success" : "primary"
                }
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
                  void handleComplete(task)
                }
              >
                {task.isCompleted
                  ? "Completed"
                  : completingTaskId === task.taskId
                    ? "Completing..."
                    : "Complete task"}
              </CompleteButton>
            </TaskCard>
          ))
        )}
      </TaskGrid>

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