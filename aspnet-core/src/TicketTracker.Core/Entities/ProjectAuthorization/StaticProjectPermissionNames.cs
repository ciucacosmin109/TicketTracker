using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TicketTracker.Entities.ProjectAuthorization {
    public static class StaticProjectPermissionNames {
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
