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
      <div className="flex h-screen overflow-x-hidden">
        <main className="flex min-h-screen flex-col items-center justify-center mx-auto">{children}</main>
      </div>
    </>
  );
}
