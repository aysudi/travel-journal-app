// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

// User Types
export interface UserProfile {
  _id: string;
  fullName: string;
  username: string;
  email: string;
  profileImage: string;
  provider: "local" | "google" | "github";
  status: "Viewer" | "Editor" | "Owner";
  premium: boolean;
  profileVisibility: "public" | "private";
  isVerified: boolean;
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
  ownedLists: string[];
  collaboratingLists: string[];
}

export interface UpdateProfileData {
  fullName?: string;
  username?: string;
  profileVisibility?: "public" | "private";
  profileImage?: string | File;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Travel List Types
export interface TravelList {
  _id: string;
  title: string;
  description?: string;
  tags: string[];
  isPublic: boolean;
  owner: string;
  collaborators: string[];
  coverImage?: string;
  destinations: string[];
  chat: string[];
  createdAt: string;
  updatedAt: string;
}

// Populated Travel List (when owner and collaborators are populated)
export interface PopulatedTravelList
  extends Omit<TravelList, "owner" | "collaborators" | "destinations"> {
  owner: UserProfile;
  collaborators: UserProfile[];
  destinations: Destination[];
}

export interface CreateTravelListData {
  title: string;
  description?: string;
  tags?: string[];
  isPublic?: boolean;
  coverImage?: string;
}

export interface UpdateTravelListData {
  title?: string;
  description?: string;
  tags?: string[];
  isPublic?: boolean;
  coverImage?: string;
}

// Destination Types
export interface Destination {
  _id: string;
  name: string;
  description?: string;
  location: {
    coordinates: [number, number];
    address?: string;
    city?: string;
    country?: string;
  };
  images: string[];
  visitedDate?: string;
  rating?: number;
  notes?: string;
  travelList: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDestinationData {
  name: string;
  description?: string;
  location: {
    coordinates: [number, number];
    address?: string;
    city?: string;
    country?: string;
  };
  images?: string[];
  visitedDate?: string;
  rating?: number;
  notes?: string;
  travelList: string;
}

// Journal Entry Types
export interface JournalEntry {
  _id: string;
  title: string;
  content: string;
  images: string[];
  tags: string[];
  destination?: string;
  travelList?: string;
  author: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateJournalEntryData {
  title: string;
  content: string;
  images?: string[];
  tags?: string[];
  destination?: string;
  travelList?: string;
  isPublic?: boolean;
}

// Auth Types
export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  fullName: string;
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  token: string;
}

// Pagination Types
export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  order?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
