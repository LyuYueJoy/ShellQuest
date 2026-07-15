# My Tortoises Backend Development Record

## Date

15 July 2026

## Development Goal

Implement the backend for the ShellQuest **My Tortoises** feature.

Each authenticated user can create and manage multiple tortoises. A tortoise contains:

- Name
- Age in months
- Weight in grams
- Notes
- Photo URL

## AI Prompt Used

> Help me implement the My Tortoises backend step by step using ASP.NET Core, Entity Framework Core and SQLite.  
>  
> Implement a one-to-many relationship between User and Tortoise. Add DTOs, Repository and authenticated CRUD endpoints. The backend must obtain OwnerId from the JWT instead of accepting it from the frontend.  
>  
> Required endpoints:
>
> - GET `/api/tortoises`
> - GET `/api/tortoises/{id}`
> - POST `/api/tortoises`
> - PUT `/api/tortoises/{id}`
> - DELETE `/api/tortoises/{id}`
> - POST `/api/tortoises/{id}/photo`
>
> Support PNG, JPEG and WebP uploads with a 5 MB limit. Store the file URL in SQLite rather than storing image binary data. Provide unit tests using xUnit and Moq.

## Planning and Design Decisions

The feature was divided into small steps:

1. Create the `Tortoise` entity.
2. Configure the User-to-Tortoise relationship.
3. Create and apply an EF Core migration.
4. Create request and response DTOs.
5. Implement the Repository pattern.
6. Implement authenticated CRUD endpoints.
7. Implement photo upload and replacement.
8. Test the APIs using Scalar.
9. Add xUnit and Moq unit tests.

`OwnerId` is read from the JWT `NameIdentifier` claim. This prevents users from submitting another user's ID or accessing tortoises they do not own.

Images are stored under:

```text
wwwroot/uploads/tortoises/{ownerId}/