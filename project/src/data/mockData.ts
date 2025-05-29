import { Content, Review, User, ContentType } from '../types';

// Mock Content Data
export const mockContents: Content[] = [
  {
    id: '1',
    title: 'Dune: Part Two',
    type: 'film',
    year: 2024,
    genre: ['Science Fiction', 'Adventure', 'Drama'],
    imageUrl: 'https://images.pexels.com/photos/952670/pexels-photo-952670.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    creator: 'Denis Villeneuve',
    description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.',
    rating: 4.7
  },
  {
    id: '2',
    title: 'The Bear',
    type: 'series',
    year: 2022,
    genre: ['Drama', 'Comedy'],
    imageUrl: 'https://images.pexels.com/photos/2878742/pexels-photo-2878742.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    creator: 'Christopher Storer',
    description: 'A young chef from the fine dining world returns to Chicago to run his family\'s sandwich shop.',
    rating: 4.8
  },
  {
    id: '3',
    title: 'After Hours',
    type: 'music',
    year: 2020,
    genre: ['R&B', 'Pop', 'Electronic'],
    imageUrl: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    creator: 'The Weeknd',
    description: 'The fourth studio album by Canadian singer The Weeknd.',
    rating: 4.5
  },
  {
    id: '4',
    title: 'Serial',
    type: 'podcast',
    year: 2014,
    genre: ['True Crime', 'Investigative Journalism'],
    imageUrl: 'https://images.pexels.com/photos/3945638/pexels-photo-3945638.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    creator: 'Sarah Koenig',
    description: 'A podcast investigating a true story over the course of a season.',
    rating: 4.6
  },
  {
    id: '5',
    title: 'Oppenheimer',
    type: 'film',
    year: 2023,
    genre: ['Biography', 'Drama', 'History'],
    imageUrl: 'https://images.pexels.com/photos/11172423/pexels-photo-11172423.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    creator: 'Christopher Nolan',
    description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.',
    rating: 4.9
  },
  {
    id: '6',
    title: 'The Last of Us',
    type: 'series',
    year: 2023,
    genre: ['Drama', 'Action', 'Adventure'],
    imageUrl: 'https://images.pexels.com/photos/15415219/pexels-photo-15415219.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    creator: 'Craig Mazin, Neil Druckmann',
    description: 'After a global pandemic destroys civilization, a hardened survivor takes charge of a 14-year-old girl who may be humanity\'s last hope.',
    rating: 4.7
  },
  {
    id: '7',
    title: 'The Story So Far',
    type: 'music',
    year: 2022,
    genre: ['Indie', 'Alternative', 'Rock'],
    imageUrl: 'https://images.pexels.com/photos/1619660/pexels-photo-1619660.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    creator: 'Indie Band',
    description: 'A compilation of songs telling the story of the band\'s journey.',
    rating: 4.3
  },
  {
    id: '8',
    title: 'This American Life',
    type: 'podcast',
    year: 1995,
    genre: ['Documentary', 'Storytelling'],
    imageUrl: 'https://images.pexels.com/photos/3207536/pexels-photo-3207536.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    creator: 'Ira Glass',
    description: 'A weekly public radio program and podcast featuring journalistic non-fiction and essay.',
    rating: 4.8
  }
];

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    username: 'cinephile93',
    profileImageUrl: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=600',
    bio: 'Passionné de cinéma et de séries. Critique amateur depuis 2010.',
    joinedAt: new Date('2023-01-15'),
    preferences: {
      favoriteGenres: ['Science Fiction', 'Drama', 'Thriller'],
      emotionalTags: ['Intense', 'Thought-provoking', 'Mind-bending']
    }
  },
  {
    id: '2',
    username: 'mélomane_moderne',
    profileImageUrl: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=600',
    bio: 'À la recherche de nouvelles musiques et podcasts tous les jours.',
    joinedAt: new Date('2023-02-28'),
    preferences: {
      favoriteGenres: ['Pop', 'Indie', 'True Crime'],
      emotionalTags: ['Energetic', 'Calming', 'Intriguing']
    }
  }
];

// Mock Reviews
export const mockReviews: Review[] = [
  {
    id: '1',
    contentId: '1',
    userId: '1',
    rating: 5,
    emoji: '🤯',
    keyword: 'Époustouflant',
    text: 'Une suite qui surpasse le premier film. La cinématographie est à couper le souffle et l\'intrigue captivante.',
    context: 'Vu au cinéma',
    hasSpoilers: false,
    isEphemeral: false,
    createdAt: new Date('2024-03-10')
  },
  {
    id: '2',
    contentId: '2',
    userId: '2',
    rating: 4,
    emoji: '🍽️',
    keyword: 'Addictif',
    text: 'On ressent presque le stress d\'une cuisine professionnelle. Personnages attachants.',
    context: 'Binge-watching du weekend',
    hasSpoilers: false,
    isEphemeral: true,
    expiresAt: new Date('2024-03-20'),
    createdAt: new Date('2024-03-13')
  },
  {
    id: '3',
    contentId: '3',
    userId: '2',
    rating: 5,
    emoji: '🎵',
    keyword: 'Hypnotique',
    text: 'Album parfait pour une soirée chill ou une longue route. "Blinding Lights" est transcendant.',
    audioUrl: '/mock-audio/review-3.mp3',
    context: 'Écouté en voiture',
    hasSpoilers: false,
    isEphemeral: false,
    createdAt: new Date('2024-02-25')
  },
  {
    id: '4',
    contentId: '4',
    userId: '1',
    rating: 4,
    emoji: '🔍',
    keyword: 'Captivant',
    text: 'Impossible de s\'arrêter d\'écouter une fois commencé. Narration excellente.',
    context: 'Pendant mes trajets quotidiens',
    hasSpoilers: false,
    isEphemeral: false,
    createdAt: new Date('2024-01-30')
  }
];

// Function to get content by type
export const getContentsByType = (type: ContentType): Content[] => {
  return mockContents.filter(content => content.type === type);
};

// Function to get content by ID
export const getContentById = (id: string): Content | undefined => {
  return mockContents.find(content => content.id === id);
};

// Function to get reviews by content ID
export const getReviewsByContentId = (contentId: string): Review[] => {
  return mockReviews.filter(review => review.contentId === contentId);
};

// Function to get user by ID
export const getUserById = (id: string): User | undefined => {
  return mockUsers.find(user => user.id === id);
};

// Function to search content by query
export const searchContents = (query: string, type?: ContentType): Content[] => {
  const normalizedQuery = query.toLowerCase();
  return mockContents.filter(content => {
    const matchesType = type ? content.type === type : true;
    const matchesTitle = content.title.toLowerCase().includes(normalizedQuery);
    const matchesGenre = content.genre.some(g => g.toLowerCase().includes(normalizedQuery));
    const matchesCreator = content.creator?.toLowerCase().includes(normalizedQuery);
    
    return matchesType && (matchesTitle || matchesGenre || matchesCreator);
  });
};