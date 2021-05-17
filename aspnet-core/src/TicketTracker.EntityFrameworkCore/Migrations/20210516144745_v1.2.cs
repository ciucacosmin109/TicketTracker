using Microsoft.EntityFrameworkCore.Migrations;

namespace TicketTracker.Migrations
{
    public partial class v12 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Works_ProjectUserId_TicketId",
                table: "Works");

            migrationBuilder.CreateIndex(
                name: "IX_Works_ProjectUserId",
                table: "Works",
                column: "ProjectUserId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Works_ProjectUserId",
                table: "Works");

            migrationBuilder.CreateIndex(
                name: "IX_Works_ProjectUserId_TicketId",
                table: "Works",
                columns: new[] { "ProjectUserId", "TicketId" },
                unique: true,
                filter: "[ProjectUserId] IS NOT NULL AND [TicketId] IS NOT NULL");
        }
    }
}
