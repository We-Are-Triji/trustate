import Link from "next/link";
import { Building2, Mail, Phone, MapPin } from "lucide-react";
import type { Partner, FooterSection } from "@/lib/types/landing";

interface LandingFooterProps {
  partners: Partner[];
  sections: FooterSection[];
}

export function LandingFooter({ partners, sections }: LandingFooterProps) {
  return (
    <footer className="border-t border-[#E2E8F0] bg-[#F8FAFC]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-12">
          <div className="mb-6 text-center">
            <h3 className="mb-2 text-lg font-semibold text-gray-800">
              Trusted by Leading Developers
            </h3>
            <p className="text-sm text-gray-500">
              Our platform partners with the Philippines&apos; top real estate
              developers
            </p>
          </div>
          <div className="grid grid-cols-3 gap-6 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-6">
            {partners.map((partner) => (
              <div
                key={partner.id}
                className="flex items-center justify-center rounded-lg bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex h-10 w-full items-center justify-center">
                  <span className="text-center text-xs font-medium text-gray-500">
                    {partner.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-12 grid gap-8 border-t border-[#E2E8F0] pt-12 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <Link href="/" className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-800">
                <span className="text-sm font-bold text-white">T</span>
              </div>
              <span className="text-xl font-semibold text-gray-800">
                Trustate
              </span>
            </Link>
            <p className="mb-4 text-sm text-gray-600">
              Your trusted partner in Philippine real estate. Connecting clients
              with verified agents and premium properties.
            </p>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>support@trustate.ph</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+63 (2) 8888-7777</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Makati City, Philippines</span>
              </div>
            </div>
          </div>

          {sections.map((section) => (
            <div key={section.title}>
              <h4 className="mb-4 font-semibold text-gray-800">
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-600 transition-colors hover:text-gray-800"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-[#E2E8F0] pt-8 sm:flex-row">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Trustate. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Terms
            </Link>
            <Link
              href="/cookies"
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
