import Link from "next/link";
import { org, footerNav, footerGetInvolved } from "@/lib/content";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-forest text-cream/90">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-serif text-xl text-cream">{org.name}</p>
          <p className="mt-2 max-w-sm text-sm text-cream/70">
            {org.fullName}
          </p>
        </div>

        <div>
          <p className="text-sm text-cream/60">Navigate</p>
          <ul className="mt-3 flex flex-col gap-2">
            {footerNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-cream/80 transition-colors hover:text-cream"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm text-cream/60">Get involved</p>
          <ul className="mt-3 flex flex-col gap-2">
            {footerGetInvolved.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-cream/80 transition-colors hover:text-cream"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/10 px-6 py-6">
        <p className="mx-auto max-w-6xl text-xs text-cream/50">
          © {year} {org.name}
        </p>
      </div>
    </footer>
  );
}
