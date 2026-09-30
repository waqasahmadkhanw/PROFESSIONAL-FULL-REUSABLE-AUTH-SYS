import Link from "next/link";
import Image from "next/image";

interface AuthHeaderProps {
  title: string;
  subtitle?: string;
  logoSrc?: string;
  logoAlt?: string;
  backHref?: string;
  showBackButton?: boolean;
}

export default function AuthHeader({
  title,
  subtitle,
  logoSrc = "/images/logo.svg",
  logoAlt = "Logo",
  backHref = "/",
  showBackButton = false,
}: AuthHeaderProps) {
  return (
    <header className="mb-8">
      {showBackButton && (
        <Link
          href={backHref}
          className="mb-6 inline-flex items-center text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
        >
          ← Back
        </Link>
      )}

      <div className="flex flex-col items-center text-center">
        <Image
          src={logoSrc}
          alt={logoAlt}
          width={64}
          height={64}
          priority
          className="mb-4"
        />

        <h1 className="text-3xl font-bold text-gray-900">
          {title}
        </h1>

        {subtitle && (
          <p className="mt-2 text-sm text-gray-500">
            {subtitle}
          </p>
        )}
      </div>
    </header>
  );
}