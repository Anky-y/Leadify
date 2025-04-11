export interface YouTubeData {
  id: string
  channelName: string
  channelUrl: string
  subscribers: number
  averageViews: number
  language: string
  category: string
  uploadFrequency: string
  discord: string
  twitter: string
  facebook: string
  instagram: string
  email: string
}

export interface FilterValues {
  searchTerm: string
  language: string
  category: string
  minSubscribers: number
  maxSubscribers: number
  minViews: number
  maxViews: number
  uploadFrequency: string
}

export interface SavedSearch {
  id: string
  name: string
  filters: FilterValues
}
