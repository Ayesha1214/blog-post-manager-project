export interface BlogPost {
  id?: number;
  title: string;
  content: string;
  summary?: string;
  author?: string;
  tags?: string;
  createdAt?: string;
  updatedAt?: string;
  published: boolean;
  viewCount?: number;
}

export interface CreatePostRequest {
  title: string;
  content: string;
  summary?: string;
  author?: string;
  tags?: string;
  published: boolean;
}

export interface UpdatePostRequest {
  title?: string;
  content?: string;
  summary?: string;
  author?: string;
  tags?: string;
  published?: boolean;
}

export interface ApiError {
  message: string;
  status: number;
  error: string;
  timestamp: string;
  path: string;
}
