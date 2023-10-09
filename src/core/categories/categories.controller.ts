import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    HttpCode,
    HttpStatus,
} from "@nestjs/common";
import { CategoriesService } from "./categories.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags("Categories")
@Controller("categories")
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}

    @ApiResponse({
        status: HttpStatus.CREATED,
        description: "Category has been successfully created",
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: "Category creation error",
    })
    @Post()
    async create(@Body() createCategoryDto: CreateCategoryDto) {
        return this.categoriesService.create(createCategoryDto);
    }

    @ApiResponse({
        status: HttpStatus.OK,
        description: "Returns an array of categories",
    })
    @Get()
    async findAll() {
        return this.categoriesService.findAll();
    }

    @ApiResponse({
        status: HttpStatus.OK,
        description: "Returns a single category if one exists",
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: "Category not found",
    })
    @Get(":id")
    async findOne(@Param("id") id: string) {
        return this.categoriesService.findOne(+id);
    }

    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: "Category successfully deleted if one exists",
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: "Category not found",
    })
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(":id")
    async remove(@Param("id") id: string) {
        return this.categoriesService.remove(+id);
    }
}
