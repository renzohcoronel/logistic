import { IsString, IsInt } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class WarehouseDTO {
    @ApiModelProperty()
    @IsInt()
    id: number;
    @ApiModelProperty()
    @IsString()
    name: string;
    @ApiModelProperty()
    @IsString()
    city: string;

  }