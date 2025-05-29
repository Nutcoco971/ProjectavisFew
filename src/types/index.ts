export interface Content {
  id: string;
  title: string;
  type: ContentType;
  year: number;
  genre: string[];
  imageUrl: string;
  creator?: string;
  description: string;
  rating?: number;
}

export type ContentType = 'film' | 'series' | 'music' | 'podcast';

export interface Review {
  id: string;
  contentId: string;
  userId: string;
  rating: number; // 1-5
  emoji?: string;
  keyword?: string;
  text?: string;
  audioUrl?: string;
  context?: string;
  hasSpoilers: boolean;
  isEphemeral: boolean;
  expiresAt?: Date;
  createdAt: Date;
}

export interface User {
  id: string;
  username: string;
  profileImageUrl?: string;
  bio?: string;
  joinedAt: Date;
  preferences: {
    favoriteGenres: string[];
    emotionalTags: string[];
  };
}

export interface ContentStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    '1': number;
    '2': number;
    '3': number;
    '4': number;
    '5': number;
  };
  topKeywords: string[];
  topEmojis: string[];
}