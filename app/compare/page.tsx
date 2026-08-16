"use client";

import { useEffect, useState } from "react";
import { Business } from "@/lib/types";

export default function ComparePage() {
    const [businesses, setBusinesses] =
        useState<Business[]>([]);

    useEffect(() => {
        const stored =
            localStorage.getItem(
                "localmatch-compare"
            );

        if (stored) {
            try {
                setBusinesses(JSON.parse(stored));
            } catch {
                setBusinesses([]);
            }
        }
    }, []);

    return (
        <main className="compare-page">
            <div className="compare-container">
                <div className="small-heading">
                    LOCALMATCH
                </div>

                <h1>Compare Businesses</h1>

                <p className="compare-intro">
                    Compare your selected businesses and choose
                    the one that fits your needs.
                </p>

                {businesses.length === 0 ? (
                    <div className="empty-state">
                        <h2>No businesses selected</h2>

                        <p>
                            Go back to search and select businesses
                            to compare.
                        </p>

                        <a
                            href="/"
                            className="button primary"
                        >
                            Back to Search
                        </a>
                    </div>
                ) : (
                    <div className="comparison-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Feature</th>

                                    {businesses.map(
                                        (business) => (
                                            <th key={business.id}>
                                                {business.name}
                                            </th>
                                        )
                                    )}
                                </tr>
                            </thead>

                            <tbody>
                                <tr>
                                    <td>Match Score</td>

                                    {businesses.map(
                                        (business) => (
                                            <td
                                                key={business.id}
                                                className="score-cell"
                                            >
                                                {business.matchScore}/100
                                            </td>
                                        )
                                    )}
                                </tr>

                                <tr>
                                    <td>Rating</td>

                                    {businesses.map(
                                        (business) => (
                                            <td key={business.id}>
                                                ⭐{" "}
                                                {business.rating.toFixed(1)}
                                            </td>
                                        )
                                    )}
                                </tr>

                                <tr>
                                    <td>Reviews</td>

                                    {businesses.map(
                                        (business) => (
                                            <td key={business.id}>
                                                {business.userRatingCount.toLocaleString()}
                                            </td>
                                        )
                                    )}
                                </tr>

                                <tr>
                                    <td>Price</td>

                                    {businesses.map(
                                        (business) => (
                                            <td key={business.id}>
                                                {business.estimatedPrice}
                                            </td>
                                        )
                                    )}
                                </tr>

                                <tr>
                                    <td>Status</td>

                                    {businesses.map(
                                        (business) => (
                                            <td key={business.id}>
                                                {business.openNow === true
                                                    ? "🟢 Open"
                                                    : business.openNow === false
                                                        ? "🔴 Closed"
                                                        : "Unknown"}
                                            </td>
                                        )
                                    )}
                                </tr>

                                <tr>
                                    <td>Address</td>

                                    {businesses.map(
                                        (business) => (
                                            <td key={business.id}>
                                                {business.address}
                                            </td>
                                        )
                                    )}
                                </tr>

                                <tr>
                                    <td>Action</td>

                                    {businesses.map(
                                        (business) => (
                                            <td key={business.id}>
                                                <a
                                                    href={
                                                        business.googleMapsUri
                                                    }
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="button primary"
                                                >
                                                    Directions
                                                </a>
                                            </td>
                                        )
                                    )}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </main>
    );
}