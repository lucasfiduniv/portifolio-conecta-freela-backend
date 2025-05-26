import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { ContractStatus } from '../enums/contract-status.enum';

export class UpdateContractStatusDto {
  @ApiProperty({ enum: ContractStatus })
  @IsNotEmpty()
  @IsEnum(ContractStatus)
  status: ContractStatus;
}