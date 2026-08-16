// "use client";

// import { Business } from "@/lib/types";

// type Props = {
//     businesses: Business[];
//     onRemove: (id: string) => void;
// };

// export default function CompareBar({
//     businesses,
//     onRemove,
// }: Props) {
//     if (businesses.length === 0) {
//         return null;
//     }

//     return (
//         <div className="compare-bar">
//             <div>
//                 <strong>
//                     {businesses.length} selected
//                 </strong>

//                 <span>
//                     Choose up to 3 businesses to compare
//                 </span>
//             </div>

//             <div className="compare-selected">
//                 {businesses.map((business) => (
//                     <button
//                         key={business.id}
//                         onClick={() => onRemove(business.id)}
//                     >
//                         {business.name} ×
//                     </button>
//                 ))}

//                 {businesses.length >= 2 && (
//                     <a
//                         href={`/compare?ids=${businesses
//                             .map((business) => business.id)
//                             .join(",")}`}
//                         className="button primary"
//                     >
//                         Compare Now
//                     </a>
//                 )}
//             </div>
//         </div>
//     );
// }



"use client";

import { Business } from "@/lib/types";

type Props = {
    businesses: Business[];
    onRemove: (id: string) => void;
};

export default function CompareBar({
    businesses,
    onRemove,
}: Props) {
    function openComparison() {
        localStorage.setItem(
            "localmatch-compare",
            JSON.stringify(businesses)
        );

        window.location.href = "/compare";
    }

    if (businesses.length === 0) {
        return null;
    }

    return (
        <div className="compare-bar">
            <div>
                <strong>
                    {businesses.length} selected
                </strong>

                <span>
                    Compare up to 3 businesses
                </span>
            </div>

            <div className="compare-selected">
                {businesses.map((business) => (
                    <button
                        key={business.id}
                        onClick={() =>
                            onRemove(business.id)
                        }
                    >
                        {business.name} ×
                    </button>
                ))}

                {businesses.length >= 2 && (
                    <button
                        className="button primary"
                        onClick={openComparison}
                    >
                        Compare Now
                    </button>
                )}
            </div>
        </div>
    );
}