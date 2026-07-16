import { Link, useLocation } from 'wouter';
import { Youtube, TrendingUp, Facebook, Twitter } from 'lucide-react';
import { SiYoutube } from 'react-icons/si';

export function NavBar() {
  const [location] = useLocation();

  return (
    <div className="border-b border-border bg-background sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 md:px-8 h-14 flex items-center gap-8">
        {/* Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <img
            src="/logo.jpg"
            alt="Polkaster"
            className="w-9 h-9 rounded-full object-cover ring-2 ring-primary/60 shadow-lg shadow-primary/20"
          />
          <span
            className="rgb-text text-sm font-black tracking-tight leading-none select-none"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            Polkaster
          </span>
          <a
            href="https://www.facebook.com/derby.ar.7"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-7 h-7 rounded-lg transition-all hover:scale-110 hover:shadow-lg"
            style={{ background: '#1877F2' }}
            title="Facebook"
          >
            <Facebook className="w-3.5 h-3.5 text-white" />
          </a>
          <a
            href="https://x.com/polkaster300"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-7 h-7 rounded-lg transition-all hover:scale-110 hover:shadow-lg"
            style={{ background: '#000000' }}
            title="X / Twitter"
          >
            <Twitter className="w-3.5 h-3.5 text-white" />
          </a>
          <a
            href="https://youtube.com/@polkaster?si=WYKakLtJKGhadY1f"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-7 h-7 rounded-lg transition-all hover:scale-110 hover:shadow-lg"
            style={{ background: '#FF0000' }}
            title="YouTube"
          >
            <SiYoutube className="w-3.5 h-3.5 text-white" />
          </a>
        </div>

        {/* Divider */}
        <div className="h-5 w-px bg-border" />

        {/* Navigation tabs */}
        <nav className="flex items-center gap-6 text-sm font-semibold">
          <Link
            href="/"
            className={`flex items-center gap-2 transition-colors hover:text-foreground py-4 border-b-2 ${
              location === '/'
                ? 'border-primary text-foreground'
                : 'border-transparent text-muted-foreground'
            }`}
          >
            <Youtube className="w-4 h-4" />
            SEO Helper
          </Link>
          <Link
            href="/trending"
            className={`flex items-center gap-2 transition-colors hover:text-foreground py-4 border-b-2 ${
              location === '/trending'
                ? 'border-primary text-foreground'
                : 'border-transparent text-muted-foreground'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            Konten Trending
          </Link>
        </nav>
      </div>
    </div>
  );
}
