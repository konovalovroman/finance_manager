import { Test, TestingModule } from "@nestjs/testing";
import { CategoriesService } from "./categories.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Category } from "./entities/category.entity";
import { Repository } from "typeorm";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { NotFoundException, BadRequestException } from "@nestjs/common";

describe("CategoriesService", () => {
    let categoriesService: CategoriesService;
    let categoriesRepository: Repository<Category>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CategoriesService,
                {
                    provide: getRepositoryToken(Category),
                    useClass: Repository,
                },
            ],
        }).compile();

        categoriesService = module.get<CategoriesService>(CategoriesService);
        categoriesRepository = module.get<Repository<Category>>(
            getRepositoryToken(Category),
        );
    });

    it("should be defined", () => {
        expect(categoriesService).toBeDefined();
    });

    describe("create", () => {
        it("should create a category", async () => {
            const createCategoryDto: CreateCategoryDto = {
                name: "Test Category",
            };

            const category = new Category();
            category.name = "Test Category";

            categoriesRepository.create = jest.fn().mockReturnValue(category);
            categoriesRepository.save = jest.fn().mockReturnValue(category);

            const result = await categoriesService.create(createCategoryDto);
            expect(result).toEqual(category);
        });

        it("should throw BadRequestException on error", async () => {
            const createCategoryDto: CreateCategoryDto = {
                name: "Test Category",
            };

            categoriesRepository.create = jest.fn().mockImplementation(() => {
                throw new Error();
            });

            try {
                await categoriesService.create(createCategoryDto);
            } catch (error) {
                expect(error).toBeInstanceOf(BadRequestException);
            }
        });
    });

    describe("findAll", () => {
        it("should return an array of categories", async () => {
            const categories: Category[] = [
                { id: 1, name: "Category 1", createdAt: new Date() },
                { id: 2, name: "Category 2", createdAt: new Date() },
            ];

            categoriesRepository.find = jest.fn().mockResolvedValue(categories);

            const result = await categoriesService.findAll();
            expect(result).toEqual(categories);
        });
    });

    describe("findOne", () => {
        it("should return a category by id", async () => {
            const category: Category = {
                id: 1,
                name: "Test Category",
                createdAt: new Date(),
            };

            categoriesRepository.findOne = jest
                .fn()
                .mockResolvedValue(category);

            const result = await categoriesService.findOne(1);
            expect(result).toEqual(category);
        });

        it("should throw NotFoundException if category is not found", async () => {
            categoriesRepository.findOne = jest.fn().mockResolvedValue(null);

            try {
                await categoriesService.findOne(1);
            } catch (error) {
                expect(error).toBeInstanceOf(NotFoundException);
            }
        });
    });

    describe("remove", () => {
        it("should remove a category by ID", async () => {
            const categoryToRemove: Category = {
                id: 1,
                name: "Test Category",
                createdAt: new Date(),
            };

            categoriesRepository.delete = jest
                .fn()
                .mockResolvedValue({ affected: 1 });

            const result = await categoriesService.remove(1);
            expect(result).toBe(true);
        });

        it("should throw NotFoundException if category is not found", async () => {
            categoriesRepository.delete = jest
                .fn()
                .mockResolvedValue({ affected: 0 });

            try {
                await categoriesService.remove(1);
            } catch (error) {
                expect(error).toBeInstanceOf(NotFoundException);
            }
        });
    });
});
