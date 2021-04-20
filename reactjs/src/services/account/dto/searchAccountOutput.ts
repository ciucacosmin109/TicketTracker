import { EntityDto } from "../../dto/entityDto";

export class SearchAccountOutput extends EntityDto { 
  name!: string;
  surname!: string; 

  userName!: string; 
}