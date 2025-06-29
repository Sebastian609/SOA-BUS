import { Expose } from "class-transformer";
import { IsNumber, IsString, IsBoolean, IsDateString } from "class-validator";

export class LocationDto {
  @IsNumber()
  @Expose()
  id: number;

  @IsString()
  @Expose()
  name: string;

  @IsNumber()
  @Expose()
  capacity: number;

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