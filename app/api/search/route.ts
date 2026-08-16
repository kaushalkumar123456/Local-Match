// // import { NextRequest, NextResponse } from "next/server";
// // import { Business, UserPreferences } from "@/lib/types";
// // import { calculateMatchScore, distanceInKm } from "@/lib/matchScore";

// // const GOOGLE_PLACES_URL =
// //     "https://places.googleapis.com/v1/places:searchText";

// // function getPriceValue(priceLevel?: string): number {
// //     switch (priceLevel) {
// //         case "PRICE_LEVEL_FREE":
// //             return 0;

// //         case "PRICE_LEVEL_INEXPENSIVE":
// //             return 300;

// //         case "PRICE_LEVEL_MODERATE":
// //             return 700;

// //         case "PRICE_LEVEL_EXPENSIVE":
// //             return 1500;

// //         case "PRICE_LEVEL_VERY_EXPENSIVE":
// //             return 3000;

// //         default:
// //             return 700;
// //     }
// // }

// // function getPriceText(priceLevel?: string): string {
// //     switch (priceLevel) {
// //         case "PRICE_LEVEL_FREE":
// //             return "Free";

// //         case "PRICE_LEVEL_INEXPENSIVE":
// //             return "₹";

// //         case "PRICE_LEVEL_MODERATE":
// //             return "₹₹";

// //         case "PRICE_LEVEL_EXPENSIVE":
// //             return "₹₹₹";

// //         case "PRICE_LEVEL_VERY_EXPENSIVE":
// //             return "₹₹₹₹";

// //         default:
// //             return "Price not available";
// //     }
// // }

// // export async function POST(request: NextRequest) {
// //     try {
// //         const body = await request.json();

// //         const query = String(body.query || "").trim();

// //         const preferences: UserPreferences = {
// //             budget: Number(body.budget || 1000),
// //             maxDistance: Number(body.maxDistance || 5),
// //             openNow: Boolean(body.openNow),
// //             priority: body.priority || "overall",
// //             userLat:
// //                 body.latitude !== undefined
// //                     ? Number(body.latitude)
// //                     : undefined,
// //             userLng:
// //                 body.longitude !== undefined
// //                     ? Number(body.longitude)
// //                     : undefined,
// //         };

// //         if (!query) {
// //             return NextResponse.json(
// //                 {
// //                     error: "Please enter what you are looking for.",
// //                 },
// //                 { status: 400 }
// //             );
// //         }

// //         const apiKey = process.env.GOOGLE_PLACES_API_KEY;

// //         if (!apiKey) {
// //             return NextResponse.json(
// //                 {
// //                     error:
// //                         "Google Places API key is missing. Add GOOGLE_PLACES_API_KEY to .env.local.",
// //                 },
// //                 { status: 500 }
// //             );
// //         }

// //         let textQuery = query;

// //         if (
// //             preferences.userLat !== undefined &&
// //             preferences.userLng !== undefined
// //         ) {
// //             textQuery = `${query} near ${preferences.userLat},${preferences.userLng}`;
// //         }

// //         const requestBody: Record<string, unknown> = {
// //             textQuery,
// //             pageSize: 20,
// //         };

// //         if (preferences.openNow) {
// //             requestBody.openNow = true;
// //         }

// //         if (
// //             preferences.userLat !== undefined &&
// //             preferences.userLng !== undefined
// //         ) {
// //             requestBody.locationBias = {
// //                 circle: {
// //                     center: {
// //                         latitude: preferences.userLat,
// //                         longitude: preferences.userLng,
// //                     },
// //                     radius: preferences.maxDistance * 1000,
// //                 },
// //             };
// //         }

// //         const googleResponse = await fetch(GOOGLE_PLACES_URL, {
// //             method: "POST",
// //             headers: {
// //                 "Content-Type": "application/json",
// //                 "X-Goog-Api-Key": apiKey,
// //                 "X-Goog-FieldMask":
// //                     "places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.priceLevel,places.currentOpeningHours,places.googleMapsUri,places.websiteUri,places.nationalPhoneNumber,places.types",
// //             },
// //             body: JSON.stringify(requestBody),
// //             cache: "no-store",
// //         });

