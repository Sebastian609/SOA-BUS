import { Expose } from "class-transformer";
import { IsNumber, IsString, IsBoolean, IsDateString } from "class-validator";

export class EventDto {
  @IsNumber()
  @Expose()
  id: number;

  @IsString()
  @Expose()
  name: string;

  @IsString()
  @Expose()
  description: string;

  @IsDateString()
  @Expose()
  startDate: string;

  @IsDateString()
  @Expose()
  endDate: string;

  @IsDateString()
  @Expose()
  saleStart: string;

  @IsDateString()
  @Expose()
  saleEnd: string;

  @IsDateString()
  @Expose()
  createdAt: string;

  @IsDateString()
  @Expose()
  updatedAt: string;

  @IsBoolean()
  @Expose()
  isActive: boolean;

  @IsBoolean()
  @Expose()
  deleted: boolean;
} 