import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    BadRequestException,
    NotFoundException,
    HttpCode,
    HttpStatus,
    Query,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { PaymentsSortParams } from "src/utils/types/sortingParams";

@ApiTags("Users")
@Controller("users")
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @ApiResponse({
        status: HttpStatus.CREATED,
        description: "User has been successfully created",
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: "User creation error",
    })
    @Post()
    async create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    @ApiResponse({
        status: HttpStatus.OK,
        description: "Returns an array of users",
    })
    @Get()
    async findAll() {
        return await this.usersService.findAll();
    }

    @ApiResponse({
        status: HttpStatus.OK,
        description: "Returns a single user if one exists and their payments",
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: "User not found",
    })
    @ApiQuery({
        name: "sortBy",
        type: "string",
        required: false,
        example: "date",
        description: "Payment sorting criteria, allows: date, description",
    })
    @ApiQuery({
        name: "sortOrder",
        type: "string",
        required: false,
        example: "ASC",
        description: "Sort order by selected criteria, allows: ASC, DESC",
    })
    @Get(":id")
    async findOne(
        @Param("id") id: string,
        @Query("sortBy") sortBy: string = null,
        @Query("sortOrder") sortOrder: "ASC" | "DESC" = null,
    ) {
        const paymentSortParams: PaymentsSortParams = { sortBy, sortOrder };
        return this.usersService.findOne(+id, paymentSortParams);
    }

    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: "User successfully deleted if one exists",
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: "User not found",
    })
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(":id")
    async remove(@Param("id") id: string) {
        return this.usersService.remove(+id);
    }
}
