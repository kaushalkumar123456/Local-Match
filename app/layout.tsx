// import type { Metadata } from "next";
// import type { ReactNode } from "react";

// import "maplibre-gl/dist/maplibre-gl.css";
// import "./globals.css";

// export const metadata: Metadata = {
//   title: "Google LocalMatch",
//   description:
//     "Find the right place, not just a place.",
// };

// export default function RootLayout({
//   children,
// }: {
//   children: ReactNode;
// }) {
//   return (
//     <html lang="en">
//       <body>{children}</body>
//     </html>
//   );
// }






import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "LocalMatch - Find the Right Place",
  description:
    "Compare local businesses and find the best match for your needs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}