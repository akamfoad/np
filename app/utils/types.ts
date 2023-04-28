export interface PublisherType {
  username: string
  email: string
}

export interface TransformedPublisherType extends PublisherType {
  initials: string
  gravatarId: string
}

export interface PackageType {
  name: string
  description: string
  keywords?: string[]
  publisher: PublisherType
  version: string
  date: string
}

export interface TransformedPackageType extends PackageType {
  publisher: TransformedPublisherType
}

export interface SearchResponse {
  objects: { package: PackageType }[]
  total: number
}
