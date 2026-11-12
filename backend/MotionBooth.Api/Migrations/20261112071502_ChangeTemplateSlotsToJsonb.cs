using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using MotionBooth.Api.Models;

#nullable disable

namespace MotionBooth.Api.Migrations
{
    /// <inheritdoc />
    public partial class ChangeTemplateSlotsToJsonb : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Templates",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Width = table.Column<int>(type: "integer", nullable: false),
                    Height = table.Column<int>(type: "integer", nullable: false),
                    Slots = table.Column<List<Slot>>(type: "jsonb", nullable: false),
                    BackgroundImage = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Templates", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Templates");
        }
    }
}
