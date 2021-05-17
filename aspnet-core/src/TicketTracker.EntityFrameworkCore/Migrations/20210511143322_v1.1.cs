using Microsoft.EntityFrameworkCore.Migrations;

namespace TicketTracker.Migrations
{
    public partial class v11 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Works_ProjectUsers_ProjectUserId",
                table: "Works");

            migrationBuilder.DropForeignKey(
                name: "FK_Works_Tickets_TicketId",
                table: "Works");

            migrationBuilder.DropIndex(
                name: "IX_Works_ProjectUserId_TicketId",
                table: "Works");

            migrationBuilder.AlterColumn<int>(
                name: "TicketId",
                table: "Works",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<int>(
                name: "ProjectUserId",
                table: "Works",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.CreateIndex(
                name: "IX_Works_ProjectUserId_TicketId",
                table: "Works",
                columns: new[] { "ProjectUserId", "TicketId" },
                unique: true,
                filter: "[ProjectUserId] IS NOT NULL AND [TicketId] IS NOT NULL");

            migrationBuilder.AddForeignKey(
                name: "FK_Works_ProjectUsers_ProjectUserId",
                table: "Works",
                column: "ProjectUserId",
                principalTable: "ProjectUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Works_Tickets_TicketId",
                table: "Works",
                column: "TicketId",
                principalTable: "Tickets",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Works_ProjectUsers_ProjectUserId",
                table: "Works");

            migrationBuilder.DropForeignKey(
                name: "FK_Works_Tickets_TicketId",
                table: "Works");

            migrationBuilder.DropIndex(
                name: "IX_Works_ProjectUserId_TicketId",
                table: "Works");

            migrationBuilder.AlterColumn<int>(
                name: "TicketId",
                table: "Works",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "ProjectUserId",
                table: "Works",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Works_ProjectUserId_TicketId",
                table: "Works",
                columns: new[] { "ProjectUserId", "TicketId" },
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Works_ProjectUsers_ProjectUserId",
                table: "Works",
                column: "ProjectUserId",
                principalTable: "ProjectUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Works_Tickets_TicketId",
                table: "Works",
                column: "TicketId",
                principalTable: "Tickets",
                principalColumn: "Id");
        }
    }
}
