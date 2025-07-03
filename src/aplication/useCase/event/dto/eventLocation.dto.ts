import { Expose, Type } from "class-transformer";
import { IsNumber, IsString, IsBoolean, IsDateString, ValidateNested } from "class-validator";
import { EventDto } from "./event.dto";
import { LocationDto } from "./location.dto";

export class EventLocationDto {
  @IsNumber()
  @Expose()
  id: number;

  @IsString()
  @Expose()
  name: string;

  @IsNumber()
  @Expose()
  price: number;

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

  @ValidateNested()
  @Type(() => EventDto)
  @Expose()
  event: EventDto;

  @ValidateNested()
  @Type(() => LocationDto)
  @Expose()
  location: LocationDto;
} 