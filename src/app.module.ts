import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DatabaseModule } from "./database/database.module";
import { CoreModule } from "./core/core.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        DatabaseModule,
        CoreModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
