import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { CreatePaymentDto } from "./dto/create-payment.dto";
import { UpdatePaymentDto } from "./dto/update-payment.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Payment } from "./entities/payment.entity";
import { Repository } from "typeorm";
import { CategoriesService } from "../categories/categories.service";
import { LogWriterService } from "../../logWriter/logWriter.service";
import { UsersService } from "../users/users.service";

@Injectable()
export class PaymentsService {
    constructor(
        @InjectRepository(Payment)
        private readonly paymentsRepository: Repository<Payment>,
        private readonly categoriesService: CategoriesService,
        private readonly usersService: UsersService,
        private readonly logWriterService: LogWriterService,
    ) {}

    async create(
        userId: number,
        createPaymentDto: CreatePaymentDto,
    ): Promise<Payment> {
        const user = await this.usersService.findOne(userId);
        if (!user) {
            return null;
        }
        const payment = this.paymentsRepository.create(createPaymentDto);
        payment.user = user;
        if (payment.type === "expense" && payment.amount > user.balance) {
            throw new BadRequestException(
                "User does not have enough money to make a payment",
            );
        }
        const category = await this.categoriesService.findOne(
            createPaymentDto.categoryId,
        );
        if (!category) {
            throw new NotFoundException("Category not found");
        }
        payment.category = category;

        const isPaymentSucceed = await this.usersService.processPayment(
            user,
            payment,
        );
        if (!isPaymentSucceed) {
            throw new BadRequestException(
                "Something went wrong due to payment processing",
            );
        }
        const insertedPayment = await this.paymentsRepository.save(payment);
        this.logWriterService.logPayment(payment, "CREATE");
        return insertedPayment;
    }

    async findAll(): Promise<Payment[]> {
        const payments = await this.paymentsRepository.find({
            relations: { category: true },
        });
        return payments;
    }

    async findOne(id: number): Promise<Payment> {
        const payment = await this.paymentsRepository.findOne({
            where: { id },
            relations: { category: true },
        });
        if (!payment) {
            throw new NotFoundException("Payment not found");
        }
        return payment;
    }

    async update(
        id: number,
        updatePaymentDto: UpdatePaymentDto,
    ): Promise<Payment> {
        const payment = await this.findOne(id);
        if (!payment) {
            throw new NotFoundException("Payment not found");
        }
        const { categoryId, description } = updatePaymentDto;
        if (categoryId) {
            const category = await this.categoriesService.findOne(categoryId);
            if (!category) {
                throw new NotFoundException("Category not found");
            }
            payment.category = category;
            delete updatePaymentDto.categoryId;
        }
        if (description) {
            payment.description = description;
        }
        this.logWriterService.logPayment(payment, "UPDATE");
        return this.paymentsRepository.save(payment);
    }

    async remove(id: number): Promise<any> {
        const payment = await this.findOne(id);
        if (!payment) {
            throw new NotFoundException("Payment not found");
        }
        await this.paymentsRepository.remove(payment);
        this.logWriterService.logPayment(payment, "DELETE");
        return true;
    }
}
