using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MotionBooth.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddEventTemplate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Template",
                table: "Events",
                type: "jsonb",
                nullable: false,
                defaultValue: "{}");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Template",
                table: "Events");
        }
    }
}
