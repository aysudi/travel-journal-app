import { apiConfig } from "./apiConfig";

export class MessageService {
  private readonly endpoint = "/messages";

  async getAllMessages() {
    const url = `${this.endpoint}/all`;
    return apiConfig.request(url);
  }

  async getMessagesByChat(
    chatId: string,
    params?: { userId?: string; page?: number; limit?: number }
  ) {
    let url = `${this.endpoint}/chat/${chatId}`;
    const query: string[] = [];
    if (params?.userId) query.push(`userId=${params.userId}`);
    if (params?.page) query.push(`page=${params.page}`);
    if (params?.limit) query.push(`limit=${params.limit}`);
    if (query.length) url += `?${query.join("&")}`;
    return apiConfig.request(url);
  }

  async createMessage(data: any) {
    return apiConfig.request(this.endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateMessage(id: string, data: any) {
    return apiConfig.request(`${this.endpoint}/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async markMessageAsRead(messageId: string, data: any) {
    return apiConfig.request(`${this.endpoint}/${messageId}/read`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async deleteMessage(id: string): Promise<{ message: string }> {
    return apiConfig.request<{ message: string }>(`${this.endpoint}/${id}`, {
      method: "DELETE",
    });
  }
}
