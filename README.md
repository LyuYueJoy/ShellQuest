# ShellQuest

A full-stack gamified tortoise care platform built with **React**, **TypeScript**, **ASP.NET Core (.NET 10)** and **Entity Framework Core**.

ShellQuest helps tortoise owners manage their pets while making daily care engaging through gamification. Users can track their tortoises, complete care tasks, earn rewards, customize avatars, purchase items, interact with the community, and chat with other users in real time.

---

# Live Demo

Frontend:

> https://shellquest-frontend-yuely-gkauczemb8fqb4gb.eastasia-01.azurewebsites.net/


Backend Scalar API Documentation:

> https://shellquest-api-yuely-ayf6aagbhbagemcz.eastasia-01.azurewebsites.net/scalar/v1


# Project Theme

The required theme is **Gamification**.

ShellQuest applies gamification by encouraging users to complete daily tortoise care activities through:

- ⭐ Experience (XP)
- 💰 Coins
- 🔥 Daily Streaks
- 🏆 Achievements
- 📈 Level Progression
- ✅ Daily Task Tracking

Instead of simply recording pet information, users are rewarded for maintaining consistent care habits, making routine responsibilities more engaging and motivating.

---

# Main Features

## Dashboard

- User Level
- XP Progress
- Coins
- Daily Progress
- Current Streak
- Recent Achievement
- Today's Care Tasks

---

## My Tortoises

- Create tortoise
- Edit tortoise
- Delete tortoise
- Upload tortoise photo
- Species
- Weight
- Age
- Notes

---

## Care Tasks

Daily recurring care tasks:

- Feed
- Bath
- Clean Habitat
- UVB Check
- Temperature Check

Completing tasks rewards users with:

- XP
- Coins
- Streak Progress

---

## Avatar Studio

Users can customize their own avatar by purchasing and equipping cosmetic items.

---

## Shop

- Browse shop items
- Purchase items using coins
- Inventory management
- Equip purchased items

---

## Forum

Community features include:

- Create posts
- Reply to posts
- Like posts

---

## Private Chat

Real-time private messaging using SignalR.

---

# Technology Stack

## Frontend

- React
- TypeScript
- Vite
- React Router
- Material UI (MUI)
- Axios
- Vitest

---

## Backend

- ASP.NET Core (.NET 10)
- Entity Framework Core
- SQLite
- JWT Authentication
- BCrypt Password Hashing
- SignalR
- Scalar API

---

# Architecture

```
React Frontend
        │
        ▼
ASP.NET Core REST API
        │
        ▼
Entity Framework Core
        │
        ▼
SQLite Database
```

SignalR is used alongside the REST API to support real-time chat functionality.

---

# Database

Main entities include:

- Users
- Tortoises
- CareTasks
- Dashboard
- Avatar
- ShopItems
- UserInventory
- PurchaseHistory
- ForumPosts
- ForumReplies
- ChatMessages

---

# Authentication

Users register using email and password.

Authentication flow:

- Register
- Login
- JWT Token issued
- Token stored by frontend
- Protected API endpoints require authorization

Passwords are never stored in plain text.

---

# Unit Testing

Frontend testing:

- React Testing Library
- Vitest

Backend testing:

- xUnit
- Repository testing
- Controller testing
- Business logic testing

---

# Advanced Requirements

The following advanced requirements were implemented.

## 1. Security Measures

Implemented:

- JWT Authentication
- Password Hashing (BCrypt)
- Data Validation
- Authorization

### Why it is important

Authentication ensures only legitimate users can access protected resources.

Password hashing prevents passwords from being stored in plain text, reducing the impact of database leaks.

Validation protects the application from invalid or malicious user input.

Authorization prevents users from accessing or modifying resources that do not belong to them.

---

## 2. WebSockets (SignalR)

Implemented using ASP.NET Core SignalR.

Features:

- Real-time messaging
- Instant updates
- Private chat

### Why it is important

WebSockets provide a much better user experience than repeatedly polling the server.

SignalR enables instant communication between connected users.

---

## 3. Theme Switching

Users can switch between:

- Light Mode
- Dark Mode

---

# AI-Assisted Development

Artificial Intelligence was used throughout development to assist with:

- Planning system architecture
- Database design
- API design
- Unit test generation
- Debugging
- Documentation

Supporting prompts and development evidence are included in the `/specs` folder.

---

# Project Structure

```
ShellQuest
│
├── frontend
│
├── backend
│
├── backend.Tests
│
├── specs
│
└── README.md
```

---

# Local Setup

## Backend

```bash
cd backend

dotnet restore

dotnet ef database update

dotnet run
```

---

## Frontend

```bash
cd frontend

npm install

npm run dev
```

---

# Environment Variables

Backend:

```
JWT_SECRET=

ConnectionStrings__DefaultConnection=
```

Frontend:

```
VITE_API_BASE_URL=
```

---

# Future Improvements

Possible future enhancements include:

- Leaderboards
- Push notifications
- Achievement badges
- Cloud image storage
- Mobile application
- AI-generated tortoise care recommendations

---

# Self Reflection

If I were to develop this project again, I would begin with a more detailed architecture design before implementation. This would reduce future refactoring and improve maintainability.

I would also deploy the application earlier in development to identify environment-specific issues sooner rather than waiting until the end.

Working on ShellQuest improved my understanding of full-stack software development, authentication, database design, testing, API development, and integrating modern technologies such as SignalR and AI-assisted development.

