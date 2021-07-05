namespace TicketTracker.ProjectUsers.Dto {
    public class GetProjectUserInput {
        public long UserId { get; set; }

        public int? ProjectId { get; set; }
        public int? ComponentId { get; set; }
        public int? TicketId { get; set; }
    }
}
