import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, IsOptional } from "class-validator";

export class UpdatePaymentDto {
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    @ApiProperty({
        example: "Salary for September 2023",
        required: false,
    })
    description?: string;

    @IsNumber()
    @IsOptional()
    @ApiProperty({
        example: 1,
        required: false,
    })
    categoryId?: number;
}
