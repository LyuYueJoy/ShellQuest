using System.IdentityModel.Tokens.Jwt;
using System.Reflection;
using System.Security.Claims;
using System.Text.Json;
using backend.Controllers;
using backend.Data;
using backend.DTOs;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Moq;

namespace backend.Tests
{
	public class UserControllerTests
	{
		private readonly Mock<IWebAPIRepo> _repoMock;
		private readonly IConfiguration _configuration;

		public UserControllerTests()
		{
			_repoMock = new Mock<IWebAPIRepo>();

			Dictionary<string, string?> settings = new()
			{
				["Jwt:Key"] =
					"ShellQuest-Test-Key-For-Unit-Testing-2026!",
				["Jwt:Issuer"] = "ShellQuestAPI",
				["Jwt:Audience"] = "ShellQuestFrontend"
			};

			_configuration = new ConfigurationBuilder()
				.AddInMemoryCollection(settings)
				.Build();
		}

		private UserController CreateController()
		{
			return new UserController(
				_repoMock.Object,
				_configuration
			);
		}

		[Fact]
		public void Register_NewEmail_HashesPasswordAndCreatesUser()
		{
			// Arrange
			RegisterRequest request = new()
			{
				UserName = "Joy",
				Email = "JOY@EXAMPLE.COM",
				Password = "Password123!"
			};

			User? capturedUser = null;

			_repoMock
				.Setup(repo => repo.EmailExists("joy@example.com"))
				.Returns(false);

			_repoMock
				.Setup(repo => repo.CreateUser(It.IsAny<User>()))
				.Returns((User user) =>
				{
					capturedUser = user;
					user.UserId = 1;
					return user;
				});

			UserController controller = CreateController();

			// Act
			ActionResult<UserResponse> result =
				controller.Register(request);

			// Assert
			CreatedAtActionResult createdResult =
				Assert.IsType<CreatedAtActionResult>(
					result.Result
				);

			Assert.NotNull(capturedUser);
			Assert.Equal("Joy", capturedUser.UserName);
			Assert.Equal("joy@example.com", capturedUser.Email);
			Assert.Equal("User", capturedUser.Role);

			Assert.NotEqual(
				request.Password,
				capturedUser.PasswordHash
			);

			Assert.True(
				BCrypt.Net.BCrypt.Verify(
					request.Password,
					capturedUser.PasswordHash
				)
			);

			UserResponse response =
				Assert.IsType<UserResponse>(
					createdResult.Value
				);

			Assert.Equal(1, response.UserId);
			Assert.Equal("Joy", response.UserName);
			Assert.Equal("joy@example.com", response.Email);
			Assert.Equal("User", response.Role);

			_repoMock.Verify(
				repo => repo.CreateUser(It.IsAny<User>()),
				Times.Once
			);
		}

		[Fact]
		public void Register_ExistingEmail_ReturnsConflict()
		{
			// Arrange
			RegisterRequest request = new()
			{
				UserName = "Joy",
				Email = "joy@example.com",
				Password = "Password123!"
			};

			_repoMock
				.Setup(repo => repo.EmailExists("joy@example.com"))
				.Returns(true);

			UserController controller = CreateController();

			// Act
			ActionResult<UserResponse> result =
				controller.Register(request);

			// Assert
			Assert.IsType<ConflictObjectResult>(
				result.Result
			);

			_repoMock.Verify(
				repo => repo.CreateUser(It.IsAny<User>()),
				Times.Never
			);
		}

