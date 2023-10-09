import { Category } from "../../categories/entities/category.entity";
import { User } from "../../users/entities/user.entity";
import { PaymentType } from "src/utils/types/paymentType";
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";

@Entity({ name: "payments" })
export class Payment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        nullable: false,
        enum: ["income", "expense"],
    })
    type: PaymentType;

    @Column({
        type: "double precision",
        nullable: false,
    })
    amount: number;

    @Column({ nullable: false })
    description: string;

    @ManyToOne(() => Category, (category) => category.id, {
        onDelete: "SET NULL",
    })
    @JoinColumn({ name: "category_id" })
    category: Category;

    @ManyToOne(() => User, (user) => user.id, { onDelete: "CASCADE" })
    @JoinColumn({ name: "user_id" })
    user: User;

    @CreateDateColumn({ name: "created_at", nullable: false })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at", nullable: false })
    updatedAt: Date;
}
