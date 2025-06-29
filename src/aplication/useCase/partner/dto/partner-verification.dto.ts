import { Expose } from "class-transformer";
import { IsBoolean, IsOptional, IsString, IsNumber } from "class-validator";

export class PartnerVerificationDto {
  @IsBoolean()
  @Expose()
  success: boolean;

  @IsOptional()
  @IsString()
  @Expose()
  message?: string;

  @IsOptional()
  @IsNumber()
  @Expose()
  partnerId?: number;

  @IsOptional()
  @IsString()
  @Expose()
  partnerName?: string;

  @IsOptional()
  @IsBoolean()
  @Expose()
  isActive?: boolean;
} 