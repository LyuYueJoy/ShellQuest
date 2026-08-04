using backend.Data;
using backend.Hubs;
using backend.OpenApi;
using backend.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Scalar.AspNetCore;
using System.Text;
//using backend.Hubs;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

builder.Services.AddOpenApi(options =>
{
    options.AddDocumentTransformer<
        BearerSecuritySchemeTransformer
    >();
});

builder.Services.AddDbContext<WebAPIDBContext>(options =>
    options.UseSqlite(
        builder.Configuration["WebAPIConnection"]
    )
);

builder.Services.AddScoped<IWebAPIRepo, WebAPIRepo>();


builder.Services.AddScoped<
    ITortoiseRepository,
    TortoiseRepository
>();

builder.Services.AddScoped<IForumRepository, ForumRepository>();
builder.Services.AddSingleton(TimeProvider.System);

builder.Services.AddScoped<
    IDashboardRepository,
    DashboardRepository
>();

builder.Services.AddScoped<
    ICareTaskRepository,
    CareTaskRepository
>();

builder.Services.AddScoped<
    IShopRepository,
    ShopRepository
>();

builder.Services.AddScoped<
    IAvatarRepository,
    AvatarRepository
>();

builder.Services.AddSignalR();

builder.Services.AddScoped<IChatRepository, ChatRepository>();




builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters =
            new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,

                ValidIssuer =
                    builder.Configuration["Jwt:Issuer"],

                ValidAudience =
                    builder.Configuration["Jwt:Audience"],

                IssuerSigningKey =
                    new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(
                            builder.Configuration["Jwt:Key"]
                            ?? throw new InvalidOperationException(
                                "JWT key is missing."
                            )
                        )
                    )
            };
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                var accessToken =
                    context.Request.Query["access_token"];

                var path = context.HttpContext.Request.Path;

                if (
                    !string.IsNullOrEmpty(accessToken) &&
                    path.StartsWithSegments("/hubs/chat")
                )
                {
                    context.Token = accessToken;
                }

                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization();

const string FrontendCorsPolicy = "FrontendCorsPolicy";

builder.Services.AddCors(options =>
{
    options.AddPolicy(FrontendCorsPolicy, policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:5173",
                "https://localhost:5173"
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

var app = builder.Build();

using (IServiceScope scope =
    app.Services.CreateScope())
{
    WebAPIDBContext context =
        scope.ServiceProvider
            .GetRequiredService<WebAPIDBContext>();

    await ShopDataSeeder.SeedAsync(context);
}


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}


app.UseStaticFiles();

app.UseHttpsRedirection();
app.UseCors(FrontendCorsPolicy);

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHub<ChatHub>("/hubs/chat");

app.Run();