# Project Retrospective & Style Guide for Gemini

This document summarizes the key decisions, architecture, and style conventions for this website project to ensure consistency in future development sessions.

## Core Technologies
*   **Framework:** Next.js
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS

## Architecture & Layout
*   **Layout:** A fixed sidebar on the left with a main content area on the right.
*   **Sidebar (`components/Sidebar.tsx`):**
    *   Acts as the main navigation and identity hub.
    *   Contains the user's photo, name, email, main navigation, and social media links.
    *   Has a slide-and-fade-in animation on load.
*   **Content Area (`app/layout.tsx`):**
    *   Occupies the space to the right of the sidebar.
    *   Has a subtle inner shadow on its left edge to create a smooth visual transition from the sidebar.

## Styling & Design System
*   **Font:** Lato is the primary font for the entire website.
*   **Color Palette (`tailwind.config.ts`):** The color scheme is based on the official Universitat Rovira i Virgili brand guide.
    *   **Primary Red:** `urv-red` (`#90292A`) - Used for the sidebar background and primary links/headings.
    *   **Primary Black:** `urv-black` (`#231F20`) - Used for all body text and article metadata for a serious, high-contrast look.
    *   **Main Background:** `bg-white` is used for the main content area.
    *   **Complementary Colors:** A set of complementary colors (`comp-red`, `comp-dark-red`, `comp-yellow`, etc.) are available for accents and hover states.
*   **UI Preferences:**
    *   **No Underlines in Sidebar:** Interactive elements within the sidebar (navigation links, email) must not have an underline effect on hover. Opacity or background changes are preferred.
    *   **Icons:** The `react-icons` library is the standard for all icons to ensure a consistent and high-quality appearance.

## Key Features & Implementations
*   **List of Publications (`app/research/page.tsx`):**
    *   **Data Source:** Fetches publication data from `/public/papers.xml`.
    *   **Rendering:**
        *   Uses the `PaperEntry.tsx` component for individual entries.
        *   Displays entries with inverse numbering (e.g., the most recent paper is the highest number).
        *   Renders author lists below the title.
        *   Displays a "Preprint" badge and a conditional, linked DOI icon for each paper.
    *   **Interactivity:**
        *   Abstracts are hidden by default and can be expanded/collapsed by the user.
        *   Abstracts containing LaTeX are correctly rendered using the `react-katex` library.
*   **File Organization:**
    *   Static assets used by components (e.g., profile picture) are stored in the `public/images/` directory.
    *   Data files (e.g., `papers.xml`) are stored in the `public/` directory.