		[Fact]
		public void Login_CorrectPassword_ReturnsJwtToken()
		{
			// Arrange
			const string password = "Password123!";

			User user = new()
			{
				UserId = 1,
				UserName = "Joy",
				Email = "joy@example.com",
				PasswordHash =
					BCrypt.Net.BCrypt.HashPassword(password),
				Role = "User"
			};

			_repoMock
				.Setup(repo =>
					repo.GetUserByEmail("joy@example.com"))
				.Returns(user);

			LoginRequest request = new()
			{
				Email = "joy@example.com",
				Password = password
			};

			UserController controller = CreateController();

			// Act
			ActionResult result = controller.Login(request);

			// Assert
			OkObjectResult okResult =
				Assert.IsType<OkObjectResult>(result);

			Assert.NotNull(okResult.Value);

			string json = JsonSerializer.Serialize(
				okResult.Value
			);

			using JsonDocument document =
				JsonDocument.Parse(json);

			string? token = document.RootElement
				.GetProperty("token")
				.GetString();

			Assert.False(string.IsNullOrWhiteSpace(token));

			JwtSecurityToken jwt =
				new JwtSecurityTokenHandler()
					.ReadJwtToken(token);

			Assert.Contains(
				jwt.Claims,
				claim =>
					claim.Type == ClaimTypes.NameIdentifier &&
					claim.Value == "1"
			);

			Assert.Contains(
				jwt.Claims,
				claim =>
					claim.Type == ClaimTypes.Email &&
					claim.Value == "joy@example.com"
			);

			Assert.Contains(
				jwt.Claims,
				claim =>
					claim.Type == ClaimTypes.Role &&
					claim.Value == "User"
			);
		}

		[Fact]
		public void Login_WrongPassword_ReturnsUnauthorized()
		{
			// Arrange
			User user = new()
			{
				UserId = 1,
				UserName = "Joy",
				Email = "joy@example.com",
				PasswordHash =
					BCrypt.Net.BCrypt.HashPassword(
						"CorrectPassword123!"
					),
				Role = "User"
			};

			_repoMock
				.Setup(repo =>
					repo.GetUserByEmail("joy@example.com"))
				.Returns(user);

			LoginRequest request = new()
			{
				Email = "joy@example.com",
				Password = "WrongPassword"
			};

			UserController controller = CreateController();

			// Act
			ActionResult result = controller.Login(request);

			// Assert
			Assert.IsType<UnauthorizedObjectResult>(result);
		}

		[Fact]
		public void Login_UnknownEmail_ReturnsUnauthorized()
		{
			// Arrange
			_repoMock
				.Setup(repo =>
					repo.GetUserByEmail("unknown@example.com"))
				.Returns((User?)null);

			LoginRequest request = new()
			{
				Email = "unknown@example.com",
				Password = "Password123!"
			};

			UserController controller = CreateController();

			// Act
			ActionResult result = controller.Login(request);

			// Assert
			Assert.IsType<UnauthorizedObjectResult>(result);
		}

		[Fact]
		public void ProfileEndpoint_RequiresAuthenticatedUser()
		{
			// Arrange
			MethodInfo? method = typeof(UserController)
				.GetMethod(nameof(UserController.GetProfile));

			// Act
			AuthorizeAttribute? attribute =
				method?.GetCustomAttribute<AuthorizeAttribute>();

			// Assert
			Assert.NotNull(method);
			Assert.NotNull(attribute);
		}

		[Fact]
		public void AdminEndpoint_RequiresAdminRole()
		{
			// Arrange
			MethodInfo? method = typeof(UserController)
				.GetMethod(nameof(UserController.AdminOnly));

			// Act
			AuthorizeAttribute? attribute =
				method?.GetCustomAttribute<AuthorizeAttribute>();

			// Assert
			Assert.NotNull(method);
			Assert.NotNull(attribute);
			Assert.Equal("Admin", attribute.Roles);
		}

		[Fact]
		public void LoginEndpoint_AllowsAnonymousUsers()
		{
			// Arrange
			MethodInfo? method = typeof(UserController)
				.GetMethod(nameof(UserController.Login));

			// Act
			AllowAnonymousAttribute? attribute =
				method?.GetCustomAttribute<
					AllowAnonymousAttribute
				>();

			// Assert
			Assert.NotNull(method);
			Assert.NotNull(attribute);
		}

		[Fact]
		public void RegisterEndpoint_AllowsAnonymousUsers()
		{
			// Arrange
			MethodInfo? method = typeof(UserController)
				.GetMethod(nameof(UserController.Register));

			// Act
			AllowAnonymousAttribute? attribute =
				method?.GetCustomAttribute<
					AllowAnonymousAttribute
				>();

			// Assert
			Assert.NotNull(method);
			Assert.NotNull(attribute);
		}
	}
}