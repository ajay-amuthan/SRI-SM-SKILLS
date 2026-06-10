import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  FolderOpen,
  ShoppingCart,
  Users,
  Tag,
  LogOut,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: FolderOpen },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/coupons", label: "Coupons", icon: Tag },
];

export default function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-64 bg-foreground text-white shrink-0 hidden md:flex flex-col">
        <div className="p-6 border-b border-gray-700">
          <Link href="/admin" className="text-lg font-bold">
            Sri SM <span className="text-gold">Admin</span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-4 py-2.5 text-sm rounded hover:bg-white/10 transition-colors"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-700">
          <Link href="/" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-400 hover:text-white">
            <LogOut className="h-4 w-4" /> Back to Store
          </Link>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="md:hidden bg-foreground text-white p-4 flex items-center justify-between">
          <span className="font-bold">Admin Panel</span>
          <nav className="flex gap-3 text-xs overflow-x-auto">
            {navItems.map(({ href, label }) => (
              <Link key={href} href={href} className="whitespace-nowrap hover:text-gold">{label}</Link>
            ))}
          </nav>
        </div>
        <div className="p-6 md:p-8">{children}</div>
      </main>
    </div>
  );
}
