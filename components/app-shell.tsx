import Link from "next/link";
import { Brand } from "./brand";
import { FilmIcon, HomeIcon, SettingsIcon } from "./icons";

export function AppShell({ children, active = "dashboard" }: { children: React.ReactNode; active?: "dashboard" | "new" }) {
  return <div className="app-shell">
    <aside className="side-rail">
      <Brand />
      <nav className="side-nav" aria-label="Navigation principale">
        <Link href="/dashboard" className={active === "dashboard" ? "active" : ""}><HomeIcon /> Mes actifs</Link>
        <Link href="/dashboard/new" className={active === "new" ? "active" : ""}><FilmIcon /> Nouveau film</Link>
        <Link href="/dashboard#settings"><SettingsIcon /> Réglages</Link>
      </nav>
      <div className="side-profile"><div className="profile-row"><span className="avatar">ML</span><div><div className="profile-name">Marie Lambert</div><div className="profile-plan">Plan Pro · 8 films restants</div></div></div></div>
    </aside>
    <main className="app-main">{children}</main>
  </div>;
}
