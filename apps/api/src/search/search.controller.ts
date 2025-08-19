import { Controller, Get, Query } from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { Public } from "../common";
import { SearchService } from "./search.service";

@ApiTags("Search")
@Controller("search")
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: "Global search across professionals and services" })
  @ApiQuery({ name: "q", required: true, description: "Search query" })
  @ApiQuery({
    name: "type",
    required: false,
    enum: ["all", "professionals", "services"],
  })
  @ApiQuery({ name: "location", required: false })
  @ApiQuery({ name: "category", required: false })
  search(
    @Query("q") query: string,
    @Query("type") type: string = "all",
    @Query("location") location?: string,
    @Query("category") category?: string
  ) {
    return this.searchService.search({ query, type, location, category });
  }

  @Get("suggestions")
  @Public()
  @ApiOperation({ summary: "Get search suggestions" })
  @ApiQuery({ name: "q", required: true })
  getSuggestions(@Query("q") query: string) {
    return this.searchService.getSuggestions(query);
  }
}
