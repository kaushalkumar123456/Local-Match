// import { Business, UserPreferences } from "./types";

// function clamp(value: number, min: number, max: number) {
//     return Math.min(Math.max(value, min), max);
// }

// function distanceInKm(
//     lat1: number,
//     lon1: number,
//     lat2: number,
//     lon2: number
// ) {
//     const R = 6371;

//     const dLat = ((lat2 - lat1) * Math.PI) / 180;
//     const dLon = ((lon2 - lon1) * Math.PI) / 180;

//     const a =
//         Math.sin(dLat / 2) ** 2 +
//         Math.cos((lat1 * Math.PI) / 180) *
//         Math.cos((lat2 * Math.PI) / 180) *
//         Math.sin(dLon / 2) ** 2;

//     return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
// }

// export function calculateMatchScore(
//     business: Business,
//     preferences: UserPreferences
// ) {
//     let score = 0;

//     const reasons: string[] = [];

//     // -------------------------
//     // Rating: 25 points
//     // -------------------------

//     const ratingScore = (business.rating / 5) * 25;

//     score += ratingScore;

//     if (business.rating >= 4.5) {
//         reasons.push("Excellent customer rating");
//     } else if (business.rating >= 4.0) {
//         reasons.push("Good customer rating");
//     }

//     // -------------------------
//     // Budget: 25 points
//     // -------------------------

//     let budgetScore = 15;

//     if (preferences.budget > 0) {
//         if (business.priceValue <= preferences.budget) {
//             budgetScore = 25;
//             reasons.push("Fits your budget");
//         } else if (business.priceValue <= preferences.budget * 1.2) {
//             budgetScore = 18;
//             reasons.push("Slightly above your budget");
//         } else {
//             budgetScore = 5;
//         }
//     }

//     score += budgetScore;

//     // -------------------------
//     // Distance: 25 points
//     // -------------------------

//     let distanceScore = 15;

//     if (
//         preferences.userLat !== undefined &&
//         preferences.userLng !== undefined
//     ) {
//         const distance = distanceInKm(
//             preferences.userLat,
//             preferences.userLng,
//             business.latitude,
//             business.longitude
//         );

//         if (distance <= preferences.maxDistance * 0.5) {
//             distanceScore = 25;
//             reasons.push("Very close to you");
//         } else if (distance <= preferences.maxDistance) {
//             distanceScore = 20;
//             reasons.push("Within your preferred distance");
//         } else {
//             distanceScore = 5;
//         }
//     }

//     score += distanceScore;

//     // -------------------------
//     // Popularity / review count: 15
//     // -------------------------

//     let reviewScore = 5;

//     if (business.userRatingCount >= 500) {
//         reviewScore = 15;
//         reasons.push("Large number of customer ratings");
//     } else if (business.userRatingCount >= 100) {
//         reviewScore = 12;
//         reasons.push("Good number of customer ratings");
//     } else if (business.userRatingCount >= 25) {
//         reviewScore = 9;
//     }

//     score += reviewScore;

//     // -------------------------
//     // Open now: 10 points
//     // -------------------------

//     let openScore = 5;

//     if (business.openNow === true) {
//         openScore = 10;
//         reasons.push("Open now");
//     } else if (business.openNow === false) {
//         openScore = 0;
//     }

//     score += openScore;

//     // -------------------------
//     // Priority adjustment
//     // -------------------------

//     if (preferences.priority === "quality") {
//         score += ratingScore * 0.1;
//     }

//     if (preferences.priority === "budget") {
//         score += budgetScore * 0.1;
//     }

//     if (preferences.priority === "distance") {
//         score += distanceScore * 0.1;
//     }

//     return Math.round(clamp(score, 0, 100));
// }

// export { distanceInKm };



// import {
//     Business,
//     UserPreferences,
// } from "./types";

// function clamp(
//     value: number,
//     min: number,
//     max: number
// ) {
//     return Math.min(
//         Math.max(value, min),
//         max
//     );
// }

// function distanceInKm(
//     lat1: number,
//     lon1: number,
//     lat2: number,
//     lon2: number
// ) {
//     const R = 6371;

//     const dLat =
//         ((lat2 - lat1) *
//             Math.PI) /
//         180;

//     const dLon =
//         ((lon2 - lon1) *
//             Math.PI) /
//         180;

