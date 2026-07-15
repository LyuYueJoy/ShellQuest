# ShellQuest Project Plan

## 1. Project Overview

**Project Name:** ShellQuest  
**Project Type:** Full-stack web application  
**Theme:** Gamification  
**Development Period:** Two weeks  
**Frontend:** React, TypeScript, Material UI and Vite  
**Backend:** ASP.NET Core Web API with .NET 10  
**Database:** SQLite with Entity Framework Core  
**API Documentation:** Scalar  
**Repository Structure:** One GitHub repository containing the frontend, backend and project documentation

ShellQuest is a gamified tortoise-care and community application. It helps tortoise owners manage their pets, complete daily care tasks, monitor progress and interact with other owners.

Users receive XP, coins, achievements and streaks for completing care activities. These rewards can be used to customise a virtual tortoise avatar and purchase items from the shop.

---

## 2. Project Goals

The main goals of ShellQuest are to:

1. Help users maintain consistent tortoise-care routines.
2. Make routine care activities more engaging through gamification.
3. Allow users to manage information about multiple tortoises.
4. Provide a community where users can discuss tortoise care.
5. Demonstrate full-stack development using React and ASP.NET Core.
6. Meet the MSA 2026 Phase 2 basic and advanced requirements.
7. Demonstrate responsible and effective use of AI during development.

---

## 3. Target Users

The primary users are:

- New tortoise owners who need help remembering daily care activities.
- Experienced owners who want to record information about their tortoises.
- Users interested in sharing tortoise-care experiences.
- Users motivated by progress tracking, rewards and customisation.

---

## 4. Core User Journey

The main user journey is:

```text
Register or Login
        ↓
Create a Tortoise
        ↓
View Daily Care Tasks
        ↓
Complete Tasks
        ↓
Earn XP and Coins
        ↓
Build a Streak
        ↓
View Dashboard Progress
        ↓
Purchase Shop Items
        ↓
Customise Tortoise Avatar
        ↓
Participate in the Forum
        ↓
Chat with Other Users

5.1 Authentication

Users will be able to:

Register with a username, email address and password.
Log in using an email address and password.
Remain authenticated using a JWT stored in sessionStorage.
Access protected frontend routes after logging in.
Log out and remove their authentication information.
View clear validation and authentication error messages.

The backend will:

Hash passwords using BCrypt.
Generate JWT access tokens.
Protect sensitive API endpoints with [Authorize].
restrict administrator endpoints with [Authorize(Roles = "Admin")].
5.2 Dashboard

The Dashboard will display:

Current level.
Total XP.
XP required for the next level.
Available coins.
Current care streak.
Today's care tasks.
Today's completion progress.
Recent achievement.
Selected tortoise summary.

The Dashboard will act as the main progress overview for authenticated users.

5.3 My Tortoises

Users will be able to:

Create a tortoise.
View their tortoises.
View an individual tortoise's details.
Edit tortoise information.
Delete a tortoise after confirmation.
Upload or select a tortoise photo.
Record the tortoise's name.
Record its species.
Record its age.
Record its weight.
Add care notes.

This feature will provide the main CRUD implementation required by the assessment.

5.4 Daily Care Tasks

Users will be able to manage and complete care tasks such as:

Feeding.
Bathing or soaking.
Cleaning the enclosure.
Checking UVB lighting.
Checking temperature.
Recording weight.

Each completed task may provide:

XP.
Coins.
Daily progress.
Streak progress.

The backend must prevent users from repeatedly claiming the same reward for one completed task.

5.5 Gamification System

ShellQuest will include:

XP.
Levels.
Coins.
Daily streaks.
Progress indicators.
Achievements.
Shop rewards.
Avatar customisation.
A leaderboard if time permits.

Example reward rules:

Activity	XP	Coins
Feed tortoise	10	5
Bath tortoise	15	8
Clean enclosure	20	10
Check UVB	10	5
Check temperature	10	5
Complete all daily tasks	25 bonus	15 bonus

Final reward values may be adjusted after usability testing.

5.6 Avatar Studio

Users will be able to:

View a virtual tortoise avatar.
Change its hat.
Change its shell appearance.
Add accessories.
Preview selected items.
Save the selected configuration.
Use items owned in their inventory.

The first version may use layered static image assets. Animation may be introduced later if the core functionality is stable.

5.7 Shop and Inventory

Users will be able to:

View available shop items.
View item categories.
View item prices.
Purchase items using coins.
Receive feedback when a purchase succeeds or fails.
View owned items in their inventory.
Prevent duplicate purchases where appropriate.

The backend will validate the user's coin balance before completing a purchase.

5.8 Forum

The Forum will be publicly viewable.

Visitors will be able to:

View forum posts.
Open a post and view its replies.

Authenticated users will also be able to:

Create posts.
Reply to posts.
Like posts.
Edit or delete their own content where supported.

The backend will verify ownership before allowing content to be modified or deleted.

5.9 Private Chat

Authenticated users will be able to:

Open a private conversation.
Send messages.
Receive new messages in real time.
View previous messages.
See loading, empty and error states.

SignalR will be used to provide real-time communication through WebSockets.

5.10 Leaderboard

If the core features are completed on schedule, users will be able to:

View weekly XP rankings.
View usernames, levels and XP.
See their own current position.
Compare progress without exposing private information.

The leaderboard is a stretch feature and must not delay required functionality.