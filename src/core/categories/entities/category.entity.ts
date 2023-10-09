import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
} from "typeorm";

@Entity({ name: "categories" })
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true, nullable: false })
    name: string;

    @CreateDateColumn({ name: "created_at", nullable: false })
    createdAt: Date;
}
