import { Request, Response } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { CreateSaleDto } from "../../aplication/useCase/sale/dto/createSale.dto";
import { CreateSaleUseCase } from "../../aplication/useCase/sale/createSale.useCase";
import {
  CheckEventAvailabilityUseCase,
  GetEventLocationUseCase,
} from "../../aplication/useCase/event";
import {
  PartnerTokenInvalidError,
  SaleDomainError,
  SaleEventNotAvailableError,
} from "../../infrastructure/errors";
import { CheckPartnerUseCase } from "../../aplication/useCase/partner";
import { GenerateTicketsUseCase } from "../../aplication/useCase/ticket";
import { EventLocationDto } from "../../aplication/useCase/event/dto/eventLocation.dto";
import { CreateSaleDetailDto } from "../../aplication/useCase/sale/dto/saleDetail.dto";
import { TicketDto } from "../../aplication/useCase/ticket/dto/ticket.dto";

export class CreateSaleFlow {
  private createSaleUseCase: CreateSaleUseCase;
  private generateTicketsUseCase: GenerateTicketsUseCase;
  private checkEventAvailabilityUseCase: CheckEventAvailabilityUseCase;
  private checkPartnerUseCase: CheckPartnerUseCase;
  private getEventLocationUseCase: GetEventLocationUseCase;

  constructor() {
    this.createSaleUseCase = new CreateSaleUseCase();
    this.generateTicketsUseCase = new GenerateTicketsUseCase();
    this.checkEventAvailabilityUseCase = new CheckEventAvailabilityUseCase();
    this.checkPartnerUseCase = new CheckPartnerUseCase();
    this.getEventLocationUseCase = new GetEventLocationUseCase();
  }

  async execute(req: Request, res: Response) {
    try {
      // Validar datos de entrada
      const dto = plainToInstance(CreateSaleDto, req.body);
      const errors = await validate(dto);

      if (errors.length > 0) {
        return res.status(400).json({
          message: "Datos de venta inválidos",
          errors: errors.map((e) => ({
            property: e.property,
            constraints: e.constraints,
          })),
        });
      }

      //validamos disponibilidad del evento
      const eventIsAvailable = await this.checkEventAvailabilityUseCase.execute(
        dto.eventLocationId
      );

      if (!eventIsAvailable)
        throw new SaleEventNotAvailableError(dto.eventLocationId);

      //validamos al partner(socio)
      const partnerAvailable = await this.checkPartnerUseCase.execute(
        dto.partnerToken
      );

      if (!partnerAvailable) throw new PartnerTokenInvalidError();

      const eventLocation: EventLocationDto =
        await this.getEventLocationUseCase.execute(dto.eventLocationId);

      const { tickets } = await this.generateTicketsUseCase.execute({
        eventLocationId: dto.eventLocationId,
        quantity: dto.quantity,
      });

      let saleDetail: CreateSaleDetailDto[] = [];
      let totalPrice = 0;

      tickets.forEach((ticket: TicketDto) => {
        let item: CreateSaleDetailDto = {
          ticketId: ticket.id,
          amount: eventLocation.price,
        };
        saleDetail.push(item);
        totalPrice += eventLocation.price;
      });



      
    } catch (error: any) {
      console.error("Create sale error:", error.message || error);

      if (error instanceof SaleDomainError) {
        return res.status(error.statusCode).json({ message: error.message });
      }

      if (error.status && error.message) {
        return res.status(error.status).json({ message: error.message });
      }

      return res.status(500).json({
        message: "Error interno del servidor",
      });
    }
  }
}
