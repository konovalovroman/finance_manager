import { ApiProperty } from "@nestjs/swagger";
import {
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsString,
    Min,
} from "class-validator";
import { PaymentType } from "src/utils/types/paymentType";

export class CreatePaymentDto {
    @IsNotEmpty()
    @IsEnum(["income", "expense"])
    @ApiProperty({
        enum: ["income", "expense"],
        enumName: "PaymentType",
    })
    type: PaymentType;

    @IsNumber()
    @Min(0.01)
    @ApiProperty({ example: 100.5 })
    amount: number;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: "Salary for September 2023" })
    description: string;

    @IsNumber()
    @ApiProperty({ example: 1 })
    categoryId: number;
}
