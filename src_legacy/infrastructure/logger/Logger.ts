import fs from 'fs';
import path from 'path';
import { config } from '../../config/config';

export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
}

export class Logger {
  private static instance: Logger;
  private logLevel: LogLevel;
  private logFilePath: string;

  private constructor() {
    this.logLevel = (config.logLevel as LogLevel) || LogLevel.INFO;
    this.logFilePath = path.join(process.cwd(), 'app.log');
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.ERROR, LogLevel.WARN, LogLevel.INFO, LogLevel.DEBUG];
    const configLevelIndex = levels.indexOf(this.logLevel);
    const currentLevelIndex = levels.indexOf(level);
    return currentLevelIndex <= configLevelIndex;
  }

  private formatMessage(level: LogLevel, message: string, context?: any): string {
    const timestamp = new Date().toISOString();
    let contextStr = '';
    if (context) {
      try {
        contextStr = ` ${JSON.stringify(context)}`;
      } catch (e) {
        contextStr = ' [Circular/Unserializable]';
      }
    }
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`;
  }

  private logToFile(message: string) {
    fs.appendFile(this.logFilePath, message + '\n', (err) => {
      if (err) {
        console.error('Failed to write to log file:', err);
      }
    });
  }

  public log(level: LogLevel, message: string, context?: any) {
    if (!this.shouldLog(level)) return;

    const formattedMessage = this.formatMessage(level, message, context);

    // Console logging with colors (simplified)
    switch (level) {
      case LogLevel.ERROR:
        console.error(formattedMessage);
        break;
      case LogLevel.WARN:
        console.warn(formattedMessage);
        break;
      case LogLevel.INFO:
        console.log(formattedMessage);
        break;
      case LogLevel.DEBUG:
        console.debug(formattedMessage);
        break;
    }

    // File logging (JSON structure for better aggregation)
    const fileLogEntry = JSON.stringify({
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
    });
    this.logToFile(fileLogEntry);
  }

  public error(message: string, context?: any) {
    this.log(LogLevel.ERROR, message, context);
  }

  public warn(message: string, context?: any) {
    this.log(LogLevel.WARN, message, context);
  }

  public info(message: string, context?: any) {
    this.log(LogLevel.INFO, message, context);
  }

  public debug(message: string, context?: any) {
    this.log(LogLevel.DEBUG, message, context);
  }
}
