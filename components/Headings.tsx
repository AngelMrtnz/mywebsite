// The same two heading styles on every page:
// a red page title (matches the menu), then black section titles with a line under them.

export function PageTitle({ children }: { children: React.ReactNode }) {
  return <h1 className="text-4xl sm:text-5xl font-bold text-urv-red mb-8">{children}</h1>;
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-2xl font-bold mb-6 border-b border-gray-200 pb-2">{children}</h2>;
}
