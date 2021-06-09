import { action, observable } from "mobx";
import { CheckSubscriptionInput } from "../services/subscription/dto/checkSubscriptionInput";
import { CreateSubscriptionInput } from "../services/subscription/dto/createSubscriptionInput";
import { DeleteSubscriptionInput } from "../services/subscription/dto/deleteSubscriptionInput";
import subscriptionService from "../services/subscription/subscriptionService";

export default class SubscriptionStore { 
    @observable loading: boolean = false;
    @observable subscribed: boolean = false;
    
    userId?: number; 
    ticketId?: number; 

    @action
    async check(userId: number | undefined, ticketId: number | undefined) : Promise<boolean> {
        if(userId == null || ticketId == null || Number.isNaN(userId) || Number.isNaN(ticketId)){
            return false;
        }
        this.loading = true; 
        const res = await subscriptionService.check({ userId, ticketId } as CheckSubscriptionInput);
        this.subscribed = res;
        this.userId = userId;
        this.ticketId = ticketId;
        this.loading = false;
        return this.subscribed;
    }
    @action
    async subscribe(userId: number | undefined, ticketId: number | undefined) {
        if(userId == null || ticketId == null || Number.isNaN(userId) || Number.isNaN(ticketId)){
            return;
        }
        
        this.loading = true;
        await subscriptionService.create({ userId, ticketId } as CreateSubscriptionInput);
        this.subscribed = true;
        this.userId = userId;
        this.ticketId = ticketId;
        this.loading = false;
    }
    @action
    async unsubscribe(userId: number | undefined, ticketId: number | undefined) {
        if(userId == null || ticketId == null || Number.isNaN(userId) || Number.isNaN(ticketId)){
            return;
        }
        
        this.loading = true;
        await subscriptionService.delete({ userId, ticketId } as DeleteSubscriptionInput);
        this.subscribed = false;
        this.userId = userId;
        this.ticketId = ticketId;
        this.loading = false;
    }
}