export interface IStorageService {
  upload(file: Express.Multer.File | { path: string, originalname: string, mimetype: string }, destination: string): Promise<string>;
  delete(path: string): Promise<void>;
  getUrl(path: string): string;
}
