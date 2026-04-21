import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export interface ClientErrorLogEntry {
  timestamp: string;
  method: string;
  url: string;
  status: number;
  error: string;
  message: string;
  ip?: string;
}

@Injectable()
export class ClientErrorLogService {
  private readonly logger = new Logger(ClientErrorLogService.name);
  private readonly logDir = path.join(process.cwd(), 'logs');
  private readonly logFile: string;

  constructor() {
    this.logFile = path.join(this.logDir, 'client-errors.log');
    this.ensureLogDirExists();
  }

  private ensureLogDirExists(): void {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  log(clientError: Omit<ClientErrorLogEntry, 'timestamp'>): void {
    const logEntry: ClientErrorLogEntry = {
      timestamp: new Date().toISOString(),
      method: clientError.method,
      url: clientError.url,
      status: clientError.status,
      error: clientError.error,
      message: clientError.message,
      ip: clientError.ip,
    };

    const formattedLog = JSON.stringify(logEntry) + '\n';

    try {
      fs.appendFileSync(this.logFile, formattedLog);
    } catch (error) {
      this.logger.error(`Failed to write client error log: ${error}`);
    }
  }

  logFromException(
    method: string,
    url: string,
    status: number,
    error: string,
    message: string,
    ip?: string,
  ): void {
    const entry: ClientErrorLogEntry = {
      timestamp: new Date().toISOString(),
      method,
      url,
      status,
      error,
      message,
      ip,
    };
    const formattedLog = JSON.stringify(entry) + '\n';
    try {
      fs.appendFileSync(this.logFile, formattedLog);
    } catch (error) {
      this.logger.error(`Failed to write client error log: ${error}`);
    }
  }
}