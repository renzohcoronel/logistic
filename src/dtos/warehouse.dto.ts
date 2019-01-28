import { PackageDTO } from "./package.dto";
import { IsString, IsInt } from "class-validator";

 export class WarehouseDTO {
  
    @IsInt()
    id: number;
    @IsString()
    name: string;
    @IsString()
    city: string;
    max_limit: number;
    isDelayedAllow: boolean;
  
  
  }