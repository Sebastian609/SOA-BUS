import { Expose } from "class-transformer";
import { IsNumber, IsString, IsBoolean, IsOptional, IsDateString } from "class-validator";

export class TicketDto {
  @IsNumber()
  @Expose()
  id: number;

  @IsNumber()
  @Expose()
  eventLocationId: number;

  @IsString()
  @Expose()
  code: string;

  @IsBoolean()
  @Expose()
  isUsed: boolean;

  @IsBoolean()
  @Expose()
  isActive: boolean;

  @IsBoolean()
  @Expose()
  deleted: boolean;

  @IsOptional()
  @IsDateString()
  @Expose()
  usedAt: string | null;

  @IsDateString()
  @Expose()
  createdAt: string;

  @IsDateString()
  @Expose()
  updatedAt: string;
} 