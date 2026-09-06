import { Link } from 'react-router-dom';
import { Heart, Mail, MapPin, Phone } from 'lucide-react';

import logo from '../../../assets/LoGo.png';

export default function Footer() {
  return (
    <footer className="mt-16 bg-espresso text-ivory/80">
      <div className="container-custom grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">

        {/* =========================
            BRAND
        ========================== */}
        <div>
          <Link
            to="/"
            className="mb-5 inline-flex items-center gap-3"
            aria-label="Velmora Home"
          >
            {/* Logo */}
            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white p-1.5 shadow-sm">
              <img
                src={logo}
                alt="Velmora Logo"
                className="h-full w-full object-contain"
              />
            </div>

            {/* Brand Name */}
            <span className="font-display text-2xl font-semibold tracking-wide text-ivory">
              Velmora
            </span>
          </Link>

          <p className="max-w-xs text-sm leading-6 text-ivory/65">
            Curated products worth bringing home. Warm, considered pieces
            for everyday living.
          </p>
        </div>

        {/* =========================
            SHOP
        ========================== */}
        <div>
          <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            Shop
          </h4>

          <ul className="space-y-2 text-sm">
            <li>
              <Link
                to="/"
                className="transition-colors hover:text-ivory"
              >
                Home
              </Link>
            </li>

            <li>
              <Link
                to="/products"
                className="transition-colors hover:text-ivory"
              >
                Shop
              </Link>
            </li>

            <li>
              <Link
                to="/wishlist"
                className="transition-colors hover:text-ivory"
              >
                Wishlist
              </Link>
            </li>

            <li>
              <Link
                to="/orders"
                className="transition-colors hover:text-ivory"
              >
                Orders
              </Link>
            </li>
          </ul>
        </div>

        {/* =========================
            CUSTOMER SERVICE
        ========================== */}
        <div>
          <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            Customer Service
          </h4>

          <ul className="space-y-3 text-sm text-ivory/65">

            <li className="flex items-center gap-2">
              <Mail
                size={15}
                className="shrink-0 text-accent"
              />
              <span>support@velmora.com</span>
            </li>

            <li className="flex items-center gap-2">
              <Phone
                size={15}
                className="shrink-0 text-accent"
              />
              <span>+977 9800000000</span>
            </li>

            <li className="flex items-center gap-2">
              <MapPin
                size={15}
                className="shrink-0 text-accent"
              />
              <span>Kathmandu, Nepal</span>
            </li>

          </ul>
        </div>

        {/* =========================
            ABOUT
        ========================== */}
        <div>
          <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            About
          </h4>

          <p className="text-sm leading-6 text-ivory/65">
            Secure checkout, saved addresses, order tracking, and
            thoughtful support in one place.
          </p>

          <Link
            to="/support"
            className="mt-4 inline-block text-sm font-semibold text-accent transition-colors hover:text-ivory"
          >
            Contact support
          </Link>
        </div>
      </div>

      {/* =========================
          COPYRIGHT
      ========================== */}
      <div className="border-t border-white/10 py-5 text-center text-sm text-ivory/50">
        <span>
          © {new Date().getFullYear()} Velmora. Crafted with
        </span>

        <Heart
          className="mx-1 inline h-3.5 w-3.5 fill-current text-accent"
          aria-hidden="true"
        />

        <span>for better shopping.</span>
      </div>
    </footer>
  );
}