// //         if (!googleResponse.ok) {
// //             const errorText = await googleResponse.text();

// //             console.error("Google Places error:", errorText);

// //             return NextResponse.json(
// //                 {
// //                     error:
// //                         "Google Places could not complete the search. Check your API key and enabled APIs.",
// //                 },
// //                 { status: googleResponse.status }
// //             );
// //         }

// //         const googleData = await googleResponse.json();

// //         const places = googleData.places || [];

// //         const businesses: Business[] = places
// //             .map((place: any) => {
// //                 const latitude = place.location?.latitude || 0;
// //                 const longitude = place.location?.longitude || 0;

// //                 const business: Business = {
// //                     id: place.id,
// //                     name: place.displayName?.text || "Unnamed Business",
// //                     address: place.formattedAddress || "Address unavailable",
// //                     rating: place.rating || 0,
// //                     userRatingCount: place.userRatingCount || 0,
// //                     priceLevel: place.priceLevel || "PRICE_LEVEL_UNSPECIFIED",
// //                     priceValue: getPriceValue(place.priceLevel),
// //                     latitude,
// //                     longitude,
// //                     openNow:
// //                         place.currentOpeningHours?.openNow !== undefined
// //                             ? place.currentOpeningHours.openNow
// //                             : null,
// //                     googleMapsUri:
// //                         place.googleMapsUri ||
// //                         `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
// //                             place.displayName?.text || ""
// //                         )}`,
// //                     websiteUri: place.websiteUri,
// //                     phone: place.nationalPhoneNumber,
// //                     types: place.types || [],
// //                     matchScore: 0,
// //                     matchReasons: [],
// //                     estimatedPrice: getPriceText(place.priceLevel),
// //                 };

// //                 const score = calculateMatchScore(
// //                     business,
// //                     preferences
// //                 );

// //                 business.matchScore = score;

// //                 if (score >= 85) {
// //                     business.matchReasons.push("Strong overall match");
// //                 }

// //                 return business;
// //             })
// //             .filter((business: Business) => {
// //                 if (
// //                     preferences.userLat === undefined ||
// //                     preferences.userLng === undefined
// //                 ) {
// //                     return true;
// //                 }

// //                 const distance = distanceInKm(
// //                     preferences.userLat,
// //                     preferences.userLng,
// //                     business.latitude,
// //                     business.longitude
// //                 );

// //                 return distance <= preferences.maxDistance;
// //             })
// //             .sort((a: Business, b: Business) => {
// //                 return b.matchScore - a.matchScore;
// //             });

// //         return NextResponse.json({
// //             businesses,
// //             count: businesses.length,
// //         });
// //     } catch (error) {
// //         console.error(error);

// //         return NextResponse.json(
// //             {
// //                 error: "Something went wrong while searching.",
// //             },
// //             { status: 500 }
// //         );
// //     }
// // }




// import { NextRequest, NextResponse } from "next/server";
// import { Business, UserPreferences } from "@/lib/types";
// import { calculateMatchScore } from "@/lib/matchScore";

// const GEOAPIFY_PLACES_URL =
//     "https://api.geoapify.com/v2/places";

// function getPriceValue(
//     categories: string[]
// ): number {
//     const text = categories.join(" ").toLowerCase();

//     if (
//         text.includes("fast_food") ||
//         text.includes("cafe")
//     ) {
//         return 300;
//     }

//     if (
//         text.includes("restaurant") ||
//         text.includes("food")
//     ) {
//         return 700;
//     }

//     return 500;
// }

// export async function POST(
//     request: NextRequest
// ) {
//     try {
//         const body = await request.json();

//         const query = String(
//             body.query || ""
//         ).trim();

//         const latitude = Number(body.latitude);
//         const longitude = Number(body.longitude);

//         const preferences: UserPreferences = {
//             budget: Number(
//                 body.budget || 1000
//             ),

//             maxDistance: Number(
//                 body.maxDistance || 5
//             ),

//             openNow: Boolean(
//                 body.openNow
//             ),

//             priority:
//                 body.priority || "overall",

//             userLat:
//                 Number.isFinite(latitude)
//                     ? latitude
//                     : undefined,

