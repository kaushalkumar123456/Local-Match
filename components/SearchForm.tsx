"use client";

import { useState } from "react";

type SearchFormProps = {
    onSearch: (data: {
        query: string;
        budget: number;
        maxDistance: number;
        openNow: boolean;
        priority: string;
    }) => void;

    loading: boolean;
};

export default function SearchForm({
    onSearch,
    loading,
}: SearchFormProps) {
    const [query, setQuery] = useState("");
    const [budget, setBudget] = useState(1000);
    const [maxDistance, setMaxDistance] = useState(5);
    const [openNow, setOpenNow] = useState(false);
    const [priority, setPriority] = useState("overall");

    function submit(event: React.FormEvent) {
        event.preventDefault();

        if (!query.trim()) {
            return;
        }

        onSearch({
            query,
            budget,
            maxDistance,
            openNow,
            priority,
        });
    }

    return (
        <form onSubmit={submit} className="search-form">
            <div className="main-search">
                <span className="search-icon">⌕</span>

                <input
                    value={query}
                    onChange={(event) =>
                        setQuery(event.target.value)
                    }
                    placeholder="What are you looking for?"
                />

                <button type="submit" disabled={loading}>
                    {loading ? "Searching..." : "Find Match"}
                </button>
            </div>

            <div className="search-examples">
                Try:
                <button
                    type="button"
                    onClick={() =>
                        setQuery("salon")
                    }
                >
                    salon
                </button>

                <button
                    type="button"
                    onClick={() =>
                        setQuery("restaurant")
                    }
                >
                    restaurant
                </button>

                <button
                    type="button"
                    onClick={() =>
                        setQuery("mobile repair shop")
                    }
                >
                    mobile repair
                </button>
            </div>

            <div className="filters">
                <div className="filter">
                    <label>Budget</label>

                    <select
                        value={budget}
                        onChange={(event) =>
                            setBudget(Number(event.target.value))
                        }
                    >
                        <option value={300}>Under ₹300</option>
                        <option value={500}>Under ₹500</option>
                        <option value={1000}>Under ₹1,000</option>
                        <option value={2000}>Under ₹2,000</option>
                        <option value={5000}>Under ₹5,000</option>
                    </select>
                </div>

                <div className="filter">
                    <label>Distance</label>

                    <select
                        value={maxDistance}
                        onChange={(event) =>
                            setMaxDistance(Number(event.target.value))
                        }
                    >
                        <option value={1}>Within 1 km</option>
                        <option value={3}>Within 3 km</option>
                        <option value={5}>Within 5 km</option>
                        <option value={10}>Within 10 km</option>
                        <option value={20}>Within 20 km</option>
                    </select>
                </div>

                <div className="filter">
                    <label>Priority</label>

                    <select
                        value={priority}
                        onChange={(event) =>
                            setPriority(event.target.value)
                        }
                    >
                        <option value="overall">Best Overall</option>
                        <option value="budget">Best Budget</option>
                        <option value="quality">Best Quality</option>
                        <option value="distance">Closest</option>
                    </select>
                </div>

                <label className="open-filter">
                    <input
                        type="checkbox"
                        checked={openNow}
                        onChange={(event) =>
                            setOpenNow(event.target.checked)
                        }
                    />

                    Open now
                </label>
            </div>
        </form>
    );
}