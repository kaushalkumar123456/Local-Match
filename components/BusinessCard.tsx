"use client";

import { Business } from "@/lib/types";
import StarRating from "./StarRating";

type Props = {
    business: Business;
    selected: boolean;
    onSelect: () => void;
};

export default function BusinessCard({
    business,
    selected,
    onSelect,
}: Props) {
    return (
        <article
            className={`business-card ${selected ? "selected" : ""
                }`}
        >
            <div className="business-top">
                <div>
                    <div className="match-label">
                        {business.matchScore >= 90
                            ? "BEST MATCH"
                            : business.matchScore >= 80
                                ? "GOOD MATCH"
                                : "MATCH"}
                    </div>

                    <h3>{business.name}</h3>
                </div>

                <div className="match-score">
                    <strong>{business.matchScore}</strong>
                    <span>/100</span>
                </div>
            </div>

            <StarRating
                rating={business.rating}
                count={business.userRatingCount}
            />

            <p className="address">
                📍 {business.address}
            </p>

            <div className="business-info">
                <span>
                    💰 {business.estimatedPrice}
                </span>

                <span>
                    {business.openNow === true
                        ? "🟢 Open now"
                        : business.openNow === false
                            ? "🔴 Closed"
                            : "⚪ Hours unavailable"}
                </span>
            </div>

            <div className="why-box">
                <strong>Why this business?</strong>

                <ul>
                    {business.matchReasons
                        .slice(0, 4)
                        .map((reason, index) => (
                            <li key={index}>
                                ✓ {reason}
                            </li>
                        ))}
                </ul>
            </div>

            <div className="business-actions">
                <button
                    className={
                        selected
                            ? "button selected-button"
                            : "button secondary"
                    }
                    onClick={onSelect}
                >
                    {selected ? "Selected" : "Compare"}
                </button>

                <a
                    className="button primary"
                    href={business.googleMapsUri}
                    target="_blank"
                    rel="noreferrer"
                >
                    Directions
                </a>

                {business.websiteUri && (
                    <a
                        className="button secondary"
                        href={business.websiteUri}
                        target="_blank"
                        rel="noreferrer"
                    >
                        Website
                    </a>
                )}
            </div>
        </article>
    );
}