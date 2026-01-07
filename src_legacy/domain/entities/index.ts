export interface Video {
  id: string;
  title: string;
  creator: string;
  description: string;
  targetAudience: string;
  language: string;
  genres: string[]; // Genre IDs
  uploadTime: string; // ISO 8601
  filePath: string;
}

export interface Genre {
  id: string;
  name: string;
}

export interface Playlist {
  id: string;
  name: string;
  videoIds: string[];
}
