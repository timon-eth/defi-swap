"use client"

import Header from "@/components/layout/header";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className="absolute inset-0 bg-no-repeat index_beams__yWcJT">
        <div
          className="absolute inset-x-0 bottom-0 h-full text-neutral-400/20 [mask-image:linear-gradient(to_bottom,transparent,white)]">
          <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="pricing-pattern" width="32" height="32" patternUnits="userSpaceOnUse" x="50%" y="100%"
                patternTransform="translate(0 -1)">
                <path d="M0 32V.5H32" fill="none" stroke="currentColor"></path>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#pricing-pattern)"></rect>
          </svg>
        </div>
      </div>
      <div className="flex relative h-screen overflow-x-hidden">
        <main className="flex min-h-screen flex-col items-center justify-center mx-auto">{children}</main>
      </div>
    </>
  );
}
