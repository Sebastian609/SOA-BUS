import "reflect-metadata"
import { Expose, Type } from "class-transformer";
import { IsNotEmpty, IsString, IsNumber, IsPositive, MinLength, IsUUID, ValidateNested } from "class-validator";
import { CreateSaleDetailDto } from "./saleDetail.dto";

export class CreateSaleDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @Expose()
  partnerToken: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Expose()
  userId: number;


  
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Expose()
  quantity: number;
  

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Expose()
  eventLocationId: number;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateSaleDetailDto)
  @Expose()
  saleDetails: CreateSaleDetailDto;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @Expose()
  cardHash: string;
} 