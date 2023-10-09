import { UsersService } from "./users.service";
import { User } from "./entities/user.entity";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { Payment } from "../payments/entities/payment.entity";

describe("UsersService", () => {
    let usersService: UsersService;
    const usersRepository = {
        manager: {
            transaction: jest.fn(),
        },
        find: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
        delete: jest.fn(),
        createQueryBuilder: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: getRepositoryToken(User),
                    useValue: usersRepository,
                },
            ],
        }).compile();

        usersService = module.get<UsersService>(UsersService);
    });

    it("should be defined", () => {
        expect(usersService).toBeDefined();
    });

    describe("create", () => {
        it("should create a user", async () => {
            const createCategoryDto: CreateUserDto = {
                firstName: "Test",
                lastName: "User",
                balance: 0,
            };

            const user = new User();
            user.firstName = "Test";
            user.lastName = "User";
            user.balance = 0;

            usersRepository.create = jest.fn().mockReturnValue(user);
            usersRepository.save = jest.fn().mockReturnValue(user);

            const result = await usersService.create(createCategoryDto);
            expect(result).toEqual(user);
        });

        it("should throw BadRequestException on error", async () => {
            const createCategoryDto: CreateUserDto = {
                firstName: "Test",
                lastName: "User",
                balance: 0,
            };

            usersRepository.create = jest.fn().mockImplementation(() => {
                throw new Error();
            });

            try {
                await usersService.create(createCategoryDto);
            } catch (error) {
                expect(error).toBeInstanceOf(BadRequestException);
            }
        });
    });

    describe("findOne", () => {
        it("should return a user by id", async () => {
            const user: User = {
                id: 1,
                firstName: "Test",
                lastName: "User",
                balance: 0,
                createdAt: new Date(),
                payments: [],
            };

            const createQueryBuilderMock = {
                ftJoinAndSelect: jest.fn().mockReturnThis(),
                addOrderBy: jest.fn().mockReturnThis(),
                leftJoinAndSelect: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                getOne: jest.fn().mockResolvedValue(user),
            };
            usersRepository.createQueryBuilder = jest
                .fn()
                .mockReturnValue(createQueryBuilderMock);

            usersRepository.createQueryBuilder().getOne = jest
                .fn()
                .mockResolvedValue(user);

            const result = await usersService.findOne(1);
            expect(result).toEqual(user);
        });

        it("should throw NotFoundException if category is not found", async () => {
            const createQueryBuilderMock = {
                ftJoinAndSelect: jest.fn().mockReturnThis(),
                addOrderBy: jest.fn().mockReturnThis(),
                leftJoinAndSelect: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                getOne: jest.fn().mockResolvedValue(null),
            };
            usersRepository.createQueryBuilder = jest
                .fn()
                .mockReturnValue(createQueryBuilderMock);

            try {
                await usersService.findOne(1);
            } catch (error) {
                expect(error).toBeInstanceOf(NotFoundException);
            }
        });
    });

    describe("findAll", () => {
        it("should return an array of categories", async () => {
            const users: User[] = [
                {
                    id: 1,
                    firstName: "Test1",
                    lastName: "User1",
                    balance: 0,
                    createdAt: new Date(),
                    payments: [],
                },
                {
                    id: 1,
                    firstName: "Test2",
                    lastName: "User2",
                    balance: 0,
                    createdAt: new Date(),
                    payments: [],
                },
            ];

            usersRepository.find = jest.fn().mockResolvedValue(users);

            const result = await usersService.findAll();
            expect(result).toEqual(users);
        });
    });
    describe("remove", () => {
        it("should remove a category by ID", async () => {
            const userToRemove: User = {
                id: 1,
                firstName: "Test",
                lastName: "User",
                balance: 0,
                createdAt: new Date(),
                payments: [],
            };

            usersRepository.delete = jest
                .fn()
                .mockResolvedValue({ affected: 1 });

            const result = await usersService.remove(1);
            expect(result).toBe(true);
        });

        it("should throw NotFoundException if category is not found", async () => {
            usersRepository.delete = jest
                .fn()
                .mockResolvedValue({ affected: 0 });

            try {
                await usersService.remove(1);
            } catch (error) {
                expect(error).toBeInstanceOf(NotFoundException);
            }
        });
    });
    describe("processPayment", () => {
        it("should update user balance for income payment", async () => {
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

            usersRepository.manager.transaction = jest
                .fn()
                .mockImplementationOnce(async (entityManeger) => {
                    user.balance += payment.amount;
                    return user;
                });

            const updatedUser = await usersService.processPayment(
                user,
                payment,
            );
            expect(updatedUser).toBeDefined();
            expect(updatedUser.balance).toBe(150);
        });

        it("should update user balance for expense payment", async () => {
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
                type: "expense",
                amount: 30,
                category: null,
                description: "Test description",
                createdAt: new Date(),
                updatedAt: new Date(),
                user,
            };

            usersRepository.manager.transaction = jest
                .fn()
                .mockImplementationOnce(async (entityManeger) => {
                    user.balance -= payment.amount;
                    return user;
                });

            const updatedUser = await usersService.processPayment(
                user,
                payment,
            );
            expect(updatedUser).toBeDefined();
            expect(updatedUser.balance).toBe(70);
        });

        it("should return null and rollback transaction on error", async () => {
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
                type: "expense",
                amount: 120,
                category: null,
                description: "Test description",
                createdAt: new Date(),
                updatedAt: new Date(),
                user,
            };

            usersRepository.manager.transaction = jest
                .fn()
                .mockImplementationOnce(async (entityManeger) => {
                    try {
                        throw new Error();
                    } catch (err) {
                        return null;
                    }
                });
            let updatedUser;
            try {
                updatedUser = await usersService.processPayment(user, payment);
            } catch (err) {
                expect(updatedUser).toBeNull();
            }
        });
    });
});
