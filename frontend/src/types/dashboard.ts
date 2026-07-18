export interface DashboardResponse {
  level: number;
  totalXp: number;
  currentLevelXp: number;
  xpRequiredForNextLevel: number;
  coins: number;
  currentStreak: number;
  longestStreak: number;
  todayProgress: TodayProgressResponse;
  todayTasks: DashboardTaskResponse[];
  recentAchievement: AchievementResponse | null;
}

export interface TodayProgressResponse {
  completed: number;
  total: number;
  percentage: number;
}

export interface DashboardTaskResponse {
  taskId: number;
  taskType: string;
  tortoiseId: number;
  tortoiseName: string;
  isCompleted: boolean;
  completedAt: string | null;
  xpReward: number;
  coinReward: number;
}

export interface AchievementResponse {
  achievementId: number;
  achievementType: string;
  title: string;
  description: string;
  unlockedAt: string;
}

export interface CompleteCareTaskResponse {
  taskId: number;
  isCompleted: boolean;
  completedAt: string;
  xpEarned: number;
  coinsEarned: number;
  totalXp: number;
  coins: number;
  level: number;
  currentStreak: number;
  unlockedAchievement: AchievementResponse | null;
}