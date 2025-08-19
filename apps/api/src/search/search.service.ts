import { Injectable } from "@nestjs/common";

@Injectable()
export class SearchService {
  search(params: {
    query: string;
    type: string;
    location?: string;
    category?: string;
  }) {
    return {
      message: "Search results",
      data: {
        professionals: [],
        services: [],
        total: 0,
      },
      params,
    };
  }

  getSuggestions(query: string) {
    return {
      message: "Search suggestions",
      data: {
        professionals: [],
        services: [],
        categories: [],
      },
      query,
    };
  }
}
