import fs from 'fs-extra';
import path from 'path';
import { IRepository } from '../../domain/repositories';
import { AppError, InternalServerError } from '../../utils/AppError';
import { config } from '../../config/config';

export abstract class FileSystemRepository<T extends { id: string }> implements IRepository<T> {
  protected filePath: string;

  constructor(fileName: string) {
    this.filePath = path.join(config.storagePath, fileName);
    this.ensureFileSync();
  }

  private ensureFileSync() {
    try {
      fs.ensureFileSync(this.filePath);
      const content = fs.readFileSync(this.filePath, 'utf-8');
      if (!content.trim()) {
        fs.writeJsonSync(this.filePath, []);
      }
    } catch (error) {
       console.error(`Failed to initialize repository file: ${this.filePath}`, error);
    }
  }

  protected async readAll(): Promise<T[]> {
    try {
      return await fs.readJson(this.filePath);
    } catch (error) {
      // If file is empty or corrupted, return empty array (or handle differently)
      return [];
    }
  }

  protected async writeAll(data: T[]): Promise<void> {
    try {
      await fs.writeJson(this.filePath, data, { spaces: 2 });
    } catch (error) {
      throw new InternalServerError('Failed to write to repository file');
    }
  }

  async findAll(): Promise<T[]> {
    return this.readAll();
  }

  async findById(id: string): Promise<T | null> {
    const items = await this.readAll();
    return items.find((item) => item.id === id) || null;
  }

  async create(entity: T): Promise<T> {
    const items = await this.readAll();
    items.push(entity);
    await this.writeAll(items);
    return entity;
  }

  async update(id: string, entity: Partial<T>): Promise<T | null> {
    const items = await this.readAll();
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) return null;

    items[index] = { ...items[index], ...entity };
    await this.writeAll(items);
    return items[index];
  }

  async delete(id: string): Promise<boolean> {
    const items = await this.readAll();
    const filtered = items.filter((item) => item.id !== id);
    if (filtered.length === items.length) return false;

    await this.writeAll(filtered);
    return true;
  }
}
