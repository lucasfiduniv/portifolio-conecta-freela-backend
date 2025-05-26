import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min, IsPositive } from 'class-validator';

export class CreateProposalDto {
  @ApiProperty({ example: 950 })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  price: number;

  @ApiProperty({ example: 14 })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  deliveryTime: number;

  @ApiProperty({ example: 'I am interested in your project because...' })
  @IsNotEmpty()
  @IsString()
  coverLetter: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsNotEmpty()
  @IsString()
  projectId: string;
}