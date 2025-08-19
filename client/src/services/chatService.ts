import { apiConfig } from "./apiConfig";

export class ChatService {
  private readonly endpoint = "/chats";

  async getChats() {
    const url = `${this.endpoint}/all`;

    return apiConfig.request(url);
  }

  async getCurrentUserChats(userId: string) {
    return apiConfig.request(`${this.endpoint}?userId=${userId}`);
  }

  async getOrCreateChatByListId(listId: string, userId: string) {
    return apiConfig.request(
      `${this.endpoint}/by-list?listId=${listId}&userId=${userId}`
    );
  }

  async createChat(data: any) {
    return apiConfig.request(this.endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateChat(id: string, data: any) {
    return apiConfig.request(`${this.endpoint}/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async deleteChat(id: string): Promise<{ message: string }> {
    return apiConfig.request<{ message: string }>(`${this.endpoint}/${id}`, {
      method: "DELETE",
    });
  }
}
