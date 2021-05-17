import {EntityDto} from '../../dto/entityDto';

export class UpdateWorkInput extends EntityDto {
    workedTime?: number;
    estimatedTime?: number; 
}