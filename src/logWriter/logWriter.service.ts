import { Injectable } from "@nestjs/common";
import { readFile, writeFile, access, mkdir } from "fs/promises";
import { dirname, resolve } from "path";
import { Payment } from "src/core/payments/entities/payment.entity";
import { PaymentLog, PaymentLogAction } from "src/utils/types/log";

@Injectable()
export class LogWriterService {
    private logFilePath: string;

    constructor() {
        this.logFilePath = resolve(__dirname, "../../logs/logs.json");
        this.initLogWriter();
    }

    private async initLogWriter() {
        const logFileDir = dirname(this.logFilePath);
        try {
            await Promise.all([access(logFileDir), access(this.logFilePath)]);
        } catch (err) {
            if (err.code === "ENOENT") {
                mkdir(logFileDir, { recursive: true });
                writeFile(this.logFilePath, "[]", "utf8");
            }
        }
    }

    async logPayment(payment: Payment, action: PaymentLogAction) {
        const log: PaymentLog = {
            type: payment.type,
            category: payment.category.name,
            date: new Date(),
            amount: payment.amount,
            action,
        };

        const logFileData = await readFile(this.logFilePath, "utf-8");
        const logs: unknown[] = JSON.parse(logFileData);
        logs.unshift(log);
        return writeFile(this.logFilePath, JSON.stringify(logs), "utf-8");
    }
}
