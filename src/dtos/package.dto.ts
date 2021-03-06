import { WarehouseDTO } from './warehouse.dto';
import { CustomerDTO } from './customer.dto';
import { IsString } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export enum Status {
  RECEIVED = 'RECEIVED',
  DELIVERED = 'DELIVERED',
}

export class PackageDTO {
  constructor() {}

  @ApiModelProperty({ example: null })
  id: number;
  @ApiModelProperty()
  customer: CustomerDTO;
  @ApiModelProperty({ example: 'Cordoba' })
  @IsString()
  from: string;
  @ApiModelProperty({ example: 'Avellaneda' })
  @IsString()
  to: string;
  @ApiModelProperty()
  amount: number;
  @ApiModelProperty()
  dateOfDelivery: string;
  @ApiModelProperty({ required: false, example: {} })
  warehouse: WarehouseDTO;
  @ApiModelProperty({ required: false, example: '' })
  @IsString()
  status: Status;
}
