export interface TwitchData {
  id: string;
  username: string;
  followers: number;
  viewer_count: number;
  language: string;
  game_name: string;
  channel_id: string;
  channel_url: string;
  subscriber_count?: string;
  gmail?: string;
  twitter?: string;
  youtube?: string;
  instagram?: string;
  discord?: string;
  facebook?: string;
  folder_id?: string; // Better to reference folder by ID
  saved_at?: string; // Timestamp when the streamer was saved
  is_favourite?: boolean;
}

export interface FilterValues {
  searchTerm: string;
  language: string;
  category: string;
  minFollowers: number;
  maxFollowers: number;
  minViewers: number;
  maxViewers: number;
}

export interface SavedSearch {
  id: string;
  name: string;
  filters: FilterValues;
}

export interface ScrapingProgress {
  Stage: number; // Current stage (1-4)
  Rate?: number; // Items per second (if applicable to stage)
  ETA: string; // Estimated time remaining
  Streamers: number; // Total number of streamers to process
  Completed: number; // Number of streamers processed so far
  Percentage: number; // Completion percentage (0-100)
  done: boolean; // Whether the scraping is complete
  Total_Streamers: number;
  search_id: string;
  download_url: string;
}

export interface Streamer {
  username: string;
  followers: number;
  viewers: number;
  language: string;
  category: string;
}
export type Folder = {
  id: string;
  user_id: string;
  name: string;
  is_mandatory: boolean; // true for "All" and "Favourites"
  created_at: string;
  streamer_count?: number;
};
