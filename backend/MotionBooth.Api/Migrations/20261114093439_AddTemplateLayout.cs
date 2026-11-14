using Microsoft.EntityFrameworkCore.Migrations;
using MotionBooth.Api.Models;

#nullable disable

namespace MotionBooth.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddTemplateLayout : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Height",
                table: "Templates");

            migrationBuilder.DropColumn(
                name: "Width",
                table: "Templates");

            migrationBuilder.AddColumn<Layout>(
                name: "Layout",
                table: "Templates",
                type: "jsonb",
                nullable: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Layout",
                table: "Templates");

            migrationBuilder.AddColumn<int>(
                name: "Height",
                table: "Templates",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Width",
                table: "Templates",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }
    }
}