//             userLng:
//                 Number.isFinite(longitude)
//                     ? longitude
//                     : undefined,
//         };

//         if (!query) {
//             return NextResponse.json(
//                 {
//                     error:
//                         "Please enter what you are looking for.",
//                 },
//                 { status: 400 }
//             );
//         }

//         if (
//             !Number.isFinite(latitude) ||
//             !Number.isFinite(longitude)
//         ) {
//             return NextResponse.json(
//                 {
//                     error:
//                         "Please allow location access.",
//                 },
//                 { status: 400 }
//             );
//         }

//         const apiKey =
//             process.env.GEOAPIFY_API_KEY;

//         if (!apiKey) {
//             return NextResponse.json(
//                 {
//                     error:
//                         "GEOAPIFY_API_KEY is missing from .env.local",
//                 },
//                 { status: 500 }
//             );
//         }

//         const radius =
//             preferences.maxDistance * 1000;

//         const url =
//             new URL(
//                 GEOAPIFY_PLACES_URL
//             );

//         url.searchParams.set(
//             "categories",
//             "commercial,service,catering,healthcare"
//         );

//         url.searchParams.set(
//             "filter",
//             `circle:${longitude},${latitude},${radius}`
//         );

//         url.searchParams.set(
//             "bias",
//             `proximity:${longitude},${latitude}`
//         );

//         url.searchParams.set(
//             "limit",
//             "20"
//         );

//         url.searchParams.set(
//             "apiKey",
//             apiKey
//         );

//         const response =
//             await fetch(url.toString(), {
//                 method: "GET",
//                 cache: "no-store",
//             });

//         if (!response.ok) {
//             const errorText =
//                 await response.text();

//             console.error(
//                 "Geoapify error:",
//                 errorText
//             );

//             return NextResponse.json(
//                 {
//                     error:
//                         "Geoapify search failed. Check your API key.",
//                 },
//                 { status: response.status }
//             );
//         }

//         const data =
//             await response.json();

//         const features =
//             data.features || [];

//         const searchText =
//             query.toLowerCase();

//         const businesses: Business[] =
//             features
//                 .map((feature: any) => {
//                     const properties =
//                         feature.properties || {};

//                     const categories =
//                         properties.categories || [];

//                     const name =
//                         properties.name ||
//                         "Unnamed Business";

//                     const address =
//                         properties.formatted ||
//                         "Address unavailable";

//                     const latitude =
//                         properties.lat;

//                     const longitude =
//                         properties.lon;

//                     const priceValue =
//                         getPriceValue(categories);

//                     const business: Business = {
//                         id:
//                             properties.place_id ||
//                             `${latitude}-${longitude}-${name}`,

//                         name,

//                         address,

//                         rating:
//                             Number(
//                                 properties.rating?.value ||
//                                 properties.rating ||
//                                 0
//                             ),

//                         userRatingCount:
//                             Number(
//                                 properties.rating?.count ||
//                                 0
//                             ),

//                         priceLevel:
//                             "PRICE_LEVEL_UNSPECIFIED",

//                         priceValue,

//                         latitude,

//                         longitude,

//                         openNow:
//                             properties.opening_hours?.open_now ??
//                             null,

//                         googleMapsUri:
//                             `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}`,

//                         websiteUri:
//                             properties.website,

//                         phone:
//                             properties.contact?.phone,

//                         types:
//                             categories,

//                         matchScore: 0,

//                         matchReasons: [],

//                         estimatedPrice:
//                             `₹${priceValue}`,
//                     };

//                     const score =
//                         calculateMatchScore(
//                             business,
//                             preferences
//                         );

//                     business.matchScore =
//                         score;

//                     if (
//                         name
//                             .toLowerCase()
//                             .includes(searchText)
//                     ) {
//                         business.matchReasons.push(
//                             "Matches your search"
//                         );
//                     }

//                     if (
//                         business.rating >= 4.5
//                     ) {
//                         business.matchReasons.push(
//                             "Excellent customer rating"
//                         );
//                     } else if (
//                         business.rating >= 4
//                     ) {
//                         business.matchReasons.push(
//                             "Good customer rating"
//                         );
//                     }

