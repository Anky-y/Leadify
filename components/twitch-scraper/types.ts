export interface TwitchData {
  id: string
  username: string
  channelUrl: string
  followers: number
  viewers: number
  language: string
  category: string
  discord: string
  youtube: string
  twitter: string
  facebook: string
  instagram: string
  email: string
}

export interface FilterValues {
  searchTerm: string
  language: string
  category: string
  minFollowers: number
  maxFollowers: number
  minViewers: number
  maxViewers: number
}
