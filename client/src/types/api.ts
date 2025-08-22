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
  id: string;
  fullName: string;
  username: string;
  email: string;
  profileImage: string;
  provider: "local" | "google" | "github";
  premium: boolean;
  profileVisibility: "public" | "private" | "friends";
  isVerified: boolean;
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
  ownedLists: string[];
  friendRequestsReceived: string[];
  friendRequestsSent: string[];
  friends: string[];
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
  id: string;
  _id?: string;
  title: string;
  description?: string;
  tags: string[];
  visibility: "public" | "private" | "friends";
  owner: string | UserProfile;
  autoPermissions: {
    friends: "view" | "suggest" | "contribute";
    followers: "view" | "suggest" | "contribute";
    public: "view" | "suggest" | "contribute";
  };
  customPermissions: {
    user: string | UserProfile;
    level: "view" | "suggest" | "contribute" | "co-owner";
    grantedAt: string;
    grantedBy: string | UserProfile;
  }[];
  settings: {
    allowSuggestions: boolean;
    requireApprovalForSuggestions: boolean;
    notifyOnChanges: boolean;
    allowFollowerSuggestions: boolean;
  };
  coverImage?: string;
  destinations: string[];
  chat: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PopulatedTravelList
  extends Omit<TravelList, "owner" | "destinations"> {
  owner: UserProfile;
  customPermissions: {
    user: UserProfile;
    level: "view" | "suggest" | "contribute" | "co-owner";
    grantedAt: string;
    grantedBy: UserProfile;
  }[];
  destinations: Destination[];
}

export interface CreateTravelListData {
  title: string;
  description?: string;
  tags?: string[];
  visibility?: string;
  coverImage?: string;
}

export interface UpdateTravelListData {
  title?: string;
  description?: string;
  tags?: string[];
  isPublic?: boolean;
  coverImage?: string;
}

// List Invitation Types
export interface ListInvitation {
  _id: string;
  list: TravelList | string;
  inviter: UserProfile | string;
  invitee: UserProfile | string;
  permissionLevel: "view" | "suggest" | "contribute" | "co-owner";
  status: "pending" | "accepted" | "rejected" | "expired";
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateListInvitationData {
  list: string;
  inviter?: string;
  invitee?: string;
  permissionLevel: "view" | "suggest" | "contribute" | "co-owner";
}

// Destination Types
export interface Destination {
  id: string;
  name: string;
  location: string;
  notes?: string;
  images: string[];
  status: "Wishlist" | "Planned" | "Visited";
  dateVisited?: string;
  datePlanned?: string;
  list: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDestinationData {
  name: string;
  location: string;
  notes?: string;
  images?: string[];
  status?: "Wishlist" | "Planned" | "Visited";
  dateVisited?: string;
  datePlanned?: string;
  list: string;
}

export interface DestinationFormData {
  name: string;
  location: string;
  status: "wishlist" | "planned" | "visited";
  datePlanned?: string;
  dateVisited?: string;
  notes: string;
  images: File[];
}

// Journal Entry Types
export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  photos: string[];
  tags: string[];
  destination?: string;
  travelList?: string;
  author: {
    _id: string;
    fullName: string;
    username: string;
    profileImage: string;
  };
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  likes: [
    { _id: string; fullName: string; username: string; profileImage: string }
  ];
  comments: Comment[];
}

export interface JournalEntryCard {
  id: string;
  title: string;
  content: string;
  photos: string[];
  tags: string[];
  destination?: {
    _id: string;
    name: string;
    location: string;
    list: {
      _id: string;
      title: string;
    };
  };
  travelList?: string;
  author: {
    _id: string;
    fullName: string;
    username: string;
    profileImage: string;
  };
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  likes: string[];
  comments: Comment[];
}

export interface CreateJournalEntryData {
  author: string;
  title: string;
  content: string;
  images?: string[];
  destination?: string;
  public?: boolean;
}

// Comment Types
export interface Comment {
  id: string;
  author: {
    _id: string;
    fullName: string;
    username: string;
    profileImage: string;
  };
  content: string;
  photos: string[];
  likes: string[];
  journalEntry: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommentData {
  content: string;
  photos?: string[];
  journalEntry: string;
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
