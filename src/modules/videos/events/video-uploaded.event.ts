export class VideoUploadedEvent {
  constructor(
    public readonly videoId: string,
    public readonly filePath: string,
  ) {}
}
