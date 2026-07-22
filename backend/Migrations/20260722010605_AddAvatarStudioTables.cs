using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddAvatarStudioTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TortoiseAvatars",
                columns: table => new
                {
                    TortoiseAvatarId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    TortoiseId = table.Column<int>(type: "INTEGER", nullable: false),
                    CanvasWidth = table.Column<int>(type: "INTEGER", nullable: false),
                    CanvasHeight = table.Column<int>(type: "INTEGER", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TortoiseAvatars", x => x.TortoiseAvatarId);
                    table.ForeignKey(
                        name: "FK_TortoiseAvatars_Tortoises_TortoiseId",
                        column: x => x.TortoiseId,
                        principalTable: "Tortoises",
                        principalColumn: "TortoiseId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AvatarEquippedItems",
                columns: table => new
                {
                    AvatarEquippedItemId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    TortoiseAvatarId = table.Column<int>(type: "INTEGER", nullable: false),
                    ShopItemId = table.Column<int>(type: "INTEGER", nullable: false),
                    X = table.Column<double>(type: "REAL", nullable: false),
                    Y = table.Column<double>(type: "REAL", nullable: false),
                    Scale = table.Column<double>(type: "REAL", nullable: false),
                    Rotation = table.Column<double>(type: "REAL", nullable: false),
                    ZIndex = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AvatarEquippedItems", x => x.AvatarEquippedItemId);
                    table.ForeignKey(
                        name: "FK_AvatarEquippedItems_ShopItems_ShopItemId",
                        column: x => x.ShopItemId,
                        principalTable: "ShopItems",
                        principalColumn: "ShopItemId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_AvatarEquippedItems_TortoiseAvatars_TortoiseAvatarId",
                        column: x => x.TortoiseAvatarId,
                        principalTable: "TortoiseAvatars",
                        principalColumn: "TortoiseAvatarId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AvatarEquippedItems_ShopItemId",
                table: "AvatarEquippedItems",
                column: "ShopItemId");

            migrationBuilder.CreateIndex(
                name: "IX_AvatarEquippedItems_TortoiseAvatarId_ShopItemId",
                table: "AvatarEquippedItems",
                columns: new[] { "TortoiseAvatarId", "ShopItemId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_TortoiseAvatars_TortoiseId",
                table: "TortoiseAvatars",
                column: "TortoiseId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AvatarEquippedItems");

            migrationBuilder.DropTable(
                name: "TortoiseAvatars");
        }
    }
}
