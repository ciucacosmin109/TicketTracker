import http from '../httpService';
import { CheckSubscriptionInput } from './dto/checkSubscriptionInput';
import { CreateSubscriptionInput } from './dto/createSubscriptionInput';
import { SubscriptionDto } from './dto/subscriptionDto';
import { DeleteSubscriptionInput } from './dto/deleteSubscriptionInput';

class SubscriptionService { 
    public async check(input: CheckSubscriptionInput) : Promise<boolean> { 
        let result = await http.get('api/services/app/Subscription/Check', { params: input });
        return result.data.result;
    } 
 
    public async create(input: CreateSubscriptionInput) : Promise<SubscriptionDto> { 
        let result = await http.post('api/services/app/Subscription/Create', input);
        return result.data.result;
    } 

    public async delete(input: DeleteSubscriptionInput) { 
        let result = await http.delete('api/services/app/Subscription/Delete', { params: input });
        return result.data;
    }
}
 
export default new SubscriptionService();