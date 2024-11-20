export interface Novel {
    id: string | number;
    title: string;
    cover: string;
    author: string;
    authorId: number;
    summary: string;
    chapters: Chapter[];
    tags: string[];
    genre: string;
    status: 'ongoing' | 'completed' | 'hiatus';
    createdAt: string;
    updatedAt: string;
    views: number;
    favorites: number;
    reviews: any[];
  }
  
  export interface Chapter {
    id: number;
    title: string;
    content: string;
    views: number;
    createdAt: string;
  }
  
  export interface User {
    id: number;
    username: string;
    email: string;
    password: string;
    favorites: number[];
    readingHistory: ReadingHistory[];
  }
  
  export interface ReadingHistory {
    novelId: number;
    novelTitle: string;
    chapterId: number;
    chapterTitle: string;
    timestamp: string;
  }