//                     if (
//                         business.priceValue <=
//                         preferences.budget
//                     ) {
//                         business.matchReasons.push(
//                             "Fits your budget"
//                         );
//                     }

//                     if (
//                         business.openNow === true
//                     ) {
//                         business.matchReasons.push(
//                             "Open now"
//                         );
//                     }

//                     if (
//                         score >= 85
//                     ) {
//                         business.matchReasons.push(
//                             "Strong overall match"
//                         );
//                     }

//                     return business;
//                 })
//                 .filter(
//                     (business: Business) =>
//                         business.name !==
//                         "Unnamed Business"
//                 )
//                 .sort(
//                     (
//                         a: Business,
//                         b: Business
//                     ) =>
//                         b.matchScore -
//                         a.matchScore
//                 );

//         return NextResponse.json({
//             businesses,
//             count:
//                 businesses.length,
//         });
//     } catch (error) {
//         console.error(error);

//         return NextResponse.json(
//             {
//                 error:
//                     "Something went wrong while searching.",
//             },
//             { status: 500 }
//         );
//     }
// }

import { NextRequest, NextResponse } from "next/server";

import {
    Business,
    UserPreferences,
} from "@/lib/types";

import {
    calculateMatchScore,
} from "@/lib/matchScore";

const GEOAPIFY_URL =
    "https://api.geoapify.com/v2/places";

/* =========================================================
   NORMALIZE USER QUERY
========================================================= */

