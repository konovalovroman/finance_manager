import { ApiProperty } from "@nestjs/swagger";
import {
    IsNotEmpty,
    IsNumber,
    IsString,
    Min,
} from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: "Roman" })
    firstName: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: "Konovalov" })
    lastName: string;

    @IsNumber()
    @Min(0)
    @ApiProperty({ example: 100 })
    balance: number;
}