//     const a =
//         Math.sin(dLat / 2) ** 2 +
//         Math.cos(
//             (lat1 * Math.PI) / 180
//         ) *
//         Math.cos(
//             (lat2 * Math.PI) / 180
//         ) *
//         Math.sin(dLon / 2) ** 2;

//     return (
//         R *
//         2 *
//         Math.atan2(
//             Math.sqrt(a),
//             Math.sqrt(1 - a)
//         )
//     );
// }

// export function calculateMatchScore(
//     business: Business,
//     preferences: UserPreferences
// ) {
//     let score = 0;

//     // Rating
//     if (business.rating > 0) {
//         score +=
//             (business.rating / 5) *
//             30;
//     } else {
//         score += 15;
//     }

//     // Budget
//     if (
//         business.priceValue <=
//         preferences.budget
//     ) {
//         score += 25;
//     } else if (
//         business.priceValue <=
//         preferences.budget * 1.2
//     ) {
//         score += 17;
//     } else {
//         score += 5;
//     }

//     // Distance
//     if (
//         preferences.userLat !==
//         undefined &&
//         preferences.userLng !==
//         undefined
//     ) {
//         const distance =
//             distanceInKm(
//                 preferences.userLat,
//                 preferences.userLng,
//                 business.latitude,
//                 business.longitude
//             );

//         if (
//             distance <=
//             preferences.maxDistance * 0.5
//         ) {
//             score += 25;
//         } else if (
//             distance <=
//             preferences.maxDistance
//         ) {
//             score += 18;
//         } else {
//             score += 5;
//         }
//     } else {
//         score += 15;
//     }

//     // Reviews
//     if (
//         business.userRatingCount >=
//         500
//     ) {
//         score += 10;
//     } else if (
//         business.userRatingCount >=
//         100
//     ) {
//         score += 8;
//     } else if (
//         business.userRatingCount >=
//         20
//     ) {
//         score += 6;
//     } else {
//         score += 3;
//     }

//     // Open now
//     if (
//         business.openNow === true
//     ) {
//         score += 10;
//     } else if (
//         business.openNow === null
//     ) {
//         score += 5;
//     }

//     // Priority
//     if (
//         preferences.priority ===
//         "quality"
//     ) {
//         score +=
//             business.rating >= 4
//                 ? 5
//                 : 0;
//     }

//     if (
//         preferences.priority ===
//         "budget"
//     ) {
//         score +=
//             business.priceValue <=
//                 preferences.budget
//                 ? 5
//                 : 0;
//     }

//     return Math.round(
//         clamp(score, 0, 100)
//     );
// }

// export { distanceInKm };



import {
    Business,
    UserPreferences,
} from "./types";

export function calculateMatchScore(
    business: Business,
    preferences: UserPreferences
): number {
    let score = 0;

    /*
     * CATEGORY MATCH
     *
     * This is very important.
     * A correct category gets 30 points.
     */

    const categoryMatch =
        business.types.length > 0;

    if (categoryMatch) {
        score += 30;
    }

    /*
     * DISTANCE
     *
     * Maximum 30 points.
     */

    if (
        business.distanceKm !== undefined
    ) {
        const distance =
            business.distanceKm;

        const maxDistance =
            preferences.maxDistance;

        if (distance <= maxDistance) {
            const distanceScore =
                30 *
                (1 -
                    distance /
                    maxDistance);

            score += Math.max(
                5,
                distanceScore
            );
        }
    }

    /*
     * RATING
     *
     * Maximum 25 points.
     */

    if (business.rating > 0) {
        score +=
            (business.rating / 5) *
            25;
    } else {
        // Rating unavailable.
        score += 10;
    }

    /*
     * REVIEW COUNT
     *
     * Maximum 10 points.
     */

    if (
        business.userRatingCount >=
        1000
    ) {
        score += 10;
    } else if (
        business.userRatingCount >=
        500
    ) {
        score += 8;
    } else if (
        business.userRatingCount >=
        100
    ) {
        score += 6;
    } else if (
        business.userRatingCount > 0
    ) {
        score += 4;
    } else {
        score += 2;
    }

    /*
     * OPEN NOW
     *
     * Maximum 5 points.
     */

    if (business.openNow === true) {
        score += 5;
    }

    return Math.min(
        100,
        Math.round(score)
    );
}