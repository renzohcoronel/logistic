import { IsString, IsInt } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class CustomerDTO {
  @ApiModelProperty({ example: 1 })
  @IsInt()
  id: number;
  @ApiModelProperty({ example: 'Renzo' })
  @IsString()
  name: string;
  @ApiModelProperty({ example: 'Coronel' })
  @IsString()
  surname: string;
  @ApiModelProperty({ example: 'Calle 62' })
  @IsString()
  adress: string;
  @ApiModelProperty({ example: '2314619368' })
  @IsString()
  phone: string;
  @ApiModelProperty({ example: 'renzo.h.coronel@gmail.com' })
  @IsString()
  email: string;
}
