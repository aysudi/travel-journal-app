export interface JournalEntryData {
  title: string;
  content: string;
  photos?: string[];
  destination: string;
  public?: boolean;
}

export interface JournalEntryUpdateData {
  title?: string;
  content?: string;
  photos?: string[];
  public?: boolean;
}

export interface JournalEntryQuery {
  page?: number;
  limit?: number;
  destination?: string;
  author?: string;
  public?: boolean;
  search?: string;
  sort?: string;
  order?: "asc" | "desc";
}

export interface PaginatedJournalEntries {
  data: any[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
