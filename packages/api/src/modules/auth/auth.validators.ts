import { IsEmail, IsNotEmpty } from "class-validator";

export class AuthLoginDto {
    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;
}


export class AuthRegisterDto {
    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    firstname: string;

    @IsNotEmpty()
    lastname: string;
}