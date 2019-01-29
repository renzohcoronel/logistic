import { WarehouseDTO } from "./warehouse.dto";
import { CustomerDTO } from "./customer.dto";
import { IsString, IsInt } from "class-validator";

 export enum Status {
    RECEIVED = "RECEIVED",
    DELIVERED = "DELIVERED",
}
  
  export class PackageDTO {

    id: number;
    customer: CustomerDTO;
    @IsString()
    from: string;
    @IsString()
    to: string;
    warehouse: WarehouseDTO;
    @IsString()
    status: Status;
    
  }
