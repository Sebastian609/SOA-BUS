import { Expose } from "class-transformer";
import { IsBoolean } from "class-validator";

export class EventAvailabilityDto {
  @IsBoolean()
  @Expose()
  isAvailable: boolean;
} 