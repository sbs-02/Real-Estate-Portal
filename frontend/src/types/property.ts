export interface Property {
  _id: string;
  title: string;
  description: string;
  price: number;
  location: {
    city: string;
    state: string;
  };
  images: string[];
  bedrooms: number;
  bathrooms: number;
  area: number;
  propertyType: string;
  listingType: 'sale' | 'rent';
}

export interface PropertiesResponse {
  properties: Property[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
