import { apiConfig } from "./apiConfig";

export interface Friend {
  id: string;
  fullName: string;
  username: string;
  profileImage: string;
  isVerified: boolean;
}

export interface FriendRequest {
  from: Friend;
  to: Friend;
  sentAt: string;
}

export interface FriendsData {
  friends: Friend[];
  friendRequestsReceived: FriendRequest[];
  friendRequestsSent: FriendRequest[];
}

export interface SearchResult extends Friend {
  profileVisibility: "public" | "private";
  isFriend: boolean;
  hasRequestPending: boolean;
  hasReceivedRequest: boolean;
}

class FriendsService {
  async getUserFriends(): Promise<FriendsData> {
    return apiConfig.request<FriendsData>("/auth/friends");
  }

  async sendFriendRequest(targetUserId: string): Promise<void> {
    await apiConfig.request<void>("/auth/friends/request", {
      method: "POST",
      body: JSON.stringify({ targetUserId }),
    });
  }

  async acceptFriendRequest(fromUserId: string): Promise<void> {
    await apiConfig.request<void>("/auth/friends/accept", {
      method: "POST",
      body: JSON.stringify({ fromUserId }),
    });
  }

  async rejectFriendRequest(fromUserId: string): Promise<void> {
    await apiConfig.request<void>("/auth/friends/reject", {
      method: "POST",
      body: JSON.stringify({ fromUserId }),
    });
  }

  async removeFriend(friendId: string): Promise<void> {
    await apiConfig.request<void>(`/auth/friends/${friendId}`, {
      method: "DELETE",
    });
  }

  async searchUsers(query: string): Promise<SearchResult[]> {
    if (!query || query.trim().length < 2) {
      return [];
    }

    return apiConfig.request<SearchResult[]>(
      `/auth/friends/search?query=${encodeURIComponent(query)}`
    );
  }
}

export const friendsService = new FriendsService();
