import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { ProposalStatus } from '../enums/proposal-status.enum';

export class UpdateProposalStatusDto {
  @ApiProperty({ enum: ProposalStatus })
  @IsNotEmpty()
  @IsEnum(ProposalStatus)
  status: ProposalStatus;
}