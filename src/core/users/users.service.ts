import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
import { hasRecordRemoved } from "../../utils/helpers/hasRecordRemoved";
import { Payment } from "../payments/entities/payment.entity";
import { PaymentsSortParams } from "../../utils/types/sortingParams";
import { getSortingString } from "../../utils/helpers/getSortStrings";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
    ) {}

    async create(createUserDto: CreateUserDto): Promise<User> {
        try {
            const user = this.usersRepository.create(createUserDto);
            user.payments = [];
            const insertedUser = await this.usersRepository.save(user);
            return insertedUser;
        } catch (err) {
            throw new BadRequestException("User creation error");
        }
    }

    async findAll(): Promise<User[]> {
        const users = await this.usersRepository.find();
        return users;
    }

    async findOne(id: number, sortParams?: PaymentsSortParams): Promise<User> {
        const sortingStrings = getSortingString(sortParams);
        const user = await this.usersRepository
            .createQueryBuilder("user")
            .leftJoinAndSelect("user.payments", "payments")
            .addOrderBy(sortingStrings.sortBy, sortingStrings.order)
            .where("user.id = :id", { id })
            .getOne();
        if (!user) {
            throw new NotFoundException("User not found");
        }
        return user;
    }

    async remove(id: number): Promise<boolean> {
        const removeUserResult = await this.usersRepository.delete(id);
        if (!hasRecordRemoved(removeUserResult)) {
            throw new NotFoundException("User not found");
        }
        return true;
    }

    async processPayment(user: User, payment: Payment): Promise<User | null> {
        const updatedUser = await this.usersRepository.manager.transaction(
            async (entityManeger) => {
                try {
                    if (payment.type === "income") {
                        user.balance += payment.amount;
                    }
                    if (payment.type === "expense") {
                        user.balance -= payment.amount;
                    }
                    return await entityManeger.save(user);
                } catch (err) {
                    entityManeger.query("ROLLBACK");
                    return null;
                }
            },
        );
        return updatedUser;
    }
}
