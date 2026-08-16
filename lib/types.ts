// export type UserPreferences = {
//     budget: number;
//     maxDistance: number;
//     openNow: boolean;
//     priority: "overall" | "budget" | "quality" | "distance";
//     userLat?: number;
//     userLng?: number;
// };

// export type Business = {
//     id: string;
//     name: string;
//     address: string;
//     rating: number;
//     userRatingCount: number;
//     priceLevel: string;
//     priceValue: number;
//     latitude: number;
//     longitude: number;
//     openNow: boolean | null;
//     googleMapsUri: string;
//     websiteUri?: string;
//     phone?: string;
//     types: string[];
//     matchScore: number;
//     matchReasons: string[];
//     estimatedPrice: string;
// };

export interface Business {
    id: string;

    name: string;

    address: string;

    rating: number;

    userRatingCount: number;

    latitude: number;

    longitude: number;

    distanceKm?: number;

    openNow: boolean | null;

    websiteUri?: string;

    phone?: string;

    googleMapsUri?: string;

    types: string[];

    matchScore: number;

    matchReasons: string[];

    estimatedPrice?: string;

    priceValue?: number | null;
}

export interface UserPreferences {
    budget: number;

    maxDistance: number;

    openNow: boolean;

    priority: string;

    userLat?: number;

    userLng?: number;
}