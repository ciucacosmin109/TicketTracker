import { EntityDto } from "../../dto/entityDto";

export class GetAccountOutput extends EntityDto {
  name!: string;
  surname!: string;
  fullName!: string;

  userName!: string;
  emailAddress!: string;

  creationTime!: Date; 
}