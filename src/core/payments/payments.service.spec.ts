import { Test, TestingModule } from "@nestjs/testing";
import { PaymentsService } from "./payments.service";
import { CategoriesService } from "../categories/categories.service";
import { UsersService } from "../users/users.service";
import { LogWriterService } from "../../logWriter/logWriter.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Payment } from "./entities/payment.entity";
import { CreatePaymentDto } from "./dto/create-payment.dto";
import { UpdatePaymentDto } from "./dto/update-payment.dto";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { PaymentsModule } from "./payments.module";
import { User } from "../users/entities/user.entity";
import { Category } from "../categories/entities/category.entity";

describe("PaymentsService", () => {
    let paymentsService: PaymentsService;

    const categoriesServiceMock = {
        create: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
        remove: jest.fn(),
    };

    const usersServiceMock = {
        create: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
        remove: jest.fn(),
        processPayment: jest.fn(),
    };

    const logWriterServiceMock = {
        logPayment: jest.fn(),
    };

    const paymentsRepositoryMock = {
        create: jest.fn(),
        save: jest.fn(),
        find: jest.fn(),
        findOne: jest.fn(),
        remove: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PaymentsService,
                CategoriesService,
                UsersService,
                LogWriterService,
                {
                    provide: getRepositoryToken(Payment),
                    useClass: Repository,
                },
            ],
        })
            .overrideProvider(CategoriesService)
            .useValue(categoriesServiceMock)
            .overrideProvider(UsersService)
            .useValue(usersServiceMock)
            .overrideProvider(LogWriterService)
            .useValue(logWriterServiceMock)
            .overrideProvider(getRepositoryToken(Payment))
            .useValue(paymentsRepositoryMock)
            .compile();

        paymentsService = module.get<PaymentsService>(PaymentsService);
    });

    it("should be defined", () => {
        expect(paymentsService).toBeDefined();
    });

    describe("create", () => {
        it("should create an income payment", async () => {
            const createPaymentDto: CreatePaymentDto = {
                type: "income",
                amount: 100,
                description: "Test category",
                categoryId: 1,
            };

            const user: User = {
                id: 1,
                firstName: "Test",
                lastName: "User",
                balance: 0,
                createdAt: new Date(),
                payments: [],
            };

            const category: Category = {
                id: 1,
                name: "Expense Category",
                createdAt: new Date(),
            };

            const payment = new Payment();
            payment.type = createPaymentDto.type;
            payment.amount = createPaymentDto.amount;
            payment.description = createPaymentDto.description;
            payment.category = category;
            payment.user = user;

            paymentsRepositoryMock.create.mockReturnValue(payment);
            usersServiceMock.findOne.mockResolvedValue(user);
            categoriesServiceMock.findOne.mockResolvedValue(category);
            usersServiceMock.processPayment.mockResolvedValue(user);
            paymentsRepositoryMock.save.mockResolvedValue(payment);

            const createdPayment = await paymentsService.create(
                user.id,
                createPaymentDto,
            );

            expect(createdPayment).toEqual(payment);
            expect(paymentsRepositoryMock.create).toHaveBeenCalledWith(
                createPaymentDto,
            );
            expect(usersServiceMock.findOne).toHaveBeenCalledWith(user.id);
            expect(categoriesServiceMock.findOne).toHaveBeenCalledWith(
                createPaymentDto.categoryId,
            );
            expect(usersServiceMock.processPayment).toHaveBeenCalledWith(
                user,
                payment,
            );
            expect(paymentsRepositoryMock.save).toHaveBeenCalledWith(payment);
        });

        it("should create an income payment", async () => {
            const createPaymentDto: CreatePaymentDto = {
                type: "income",
                amount: 100,
                description: "Test category",
                categoryId: 1,
            };

            const user: User = {
                id: 1,
                firstName: "Test",
                lastName: "User",
                balance: 0,
                createdAt: new Date(),
                payments: [],
            };

            const category: Category = {
                id: 1,
                name: "Test category",
                createdAt: new Date(),
            };

            const payment = new Payment();
            payment.type = createPaymentDto.type;
            payment.amount = createPaymentDto.amount;
            payment.description = createPaymentDto.description;
            payment.category = category;
            payment.user = user;

            paymentsRepositoryMock.create.mockReturnValue(payment);
            usersServiceMock.findOne.mockResolvedValue(user);
            categoriesServiceMock.findOne.mockResolvedValue(category);
            usersServiceMock.processPayment.mockResolvedValue(user);
            paymentsRepositoryMock.save.mockResolvedValue(payment);

            const createdPayment = await paymentsService.create(
                user.id,
                createPaymentDto,
            );

            expect(createdPayment).toEqual(payment);
            expect(paymentsRepositoryMock.create).toHaveBeenCalledWith(
                createPaymentDto,
            );
            expect(usersServiceMock.findOne).toHaveBeenCalledWith(user.id);
            expect(categoriesServiceMock.findOne).toHaveBeenCalledWith(
                createPaymentDto.categoryId,
            );
            expect(usersServiceMock.processPayment).toHaveBeenCalledWith(
                user,
                payment,
            );
            expect(paymentsRepositoryMock.save).toHaveBeenCalledWith(payment);
        });

        it("should create an expense payment", async () => {
            const createPaymentDto: CreatePaymentDto = {
                type: "expense",
                amount: 100,
                description: "Test category",
                categoryId: 1,
            };

            const user: User = {
                id: 1,
                firstName: "Test",
                lastName: "User",
                balance: 200,
                createdAt: new Date(),
                payments: [],
            };

            const category: Category = {
                id: 1,
                name: "Test category",
                createdAt: new Date(),
            };

            const payment = new Payment();
            payment.type = createPaymentDto.type;
            payment.amount = createPaymentDto.amount;
            payment.description = createPaymentDto.description;
            payment.category = category;
            payment.user = user;

            paymentsRepositoryMock.create.mockReturnValue(payment);
            usersServiceMock.findOne.mockResolvedValue(user);
            categoriesServiceMock.findOne.mockResolvedValue(category);
            usersServiceMock.processPayment.mockResolvedValue(user);
            paymentsRepositoryMock.save.mockResolvedValue(payment);

            const createdPayment = await paymentsService.create(
                user.id,
                createPaymentDto,
            );

            expect(createdPayment).toEqual(payment);
            expect(paymentsRepositoryMock.create).toHaveBeenCalledWith(
                createPaymentDto,
            );
            expect(usersServiceMock.findOne).toHaveBeenCalledWith(user.id);
            expect(categoriesServiceMock.findOne).toHaveBeenCalledWith(
                createPaymentDto.categoryId,
            );
            expect(usersServiceMock.processPayment).toHaveBeenCalledWith(
                user,
                payment,
            );
            expect(paymentsRepositoryMock.save).toHaveBeenCalledWith(payment);
        });

        it("should throw BadRequestException if user has insufficient balance", async () => {
            const createPaymentDto: CreatePaymentDto = {
                type: "expense",
                amount: 200,
                description: "Test category",
                categoryId: 1,
            };

            const user: User = {
                id: 1,
                firstName: "Test",
                lastName: "User",
                balance: 100,
                createdAt: new Date(),
                payments: [],
            };

            const category: Category = {
                id: 1,
                name: "Test category",
                createdAt: new Date(),
            };

            const payment = new Payment();
            payment.type = createPaymentDto.type;
            payment.amount = createPaymentDto.amount;
            payment.description = createPaymentDto.description;
            payment.category = category;
            payment.user = user;

            paymentsRepositoryMock.create.mockReturnValue(payment);
            usersServiceMock.findOne.mockResolvedValue(user);

            await expect(
                paymentsService.create(user.id, createPaymentDto),
            ).rejects.toThrowError(BadRequestException);
        });

        it("should throw NotFoundException if category is not found", async () => {
            const createPaymentDto: CreatePaymentDto = {
                type: "income",
                amount: 200,
                description: "Test category",
                categoryId: 1,
            };

            const user: User = {
                id: 1,
                firstName: "Test",
                lastName: "User",
                balance: 100,
                createdAt: new Date(),
                payments: [],
            };

            const category: Category = {
                id: 1,
                name: "Test category",
                createdAt: new Date(),
            };

            const payment = new Payment();
            payment.type = createPaymentDto.type;
            payment.amount = createPaymentDto.amount;
            payment.description = createPaymentDto.description;
            payment.category = category;
            payment.user = user;

            paymentsRepositoryMock.create.mockReturnValue(payment);
            usersServiceMock.findOne.mockResolvedValue(user);
            categoriesServiceMock.findOne.mockResolvedValue(null);

            await expect(
                paymentsService.create(user.id, createPaymentDto),
            ).rejects.toThrowError(NotFoundException);
        });

        it("should throw BadRequestException if payment processing fails", async () => {
            const createPaymentDto: CreatePaymentDto = {
                type: "income",
                amount: 200,
                description: "Test category",
                categoryId: 1,
            };

            const user: User = {
                id: 1,
                firstName: "Test",
                lastName: "User",
                balance: 100,
                createdAt: new Date(),
                payments: [],
            };

            const category: Category = {
                id: 1,
                name: "Test category",
                createdAt: new Date(),
            };

            const payment = new Payment();
            payment.type = createPaymentDto.type;
            payment.amount = createPaymentDto.amount;
            payment.description = createPaymentDto.description;
            payment.category = category;
            payment.user = user;

            paymentsRepositoryMock.create.mockReturnValue(payment);
            usersServiceMock.findOne.mockResolvedValue(user);
            categoriesServiceMock.findOne.mockResolvedValue(category);
            usersServiceMock.processPayment.mockResolvedValue(null);

            await expect(
                paymentsService.create(user.id, createPaymentDto),
            ).rejects.toThrowError(BadRequestException);
        });
    });

    describe("findAll", () => {
        it("should return an array of payments", async () => {
            const user: User = {
                id: 1,
                firstName: "Test",
                lastName: "User",
                balance: 100,
                createdAt: new Date(),
                payments: [],
            };

            const category: Category = {
                id: 1,
                name: "Test category",
                createdAt: new Date(),
            };
            const payments: Payment[] = [
                {
                    id: 1,
                    type: "income",
                    amount: 50,
                    category,
                    description: "Test description",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    user,
                },
                {
                    id: 1,
                    type: "expense",
                    amount: 70,
                    category,
                    description: "Test description",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    user,
                },
            ];

            paymentsRepositoryMock.find.mockResolvedValue(payments);

            const result = await paymentsService.findAll();

            expect(result).toEqual(payments);
        });
    });

    describe("findOne", () => {
        it("should return a payment by ID", async () => {
            const user: User = {
                id: 1,
                firstName: "Test",
                lastName: "User",
                balance: 100,
                createdAt: new Date(),
                payments: [],
            };
            const category: Category = {
                id: 1,
                name: "Test category",
                createdAt: new Date(),
            };
            const payment: Payment = {
                id: 1,
                type: "income",
                amount: 50,
                category,
                description: "Test description",
                createdAt: new Date(),
                updatedAt: new Date(),
                user,
            };

            paymentsRepositoryMock.findOne.mockResolvedValue(payment);

            const result = await paymentsService.findOne(1);

            expect(result).toEqual(payment);
        });

        it("should throw NotFoundException if payment is not found", async () => {
            paymentsRepositoryMock.findOne.mockResolvedValue(null);

            await expect(paymentsService.findOne(1)).rejects.toThrowError(
                NotFoundException,
            );
        });

        describe("update", () => {
            it("should update a payment", async () => {
                const updatePaymentDto: UpdatePaymentDto = {
                    description: "Updated Description",
                };
                const user: User = {
                    id: 1,
                    firstName: "Test",
                    lastName: "User",
                    balance: 100,
                    createdAt: new Date(),
                    payments: [],
                };
                const payment: Payment = {
                    id: 1,
                    type: "income",
                    amount: 50,
                    category: null,
                    description: "Test description",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    user,
                };

                const updatedPayment: Payment = {
                    id: 1,
                    type: "income",
                    amount: 50,
                    category: null,
                    description: updatePaymentDto.description,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    user,
                };

                paymentsService.findOne = jest.fn().mockReturnValue(payment);
                paymentsRepositoryMock.save.mockResolvedValue(updatedPayment);

                const result = await paymentsService.update(
                    1,
                    updatePaymentDto,
                );

                expect(result).toEqual(updatedPayment);
            });

            it("should throw NotFoundException if payment is not found", async () => {
                const updatePaymentDto: UpdatePaymentDto = {
                    description: "Updated Description",
                };

                paymentsRepositoryMock.findOne.mockResolvedValue(null);

                await expect(
                    paymentsService.update(1, updatePaymentDto),
                ).rejects.toThrowError(NotFoundException);
            });

            it("should throw NotFoundException if category is not found", async () => {
                const updatePaymentDto: UpdatePaymentDto = {
                    categoryId: 2,
                };

                const user: User = {
                    id: 1,
                    firstName: "Test",
                    lastName: "User",
                    balance: 100,
                    createdAt: new Date(),
                    payments: [],
                };
                const payment: Payment = {
                    id: 1,
                    type: "income",
                    amount: 50,
                    category: null,
                    description: "Test description",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    user,
                };

                paymentsRepositoryMock.findOne.mockResolvedValue(payment);
                categoriesServiceMock.findOne.mockImplementation(async () => {
                    throw new NotFoundException("Category not found");
                });

                await expect(
                    paymentsService.update(1, updatePaymentDto),
                ).rejects.toThrowError(NotFoundException);
            });
        });
    });

    describe("remove", () => {
        it("should remove a payment", async () => {
            const user: User = {
                id: 1,
                firstName: "Test",
                lastName: "User",
                balance: 100,
                createdAt: new Date(),
                payments: [],
            };
            const payment: Payment = {
                id: 1,
                type: "income",
                amount: 50,
                category: null,
                description: "Test description",
                createdAt: new Date(),
                updatedAt: new Date(),
                user,
            };

            paymentsRepositoryMock.findOne.mockResolvedValue(payment);

            const result = await paymentsService.remove(1);

            expect(result).toEqual(true);
        });

        it("should throw NotFoundException if payment is not found", async () => {
            paymentsRepositoryMock.findOne.mockResolvedValue(null);

            await expect(paymentsService.remove(1)).rejects.toThrowError(
                NotFoundException,
            );
        });
    });
});