function normalizeQuery(
    query: string
) {
    return query
        .toLowerCase()
        .replace(/[^\w\s₹]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

/* =========================================================
   DETECT BUSINESS CATEGORY
========================================================= */

function getCategoryFromQuery(
    query: string
) {
    const text =
        normalizeQuery(query);

    /*
     * SALON
     */

    if (
        text.includes("salon") ||
        text.includes("saloon") ||
        text.includes("hair salon") ||
        text.includes("haircut") ||
        text.includes("hair cut") ||
        text.includes("barber") ||
        text.includes("beauty salon") ||
        text.includes("beauty parlour") ||
        text.includes("beauty parlor") ||
        text.includes("parlour") ||
        text.includes("parlor")
    ) {
        return {
            key: "salon",
            label: "salons",
            geoapifyCategory:
                "service.beauty.hairdresser",
        };
    }

    /*
     * RESTAURANT
     */

    if (
        text.includes("restaurant") ||
        text.includes("resturant") ||
        text.includes("food") ||
        text.includes("dinner") ||
        text.includes("lunch")
    ) {
        return {
            key: "restaurant",
            label: "restaurants",
            geoapifyCategory:
                "catering.restaurant",
        };
    }

    /*
     * CAFE
     */

    if (
        text.includes("cafe") ||
        text.includes("coffee shop") ||
        text.includes("coffee")
    ) {
        return {
            key: "cafe",
            label: "cafes",
            geoapifyCategory:
                "catering.cafe",
        };
    }

    /*
     * GROCERY
     */

    if (
        text.includes("grocery") ||
        text.includes("groceries") ||
        text.includes("grocery store") ||
        text.includes("supermarket")
    ) {
        return {
            key: "grocery",
            label: "grocery stores",
            geoapifyCategory:
                "commercial.supermarket",
        };
    }

    /*
     * PHARMACY
     */

    if (
        text.includes("pharmacy") ||
        text.includes("medical store") ||
        text.includes("medicine shop") ||
        text.includes("chemist")
    ) {
        return {
            key: "pharmacy",
            label: "pharmacies",
            geoapifyCategory:
                "healthcare.pharmacy",
        };
    }

    /*
     * BAKERY
     */

    if (
        text.includes("bakery") ||
        text.includes("cake shop")
    ) {
        return {
            key: "bakery",
            label: "bakeries",
            geoapifyCategory:
                "commercial.food_and_drink.bakery",
        };
    }

    /*
     * LAUNDRY
     */

    if (
        text.includes("laundry") ||
        text.includes("dry cleaner") ||
        text.includes("dry cleaning")
    ) {
        return {
            key: "laundry",
            label: "laundries",
            geoapifyCategory:
                "service.cleaning.laundry",
        };
    }

    /*
     * GYM
     */

    if (
        text.includes("gym") ||
        text.includes("fitness") ||
        text.includes("fitness center") ||
        text.includes("fitness centre")
    ) {
        return {
            key: "gym",
            label: "gyms",
            geoapifyCategory:
                "sport.fitness.gym",
        };
    }

    /*
     * TAILOR
     */

    if (
        text.includes("tailor") ||
        text.includes("tailoring")
    ) {
        return {
            key: "tailor",
            label: "tailors",
            geoapifyCategory:
                "service.tailor",
        };
    }

    /*
     * No category detected.
     *
     * IMPORTANT:
     * We DO NOT use "commercial"
     * or another broad fallback.
     */

    return null;
}

/* =========================================================
   STRICT CATEGORY VALIDATION
========================================================= */

function isCorrectCategory(
    categories: string[],
    categoryKey: string
): boolean {
    if (
        !Array.isArray(categories) ||
        categories.length === 0
    ) {
        return false;
    }

    /*
     * SALON
     */

    if (
        categoryKey === "salon"
    ) {
        return categories.some(
            (category) =>
                category ===
                "service.beauty.hairdresser" ||
                category.startsWith(
                    "service.beauty.hairdresser."
                )
        );
    }

    /*
     * RESTAURANT
     */

    if (
        categoryKey === "restaurant"
    ) {
        return categories.some(
            (category) =>
                category ===
                "catering.restaurant" ||
                category.startsWith(
                    "catering.restaurant."
                )
        );
    }

    /*
     * CAFE
     */

    if (
        categoryKey === "cafe"
    ) {
        return categories.some(
            (category) =>
                category ===
                "catering.cafe" ||
                category.startsWith(
                    "catering.cafe."
                )
        );
    }

    /*
     * GROCERY
     */

    if (
        categoryKey === "grocery"
    ) {
        return categories.some(
            (category) =>
                category ===
                "commercial.supermarket" ||
                category.startsWith(
                    "commercial.supermarket."
                )
        );
    }

    /*
     * PHARMACY
     */

    if (
        categoryKey === "pharmacy"
    ) {
        return categories.some(
            (category) =>
                category ===
                "healthcare.pharmacy" ||
                category.startsWith(
                    "healthcare.pharmacy."
                )
        );
    }

    /*
     * BAKERY
     */

    if (
        categoryKey === "bakery"
    ) {
        return categories.some(
            (category) =>
                category ===
                "commercial.food_and_drink.bakery" ||
                category.startsWith(
                    "commercial.food_and_drink.bakery."
                )
        );
    }

    /*
     * LAUNDRY
     */

    if (
        categoryKey === "laundry"
    ) {
        return categories.some(
            (category) =>
                category ===
                "service.cleaning.laundry" ||
                category.startsWith(
                    "service.cleaning.laundry."
                )
        );
    }

    /*
     * GYM
     */

    if (
        categoryKey === "gym"
    ) {
        return categories.some(
            (category) =>
                category ===
                "sport.fitness.gym" ||
                category.startsWith(
                    "sport.fitness.gym."
                )
        );
    }

    /*
     * TAILOR
     */

    if (
        categoryKey === "tailor"
    ) {
        return categories.some(
            (category) =>
                category ===
                "service.tailor" ||
                category.startsWith(
                    "service.tailor."
                )
        );
    }

    return false;
}

/* =========================================================
   EXTRACT BUDGET FROM USER QUERY
========================================================= */

function extractBudget(
    query: string,
    fallback: number
) {
    const text =
        query.toLowerCase();

    const match =
        text.match(
            /(?:₹|rs\.?|inr)?\s*(\d{2,6})/
        );

    if (!match) {
        return fallback;
    }

    const value =
        Number(match[1]);

    if (
        !Number.isFinite(value)
    ) {
        return fallback;
    }

    return value;
}

/* =========================================================
   EXTRACT DISTANCE FROM USER QUERY
========================================================= */

function extractDistance(
    query: string,
    fallback: number
) {
    const text =
        query.toLowerCase();

    /*
     * Examples:
     *
     * 1 km
     * 2 kms
     * within 3 km
     * under 5 kilometers
     */

    const numberMatch =
        text.match(
            /(?:within|under|less than)?\s*(\d+(?:\.\d+)?)\s*(km|kilometer|kilometers|kms?)/
        );

    if (numberMatch) {
        const value =
            Number(
                numberMatch[1]
            );

        if (
            Number.isFinite(value)
        ) {
            return value;
        }
    }

    /*
     * Examples:
     *
     * one km
     * two km
     * five kilometers
     */

    const wordDistances: Record<
        string,
        number
    > = {
        one: 1,
        two: 2,
        three: 3,
        four: 4,
        five: 5,
        six: 6,
        seven: 7,
        eight: 8,
        nine: 9,
        ten: 10,
    };

    for (
        const [word, value]
        of Object.entries(
            wordDistances
        )
    ) {
        if (
            text.includes(
                `${word} km`
            ) ||
            text.includes(
                `${word} kilometer`
            ) ||
            text.includes(
                `${word} kilometers`
            )
        ) {
            return value;
        }
    }

    return fallback;
}

/* =========================================================
   GET PRICE LABEL
========================================================= */

function getPriceLabel(
    price: number | null
) {
    if (
        price === null ||
        price === undefined
    ) {
        return "Price not available";
    }

    return `₹${price}`;
}

/* =========================================================
   POST SEARCH
========================================================= */

export async function POST(
    request: NextRequest
) {
    try {
        /*
         * Read request
         */

        const body =
            await request.json();

        const query =
            String(
                body.query || ""
            ).trim();

        const latitude =
            Number(
                body.latitude
            );

        const longitude =
            Number(
                body.longitude
            );

        /*
         * Validate query
         */

        if (!query) {
            return NextResponse.json(
                {
                    error:
                        "Please enter what you are looking for.",
                },
                {
                    status: 400,
                }
            );
        }

        /*
         * Validate location
         */

        if (
            !Number.isFinite(
                latitude
            ) ||
            !Number.isFinite(
                longitude
            )
        ) {
            return NextResponse.json(
                {
                    error:
                        "Location is required. Please allow location access.",
                },
                {
                    status: 400,
                }
            );
        }

        /*
         * API key
         */

        const apiKey =
            process.env.GEOAPIFY_API_KEY;

        if (!apiKey) {
            return NextResponse.json(
                {
                    error:
                        "GEOAPIFY_API_KEY is missing from .env.local",
                },
                {
                    status: 500,
                }
            );
        }

        /*
         * Detect category
         */

        const category =
            getCategoryFromQuery(
                query
            );

        /*
         * IMPORTANT:
         *
         * Never search broadly if we don't
         * understand the category.
         */

        if (!category) {
            return NextResponse.json(
                {
                    error:
                        "I could not identify the business type. Please search for a category such as salon, restaurant, cafe, grocery store, pharmacy or gym.",
                },
                {
                    status: 400,
                }
            );
        }

        /*
         * Budget
         */

        const budget =
            extractBudget(
                query,
                Number(
                    body.budget || 1000
                )
            );

        /*
         * Distance
         */

        const maxDistance =
            extractDistance(
                query,
                Number(
                    body.maxDistance || 5
                )
            );

        /*
         * Other preferences
         */

        const openNow =
            Boolean(
                body.openNow
            );

        const priority =
            String(
                body.priority ||
                "overall"
            );

        /*
         * Radius in meters
         */

        const radius =
            maxDistance * 1000;

        /*
         * Create Geoapify URL
         */

        const url =
            new URL(
                GEOAPIFY_URL
            );

        /*
         * THIS IS THE IMPORTANT PART.
         *
         * We send ONLY the exact category.
         */

        url.searchParams.set(
            "categories",
            category.geoapifyCategory
        );

        /*
         * Restrict search to radius.
         */

        url.searchParams.set(
            "filter",
            `circle:${longitude},${latitude},${radius}`
        );

        /*
         * Sort nearby places first.
         */

        url.searchParams.set(
            "bias",
            `proximity:${longitude},${latitude}`
        );

        /*
         * Request more results because
         * we will perform another strict
         * category filter.
         */

        url.searchParams.set(
            "limit",
            "50"
        );

        url.searchParams.set(
            "lang",
            "en"
        );

        url.searchParams.set(
            "apiKey",
            apiKey
        );

        console.log(
            "================================="
        );

        console.log(
            "LOCALMATCH SEARCH"
        );

        console.log(
            "User query:",
            query
        );

        console.log(
            "Detected category:",
            category.key
        );

        console.log(
            "Geoapify category:",
            category.geoapifyCategory
        );

        console.log(
            "Budget:",
            budget
        );

        console.log(
            "Distance:",
            maxDistance,
            "km"
        );

        console.log(
            "Location:",
            latitude,
            longitude
        );

        console.log(
            "================================="
        );

        /*
         * Call Geoapify
         */

        const response =
            await fetch(
                url.toString(),
                {
                    method: "GET",
                    cache: "no-store",
                }
            );

        const responseText =
            await response.text();

        /*
         * Handle API error
         */

        if (!response.ok) {
            console.error(
                "Geoapify HTTP error:",
                response.status
            );

            console.error(
                "Geoapify response:",
                responseText
            );

            return NextResponse.json(
                {
                    error:
                        "Business search failed.",
                    details:
                        responseText,
                },
                {
                    status:
                        response.status,
                }
            );
        }

        /*
         * Parse response
         */

        let data: any;

        try {
            data =
                JSON.parse(
                    responseText
                );
        } catch {
            return NextResponse.json(
                {
                    error:
                        "Geoapify returned invalid data.",
                },
                {
                    status: 500,
                }
            );
        }

        /*
         * Get features
         */

        const features =
            Array.isArray(
                data.features
            )
                ? data.features
                : [];

        console.log(
            "Geoapify returned:",
            features.length
        );

        /*
         * =====================================================
         * STRICT CATEGORY FILTER
         * =====================================================
         *
         * This is the second protection.
         *
         * Even if Geoapify returns something unexpected,
         * we remove it here.
         */

        const validFeatures =
            features.filter(
                (feature: any) => {
                    const properties =
                        feature.properties ||
                        {};

                    const categories =
                        Array.isArray(
                            properties.categories
                        )
                            ? properties.categories
                            : [];

                    const valid =
                        isCorrectCategory(
                            categories,
                            category.key
                        );

                    /*
                     * Debug output
                     */

                    console.log(
                        properties.name ||
                        "Unnamed",
                        "=>",
                        categories,
                        "=>",
                        valid
                    );

                    return valid;
                }
            );

        console.log(
            "Correct category results:",
            validFeatures.length
        );

        /*
         * User preferences
         */

        const preferences:
            UserPreferences = {
            budget,

            maxDistance,

            openNow,

            priority,

            userLat:
                latitude,

            userLng:
                longitude,
        };

        /*
         * Convert Geoapify features
         * into our Business objects.
         */

        const businesses:
            Business[] =
            validFeatures
                .map(
                    (
                        feature: any
                    ) => {
                        const properties =
                            feature.properties ||
                            {};

                        /*
                         * Name
                         *
                         * Use actual source name.
                         * Never create a fake business name.
                         */

                        const name =
                            properties.name ||
                            properties.address_line1;

                        /*
                         * If there is no name,
                         * don't display the business.
                         */

                        if (!name) {
                            return null;
                        }

                        /*
                         * Coordinates
                         */

                        const businessLatitude =
                            Number(
                                properties.lat
                            );

                        const businessLongitude =
                            Number(
                                properties.lon
                            );

                        if (
                            !Number.isFinite(
                                businessLatitude
                            ) ||
                            !Number.isFinite(
                                businessLongitude
                            )
                        ) {
                            return null;
                        }

                        /*
                         * Rating
                         */

                        const rating =
                            Number(
                                properties.rating
                                    ?.value ||
                                properties.rating ||
                                0
                            );

                        /*
                         * Review count
                         */

                        const reviewCount =
                            Number(
                                properties.rating
                                    ?.count ||
                                0
                            );

                        /*
                         * Distance
                         *
                         * Geoapify returns meters.
                         */

                        const distanceMeters =
                            Number(
                                properties.distance ||
                                0
                            );

                        const distanceKm =
                            distanceMeters > 0
                                ? Number(
                                    (
                                        distanceMeters /
                                        1000
                                    ).toFixed(2)
                                )
                                : undefined;

                        /*
                         * Categories
                         */

                        const types =
                            Array.isArray(
                                properties.categories
                            )
                                ? properties.categories
                                : [];

                        /*
                         * IMPORTANT:
                         *
                         * We do NOT invent a price.
                         */

                        const priceValue =
                            null;

                        /*
                         * Create business
                         */

                        const business:
                            Business = {
                            id:
                                properties.place_id ||
                                `${businessLatitude}-${businessLongitude}-${name}`,

                            name,

                            address:
                                properties.formatted ||
                                properties.address_line1 ||
                                "Address unavailable",

                            rating,

                            userRatingCount:
                                reviewCount,

                            latitude:
                                businessLatitude,

                            longitude:
                                businessLongitude,

                            distanceKm,

                            openNow:
                                properties
                                    .opening_hours
                                    ?.open_now ??
                                null,

                            websiteUri:
                                properties.website,

                            phone:
                                properties.contact
                                    ?.phone,

                            googleMapsUri:
                                `https://www.openstreetmap.org/?mlat=${businessLatitude}&mlon=${businessLongitude}`,

                            types,

                            matchScore: 0,

                            matchReasons: [],

                            estimatedPrice:
                                getPriceLabel(
                                    priceValue
                                ),

                            priceValue,
                        };

                        /*
                         * Calculate Match Score
                         */

                        business.matchScore =
                            calculateMatchScore(
                                business,
                                preferences
                            );

                        /*
                         * Why this business?
                         */

                        business.matchReasons.push(
                            `Matches your ${category.label.replace(
                                /s$/,
                                ""
                            )} search`
                        );

                        /*
                         * Distance reason
                         */

                        if (
                            distanceKm !==
                            undefined &&
                            distanceKm <=
                            maxDistance
                        ) {
                            business.matchReasons.push(
                                `${distanceKm} km away`
                            );
                        }

                        /*
                         * Rating reason
                         */

                        if (
                            rating >= 4.5
                        ) {
                            business.matchReasons.push(
                                "Excellent rating"
                            );
                        } else if (
                            rating >= 4
                        ) {
                            business.matchReasons.push(
                                "Good rating"
                            );
                        }

                        /*
                         * Reviews
                         */

                        if (
                            reviewCount >=
                            100
                        ) {
                            business.matchReasons.push(
                                "Many customer reviews"
                            );
                        }

                        /*
                         * Open now
                         */

                        if (
                            business.openNow ===
                            true
                        ) {
                            business.matchReasons.push(
                                "Open now"
                            );
                        }

                        /*
                         * Price
                         *
                         * Only say budget match if
                         * actual price data exists.
                         */

                        if (
                            priceValue !== null &&
                            priceValue <=
                            budget
                        ) {
                            business.matchReasons.push(
                                "Fits your budget"
                            );
                        }

                        return business;
                    }
                )
                .filter(
                    (
                        business:
                            | Business
                            | null
                    ): business is Business =>
                        business !== null
                )
                /*
                 * Open-now filter
                 */

                .filter(
                    (
                        business
                    ) => {
                        if (
                            openNow &&
                            business.openNow !==
                            true
                        ) {
                            return false;
                        }

                        return true;
                    }
                )
                /*
                 * Sort by Match Score.
                 */

                .sort(
                    (
                        a,
                        b
                    ) =>
                        b.matchScore -
                        a.matchScore
                );

        console.log(
            "Final businesses:",
            businesses.length
        );

        /*
         * Return results
         */

        return NextResponse.json({
            businesses,

            count:
                businesses.length,

            category:
                category.key,

            categoryLabel:
                category.label,

            searchQuery:
                query,

            budget,

            maxDistance,
        });
    } catch (error) {
        console.error(
            "LOCALMATCH ERROR:",
            error
        );

        return NextResponse.json(
            {
                error:
                    "Something went wrong while searching.",
            },
            {
                status: 500,
            }
        );
    }
}