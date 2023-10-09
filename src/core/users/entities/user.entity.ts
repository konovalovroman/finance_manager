import { Payment } from "../../payments/entities/payment.entity";
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";

@Entity({ name: "users" })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "first_name", nullable: false })
    firstName: string;

    @Column({ name: "last_name", nullable: false })
    lastName: string;

    @Column({ type: "double precision", default: 0, nullable: false })
    balance: number;

    @OneToMany(() => Payment, (payment) => payment.user)
    @JoinColumn({ name: "user_id" })
    payments: Payment[];

    @CreateDateColumn({ name: "created_at", nullable: false })
    createdAt: Date;
}
