import { IsString, IsInt } from 'class-validator';

  export class CustomerDTO {

    @IsInt()
    id: number;
    @IsString()
    name: string;
    @IsString()
    surname: string;
    @IsString()
    adress: string;
    @IsString()
    phone: string;
    @IsString()
    email: string; 
  
  }