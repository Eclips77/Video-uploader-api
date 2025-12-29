import { IRepository } from '../../../domain/repositories';
import { Model, Document } from 'mongoose';

export abstract class MongoRepository<T extends { id: string }, M extends Document> implements IRepository<T> {
  constructor(protected model: Model<M>) {}

  async findAll(): Promise<T[]> {
    const docs = await this.model.find();
    return docs.map((d: any) => d.toJSON() as T);
  }

  async findById(id: string): Promise<T | null> {
    const doc = await this.model.findById(id);
    return doc ? (doc.toJSON() as unknown as T) : null;
  }

  async create(entity: T): Promise<T> {
    const doc = new this.model({ ...entity, _id: entity.id });
    await doc.save();
    return doc.toJSON() as unknown as T;
  }

  async update(id: string, entity: Partial<T>): Promise<T | null> {
    const doc = await this.model.findByIdAndUpdate(id, entity as any, { new: true });
    return doc ? (doc.toJSON() as unknown as T) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id);
    return !!result;
  }
}
