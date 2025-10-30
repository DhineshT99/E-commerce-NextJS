// components/conditional-navbar-wrapper.tsx
"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/navbar"; // Assuming your Navbar component path is correct

// Routes where the Navbar should be hidden
const pathsWithoutNavbar = ["/signin"];

export function ConditionalNavbarWrapper() {
  const pathname = usePathname();

  // Check if the current pathname starts with any path in the exclusion list
  // Use startsWith for flexibility (e.g., if you had /signin/forgot-password)
  const shouldShowNavbar = !pathsWithoutNavbar.some((path) =>
    pathname.startsWith(path)
  );

  if (!shouldShowNavbar) {
    return null; // Don't render the Navbar
  }

  return <Navbar />; // Render the Navbar
}
