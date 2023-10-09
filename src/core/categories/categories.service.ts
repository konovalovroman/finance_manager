import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "./entities/category.entity";
import { Repository } from "typeorm";
import { hasRecordRemoved } from "../../utils/helpers/hasRecordRemoved";

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Category)
        private readonly categoriesRepository: Repository<Category>,
    ) {}

    async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
        try {
            const category =
                this.categoriesRepository.create(createCategoryDto);
            const insertedCategory = await this.categoriesRepository.save(
                category,
            );
            return insertedCategory;
        } catch (err) {
            throw new BadRequestException("Category creation error");
        }
    }

    async findAll(): Promise<Category[]> {
        const categories = await this.categoriesRepository.find();
        return categories;
    }

    async findOne(id: number): Promise<Category> {
        const category = await this.categoriesRepository.findOne({
            where: { id },
        });
        if (!category) {
            throw new NotFoundException("Category not found");
        }
        return category;
    }

    async remove(id: number): Promise<boolean> {
        const removeCategoryResult = await this.categoriesRepository.delete(id);
        if (!hasRecordRemoved(removeCategoryResult)) {
            throw new NotFoundException("Category not found");
        }
        return true;
    }
}
