type Props = {
    rating: number;
    count?: number;
};

export default function StarRating({
    rating,
    count,
}: Props) {
    return (
        <div className="rating">
            <span className="star">★</span>

            <strong>{rating ? rating.toFixed(1) : "New"}</strong>

            {count !== undefined && count > 0 && (
                <span className="rating-count">
                    ({count.toLocaleString()} reviews)
                </span>
            )}
        </div>
    );
}