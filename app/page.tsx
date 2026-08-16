
// "use client";

// import LocalMap from "../components/LocalMap";

// export default function Home() {
//   return (
//     <main className="page">
//       <section className="hero">
//         <div className="hero-content">
//           <div className="brand">
//             LOCALMATCH
//           </div>

//           <h1>
//             Find the right place,
//             <br />
//             not just a place.
//           </h1>

//           <p className="hero-description">
//             A smarter way to discover and compare
//             local businesses based on your needs.
//           </p>

//           <div className="search-box">
//             <div className="search-icon">
//               🔍
//             </div>

//             <input
//               type="text"
//               placeholder="What are you looking for?"
//               disabled
//             />

//             <button disabled>
//               Search
//             </button>
//           </div>

//           <p className="test-message">
//             Map test version — business search
//             will be added next.
//           </p>
//         </div>
//       </section>

//       <section className="map-section">
//         <div className="section-header">
//           <div>
//             <span className="section-label">
//               EXPLORE
//             </span>

//             <h2>
//               Your local area
//             </h2>

//             <p>
//               OpenStreetMap + MapLibre
//             </p>
//           </div>
//         </div>

//         <LocalMap
//           latitude={17.385}
//           longitude={78.4867}
//         />
//       </section>

//       <section className="info-section">
//         <div className="info-card">
//           <div className="info-number">
//             01
//           </div>

//           <h3>
//             Tell us what you need
//           </h3>

//           <p>
//             Search for a salon, restaurant,
//             repair shop, grocery store or
//             another local business.
//           </p>
//         </div>

//         <div className="info-card">
//           <div className="info-number">
//             02
//           </div>

//           <h3>
//             Compare your options
//           </h3>

//           <p>
//             Compare price, distance, quality,
//             availability and other important
//             information.
//           </p>
//         </div>

//         <div className="info-card">
//           <div className="info-number">
//             03
//           </div>

//           <h3>
//             Choose with confidence
//           </h3>

//           <p>
//             LocalMatch helps you find the
//             business that best matches your
//             needs.
//           </p>
//         </div>
//       </section>

//       <footer className="footer">
//         <strong>
//           Google LocalMatch
//         </strong>

//         <span>
//           Find the right place, not just a place.
//         </span>
//       </footer>
//     </main>
//   );
// }






"use client";

import { useState } from "react";
import SearchForm from "@/components/SearchForm";
import BusinessCard from "@/components/BusinessCard";
import CompareBar from "@/components/CompareBar";
import { Business } from "@/lib/types";
import dynamic from "next/dynamic";

export default function Home() {
  const [businesses, setBusinesses] =
    useState<Business[]>([]);

  const [selected, setSelected] =
    useState<Business[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [searched, setSearched] =
    useState(false);

  async function handleSearch(data: {
    query: string;
    budget: number;
    maxDistance: number;
    openNow: boolean;
    priority: string;
  }) {
    setLoading(true);
    setError("");
    setSearched(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        await performSearch(
          data,
          position.coords.latitude,
          position.coords.longitude
        );
      },
      async () => {
        await performSearch(data);
      }
    );
  }


  const LocalMap = dynamic(
    () =>
      import("@/components/LocalMap"),
    {
      ssr: false,
      loading: () => (
        <div className="map-loading">
          Loading map...
        </div>
      ),
    }
  );








  async function performSearch(
    data: {
      query: string;
      budget: number;
      maxDistance: number;
      openNow: boolean;
      priority: string;
    },
    latitude?: number,
    longitude?: number
  ) {
    try {
      const response = await fetch(
        "/api/search",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...data,
            latitude,
            longitude,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Search failed"
        );
      }

      setBusinesses(result.businesses || []);
      setSelected([]);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  function toggleCompare(business: Business) {
    setSelected((current) => {
      const exists = current.some(
        (item) => item.id === business.id
      );

      if (exists) {
        return current.filter(
          (item) => item.id !== business.id
        );
      }

      if (current.length >= 3) {
        return current;
      }

      return [...current, business];
    });
  }

  return (
    <main>
      <section className="hero">
        <div className="hero-content">
          <div className="badge">
            SMART LOCAL BUSINESS SEARCH
          </div>

          <h1>
            Find the right place,
            <br />
            <span>not just a place.</span>
          </h1>

          <p>
            Tell LocalMatch what you need. We compare
            nearby businesses based on your budget,
            distance, ratings and priorities.
          </p>

          <SearchForm
            onSearch={handleSearch}
            loading={loading}
          />
        </div>
      </section>

      {error && (
        <div className="error-box">
          <strong>Something went wrong</strong>
          <p>{error}</p>
        </div>
      )}

      <section className="results-section">
        {loading && (
          <div className="loading">
            <div className="spinner" />
            <h2>Finding your best matches...</h2>
            <p>
              Checking nearby businesses and comparing
              your preferences.
            </p>
          </div>
        )}

        {!loading &&
          searched &&
          businesses.length === 0 &&
          !error && (
            <div className="empty-state">
              <div className="empty-icon">⌕</div>

              <h2>No matching businesses found</h2>

              <p>
                Try increasing your distance or changing
                your search.
              </p>
            </div>
          )}

        {!loading && businesses.length > 0 && (
          <>
            <div className="results-header">
              <div>
                <div className="small-heading">
                  LOCALMATCH RESULTS
                </div>

                <h2>
                  {businesses.length} businesses found
                </h2>
              </div>

              <div className="result-note">
                Sorted by your Match Score
              </div>
            </div>

            <div className="results-grid">
              {businesses.map((business) => (
                <BusinessCard
                  key={business.id}
                  business={business}
                  selected={selected.some(
                    (item) =>
                      item.id === business.id
                  )}
                  onSelect={() =>
                    toggleCompare(business)
                  }
                />
              ))}
            </div>
          </>
        )}

        {!loading && !searched && (
          <div className="how-section">
            <div className="small-heading">
              HOW IT WORKS
            </div>

            <h2>
              Local search made easier
            </h2>

            <div className="steps">
              <div className="step">
                <div className="step-number">1</div>
                <h3>Tell us what you need</h3>
                <p>
                  Search for a salon, restaurant,
                  repair shop or any local business.
                </p>
              </div>

              <div className="step">
                <div className="step-number">2</div>
                <h3>Set your preferences</h3>
                <p>
                  Choose your budget, distance and
                  what matters most to you.
                </p>
              </div>

              <div className="step">
                <div className="step-number">3</div>
                <h3>Choose your match</h3>
                <p>
                  Compare businesses and understand
                  why each one is recommended.
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      <CompareBar
        businesses={selected}
        onRemove={(id) =>
          setSelected((current) =>
            current.filter(
              (business) => business.id !== id
            )
          )
        }
      />
    </main>
  );
}