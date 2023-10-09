import { Module } from "@nestjs/common";
import { LogWriterService } from "./logWriter.service";

@Module({
    providers: [LogWriterService],
    exports: [LogWriterService],
})
export class LogWriterModule {}
