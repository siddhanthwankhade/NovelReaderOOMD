export interface User {
    id: number;
    username: string;
    email: string;
    password: string;
    bio?: string;
    favorites: number[];
    uploads: number[];
    readingHistory: ReadingHistory[];
    notifications: Notification[];
    following: number[];
    joinDate: string;
  }
  
  export interface Novel {
    id: number;
    title: string;
    cover: string;
    author: string;
    authorId: number;
    summary: string;
    chapters: Chapter[];
    tags: string[];
    genre: string;
    status: 'ongoing' | 'completed' | 'hiatus';
    rating: number;
    reviews: Review[];
    views: number;
    favorites: number;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Chapter {
    id: number;
    title: string;
    content: string;
    views: number;
    createdAt: string;
    isDraft?: boolean;
  }
  
  export interface Review {
    id: number;
    userId: number;
    username: string;
    rating: number;
    comment: string;
    createdAt: string;
    likes: number[];
  }
  
  export interface ReadingHistory {
    novelId: number;
    novelTitle: string;
    chapterId: number;
    chapterTitle: string;
    progress: number;
    lastRead: string;
  }
  
  export interface Notification {
    id: number;
    type: 'chapter' | 'review' | 'follow' | 'system';
    message: string;
    read: boolean;
    createdAt: string;
    link?: string;
  }