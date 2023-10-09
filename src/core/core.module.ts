import { Module } from "@nestjs/common";
import { PaymentsModule } from "./payments/payments.module";
import { CategoriesModule } from "./categories/categories.module";
import { UsersModule } from "./users/users.module";

@Module({
    imports: [
        PaymentsModule, 
        CategoriesModule, 
        UsersModule,
    ],
})
export class CoreModule {}
