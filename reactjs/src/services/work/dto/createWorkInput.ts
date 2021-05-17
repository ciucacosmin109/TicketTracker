export class CreateWorkInput {
    userId!: number;
    ticketId!: number;
    
    workedTime?: number;
    estimatedTime?: number;
}