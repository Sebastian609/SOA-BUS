import { Expose } from "class-transformer";
import { IsBoolean, IsOptional, IsString, IsNumber } from "class-validator";

export class PartnerVerificationDto {


  @IsNumber()
  @Expose()
  id: number;

  @IsOptional()
  @IsString()
  @Expose()
  name: string;

  @IsOptional()
  @IsBoolean()
  @Expose()
  isActive?: boolean;
} 