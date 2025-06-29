import { Expose } from "class-transformer";
import { IsNotEmpty, IsNumber, Min, IsPositive } from "class-validator";

export class CreateSaleDetailDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Expose()
  ticketId: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Expose()
  amount: number;
}