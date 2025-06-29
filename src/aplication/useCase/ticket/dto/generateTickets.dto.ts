import { Expose } from "class-transformer";
import { IsNotEmpty, IsNumber, Min, IsPositive, Max } from "class-validator";

export class GenerateTicketsDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Expose()
  eventLocationId: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(1000)
  @Expose()
  quantity: number;
} 