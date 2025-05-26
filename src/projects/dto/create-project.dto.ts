import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsDateString, Min } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({ example: 'Website Development' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: 'I need a responsive website for my small business...' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ example: 1000 })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  budget: number;

  @ApiProperty({ example: '2023-12-31' })
  @IsNotEmpty()
  @IsDateString()
  deadline: string;
}