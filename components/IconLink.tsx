import type { IconType } from 'react-icons';

/** A small icon that opens a link in a new tab, e.g. a PDF or a website. */
export default function IconLink({
  href,
  label,
  icon: Icon,
  size,
}: {
  href: string;
  label: string;
  icon: IconType;
  size?: number;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={label}
      aria-label={label}
      className="p-1 text-current hover:text-comp-red transition-colors"
    >
      <Icon size={size} />
    </a>
  );
}
