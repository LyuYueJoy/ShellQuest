using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddShopTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ShopItems",
                columns: table => new
                {
                    ShopItemId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "TEXT", maxLength: 500, nullable: false),
                    Category = table.Column<string>(type: "TEXT", maxLength: 30, nullable: false),
                    Price = table.Column<int>(type: "INTEGER", nullable: false),
                    AssetKey = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    AssetUrl = table.Column<string>(type: "TEXT", maxLength: 500, nullable: false),
                    ThumbnailUrl = table.Column<string>(type: "TEXT", maxLength: 500, nullable: true),
                    AssetType = table.Column<string>(type: "TEXT", maxLength: 30, nullable: false),
                    DefaultX = table.Column<double>(type: "REAL", nullable: false),
                    DefaultY = table.Column<double>(type: "REAL", nullable: false),
                    DefaultScale = table.Column<double>(type: "REAL", nullable: false),
                    DefaultRotation = table.Column<double>(type: "REAL", nullable: false),
                    DefaultZIndex = table.Column<int>(type: "INTEGER", nullable: false),
                    IsActive = table.Column<bool>(type: "INTEGER", nullable: false),
                    SortOrder = table.Column<int>(type: "INTEGER", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ShopItems", x => x.ShopItemId);
                });

            migrationBuilder.CreateTable(
                name: "PurchaseTransactions",
                columns: table => new
                {
                    PurchaseTransactionId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    OwnerId = table.Column<int>(type: "INTEGER", nullable: false),
                    ShopItemId = table.Column<int>(type: "INTEGER", nullable: false),
                    PricePaid = table.Column<int>(type: "INTEGER", nullable: false),
                    PurchasedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PurchaseTransactions", x => x.PurchaseTransactionId);
                    table.ForeignKey(
                        name: "FK_PurchaseTransactions_ShopItems_ShopItemId",
                        column: x => x.ShopItemId,
                        principalTable: "ShopItems",
                        principalColumn: "ShopItemId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PurchaseTransactions_Users_OwnerId",
                        column: x => x.OwnerId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserInventoryItems",
                columns: table => new
                {
                    UserInventoryItemId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    OwnerId = table.Column<int>(type: "INTEGER", nullable: false),
                    ShopItemId = table.Column<int>(type: "INTEGER", nullable: false),
                    AcquiredAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserInventoryItems", x => x.UserInventoryItemId);
                    table.ForeignKey(
                        name: "FK_UserInventoryItems_ShopItems_ShopItemId",
                        column: x => x.ShopItemId,
                        principalTable: "ShopItems",
                        principalColumn: "ShopItemId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_UserInventoryItems_Users_OwnerId",
                        column: x => x.OwnerId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PurchaseTransactions_OwnerId_PurchasedAt",
                table: "PurchaseTransactions",
                columns: new[] { "OwnerId", "PurchasedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_PurchaseTransactions_ShopItemId",
                table: "PurchaseTransactions",
                column: "ShopItemId");

            migrationBuilder.CreateIndex(
                name: "IX_ShopItems_AssetKey",
                table: "ShopItems",
                column: "AssetKey",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserInventoryItems_OwnerId_ShopItemId",
                table: "UserInventoryItems",
                columns: new[] { "OwnerId", "ShopItemId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserInventoryItems_ShopItemId",
                table: "UserInventoryItems",
                column: "ShopItemId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PurchaseTransactions");

            migrationBuilder.DropTable(
                name: "UserInventoryItems");

            migrationBuilder.DropTable(
                name: "ShopItems");
        }
    }
}
