import {SimpleUserDto} from '../../user/dto/simpleUserDto';

export class SimpleUserWithRolesDto extends SimpleUserDto {
    roleNames?: string[]; 
}