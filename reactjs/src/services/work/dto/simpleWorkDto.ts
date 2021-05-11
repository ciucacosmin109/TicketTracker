import { EntityDto } from "../../dto/entityDto";
import {SimpleUserDto} from '../../user/dto/simpleUserDto';

export class SimpleWorkDto extends EntityDto {
    user?: SimpleUserDto;

    isWorking!: boolean;
    workedTime?: number;
    estimatedTime?: number;
}