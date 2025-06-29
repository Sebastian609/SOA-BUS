import { Expose, Type } from "class-transformer";
import { IsString, IsArray, ValidateNested } from "class-validator";
import { TicketDto } from "./ticket.dto";

export class GenerateTicketsResponseDto {
  @IsString()
  @Expose()
  message: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TicketDto)
  @Expose()
  tickets: TicketDto[];
} 