  import { Expose } from "class-transformer";
  import { IsNotEmpty, IsString } from "class-validator";
  
  export class LoginUserDto { 
    @IsNotEmpty()
    @IsString()
    @Expose()
    email: string;

    @IsNotEmpty()
    @IsString()
    @Expose()
    password: string;
  }


  export class SafeUserDto {
  @Expose()
  id!: number;

  @Expose()
  name!: string;

  @Expose()
  lastname!: string;

  @Expose()
  email!: string;

  @Expose()
  isActive!: boolean;

  @Expose()
  rol: {
    id: number;
    name: string;
  };
}