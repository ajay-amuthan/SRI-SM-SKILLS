"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Search, ShoppingBag, Heart, User, Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Header() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const navLinks = [
    { href: "/shop", label: "Shop" },
    { href: "/shop?newArrival=true", label: "New Arrivals" },
    { href: "/shop?bestSeller=true", label: "Best Sellers" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border">
      <div className="bg-foreground text-white text-center py-1.5 text-xs tracking-widest">
        FREE SHIPPING ON ORDERS ABOVE ₹999 | WEAR CONFIDENCE. LIVE YOUR STYLE.
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          <button
            className="lg:hidden p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <Link href="/" className="text-xl font-bold tracking-tight">
            <span className="text-foreground">Sri SM</span>
            <span className="text-gold"> Skills</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium tracking-wide hover:text-gold transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1 sm:gap-3">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 hover:text-gold transition-colors"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
            <Link href="/wishlist" className="p-2 hover:text-gold transition-colors hidden sm:block">
              <Heart className="h-5 w-5" />
            </Link>
            <Link href="/cart" className="p-2 hover:text-gold transition-colors">
              <ShoppingBag className="h-5 w-5" />
            </Link>
            {session ? (
              <div className="relative group">
                <button className="p-2 hover:text-gold transition-colors">
                  <User className="h-5 w-5" />
                </button>
                <div className="absolute right-0 top-full hidden w-48 bg-white border border-border shadow-lg group-hover:block">
                  <div className="px-4 py-3 border-b border-border">
                    <p className="text-sm font-medium truncate">{session.user?.name}</p>
                    <p className="text-xs text-muted truncate">{session.user?.email}</p>
                  </div>
                  <Link href="/profile" className="block px-4 py-2 text-sm hover:bg-card">Profile</Link>
                  <Link href="/orders" className="block px-4 py-2 text-sm hover:bg-card">Orders</Link>
                  <Link href="/wishlist" className="block px-4 py-2 text-sm hover:bg-card sm:hidden">Wishlist</Link>
                  <button
                    onClick={() => signOut()}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-card text-red-600"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link href="/login" className="p-2 hover:text-gold transition-colors">
                <User className="h-5 w-5" />
              </Link>
            )}
          </div>
        </div>

        {searchOpen && (
          <form onSubmit={handleSearch} className="pb-4 animate-fade-in-up">
            <div className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="flex-1 border border-border px-4 py-2 text-sm focus:border-gold focus:outline-none"
                autoFocus
              />
              <button type="submit" className="bg-foreground px-6 py-2 text-sm text-white hover:bg-gold transition-colors">
                Search
              </button>
            </div>
          </form>
        )}
      </div>

      {menuOpen && (
        <nav className="lg:hidden border-t border-border bg-white animate-fade-in-up">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block px-6 py-3 text-sm font-medium border-b border-border hover:bg-card"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {!session && (
            <Link
              href="/login"
              className="block px-6 py-3 text-sm font-medium hover:bg-card"
              onClick={() => setMenuOpen(false)}
            >
              Login / Register
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}
