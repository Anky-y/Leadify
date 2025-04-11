export interface CrmLead {
  id: string
  name: string
  platform: string
  followers: number
  engagement: number
  language: string
  category: string
  email: string | null
  social: {
    discord?: string
    twitter?: string
    facebook?: string
    instagram?: string
  }
  url: string
  sequenceStatus: string
  stage: string
  replied: boolean
  classification: string
  dateAdded: string
}
