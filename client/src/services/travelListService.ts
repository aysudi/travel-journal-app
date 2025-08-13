import { apiConfig } from "./apiConfig";
import type {
  TravelList,
  CreateTravelListData,
  UpdateTravelListData,
  PaginatedResponse,
  PaginationParams,
} from "../types/api";

export class TravelListService {
  private readonly endpoint = "/travel-lists";

  async getTravelLists(
    params?: PaginationParams
  ): Promise<PaginatedResponse<TravelList>> {
    const searchParams = new URLSearchParams();

    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.search) searchParams.append("search", params.search);
    if (params?.sort) searchParams.append("sort", params.sort);
    if (params?.order) searchParams.append("order", params.order);

    const query = searchParams.toString();
    const url = query ? `${this.endpoint}?${query}` : `${this.endpoint}`;

    return apiConfig.request<PaginatedResponse<TravelList>>(url);
  }

  async getTravelListById(id: string): Promise<TravelList> {
    return apiConfig.request<TravelList>(`${this.endpoint}/${id}`);
  }

  async createTravelList(data: CreateTravelListData): Promise<TravelList> {
    return apiConfig.request<TravelList>(this.endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateTravelList(
    id: string,
    data: UpdateTravelListData
  ): Promise<TravelList> {
    return apiConfig.request<TravelList>(`${this.endpoint}/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteTravelList(id: string): Promise<{ message: string }> {
    return apiConfig.request<{ message: string }>(`${this.endpoint}/${id}`, {
      method: "DELETE",
    });
  }

  async addCollaborator(listId: string, userId: string): Promise<TravelList> {
    return apiConfig.request<TravelList>(
      `${this.endpoint}/${listId}/collaborators`,
      {
        method: "POST",
        body: JSON.stringify({ userId }),
      }
    );
  }

  async removeCollaborator(
    listId: string,
    userId: string
  ): Promise<TravelList> {
    return apiConfig.request<TravelList>(
      `${this.endpoint}/${listId}/collaborators/${userId}`,
      {
        method: "DELETE",
      }
    );
  }

  async getOwnedLists(): Promise<TravelList[]> {
    return apiConfig.request<TravelList[]>(`${this.endpoint}/owned`);
  }

  async getCollaboratingLists(): Promise<TravelList[]> {
    return apiConfig.request<TravelList[]>(`${this.endpoint}/collaborating`);
  }

  async getFriendsLists(limit?: number): Promise<TravelList[]> {
    const query = limit ? `?limit=${limit}` : "";
    return apiConfig.request<TravelList[]>(`${this.endpoint}/friends${query}`);
  }

  async getPublicLists(params?: PaginationParams): Promise<TravelList[]> {
    const searchParams = new URLSearchParams();

    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.search) searchParams.append("search", params.search);
    if (params?.sort) searchParams.append("sort", params.sort);
    if (params?.order) searchParams.append("order", params.order);

    const query = searchParams.toString();
    const url = query
      ? `${this.endpoint}/public?${query}`
      : `${this.endpoint}/public`;

    return apiConfig.request<TravelList[]>(url);
  }

  async uploadCoverImage(
    listId: string,
    file: File
  ): Promise<{ coverImage: string }> {
    const formData = new FormData();
    formData.append("coverImage", file);

    return apiConfig.request<{ coverImage: string }>(
      `${this.endpoint}/${listId}/cover-image`,
      {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${apiConfig.getToken()}`,
        },
      }
    );
  }

  async duplicateList(listId: string): Promise<TravelList> {
    return apiConfig.request<TravelList>(
      `${this.endpoint}/${listId}/duplicate`,
      {
        method: "POST",
      }
    );
  }
}

export const travelListService = new TravelListService();
