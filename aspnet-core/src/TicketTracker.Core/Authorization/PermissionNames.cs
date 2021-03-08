namespace TicketTracker.Authorization
{
    public static class PermissionNames
    {
        // General
        public const string Pages_Tenants = "Pages.Tenants"; 
        public const string Pages_Users = "Pages.Users";
        public const string Pages_Roles = "Pages.Roles";

        public const string Pages_Activities = "Pages.Activities";

        // Inside a project
        public const string Project_Edit = "Project.Edit";
        public const string Project_AddUsers = "Project.AddUsers";
        public const string Project_AddComponents = "Project.AddComponents";

        public const string Component_Edit = "Component.Edit";
        public const string Component_AddTickets = "Component.AddTickets";

        public const string Ticket_Edit = "Ticket.Edit";
        public const string Ticket_Subscribe = "Ticket.Subscribe";
        public const string Ticket_AddComments = "Ticket.AddComments";
        public const string Ticket_AddAttachments = "Ticket.AddAttachments";
        public const string Ticket_AssignWork = "Ticket.AssignWork";
        public const string Ticket_SelfAssignWork = "Ticket.SelfAssignWork";
    }
}
