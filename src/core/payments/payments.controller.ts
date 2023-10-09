import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    HttpStatus,
    HttpCode,
    Query,
} from "@nestjs/common";
import { PaymentsService } from "./payments.service";
import { CreatePaymentDto } from "./dto/create-payment.dto";
import { UpdatePaymentDto } from "./dto/update-payment.dto";
import { ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags("Payments")
@Controller("payments")
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) {}

    @ApiResponse({
        status: HttpStatus.CREATED,
        description: "Payment has been successfully created",
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: "User does not have enough money to make a payment",
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: "Category not found",
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: "Something went wrong due to payment processing",
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: "Payment creation error",
    })
    @ApiQuery({
        name: "userId",
        type: "number",
        required: true,
        example: "1",
        description: "Id of the user for whom a payment is to be created",
    })
    @Post()
    async create(
        @Query("userId") userId: string,
        @Body() createPaymentDto: CreatePaymentDto,
    ) {
        return this.paymentsService.create(+userId, createPaymentDto);
    }

    @ApiResponse({
        status: HttpStatus.OK,
        description: "Returns an array of payments",
    })
    @Get()
    async findAll() {
        return this.paymentsService.findAll();
    }

    @ApiResponse({
        status: HttpStatus.OK,
        description: "Returns a single payment if one exists",
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: "Payment not found",
    })
    @Get(":id")
    async findOne(@Param("id") id: string) {
        return this.paymentsService.findOne(+id);
    }

    @ApiResponse({
        status: HttpStatus.OK,
        description: "Payment has been successfully updated is one exists",
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: "Category not found",
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: "Payment updating error",
    })
    @Patch(":id")
    async update(
        @Param("id") id: string,
        @Body() updatePaymentDto: UpdatePaymentDto,
    ) {
        return this.paymentsService.update(+id, updatePaymentDto);
    }

    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: "Payment successfully deleted if one exists",
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: "Payment not found",
    })
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(":id")
    async remove(@Param("id") id: string) {
        return this.paymentsService.remove(+id);
    }
}
