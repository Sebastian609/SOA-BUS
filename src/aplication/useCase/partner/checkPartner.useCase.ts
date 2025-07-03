import axios from "axios";
import { plainToInstance } from "class-transformer";
import { PartnerVerificationDto } from "./dto/partner-verification.dto";
import { 
  PartnerTokenRequiredError, 
  PartnerTokenInvalidError, 
  PartnerServiceUnavailableError 
} from "../../../infrastructure/errors";

export class CheckPartnerUseCase {
  async execute(token: string): Promise<PartnerVerificationDto> {
    const partnerServiceUrl = process.env.PARTNER_SERVICE_URL;
    if (!partnerServiceUrl) {
      throw new PartnerServiceUnavailableError();
    }

    if (!token) {
      throw new PartnerTokenRequiredError();
    }

    try {
      const response = await axios.get(`${partnerServiceUrl}/partners/token/${token}`);
      console.log(response.data);
      
      const verificationDto = plainToInstance(PartnerVerificationDto, response.data.partner, { 
        excludeExtraneousValues: true 
      });

      if (!response.data.success) {
        throw new PartnerTokenInvalidError();
      }

      return verificationDto;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status || 500;
        const message = error.response?.data?.message || error.message || "Authentication error";
        throw { status, message };
      }
      throw { status: 500, message: "Unexpected error" };
    }
  }
} 