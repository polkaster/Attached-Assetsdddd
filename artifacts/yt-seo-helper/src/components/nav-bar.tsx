import { Link, useLocation } from 'wouter';
import { Youtube, TrendingUp } from 'lucide-react';

export function NavBar() {
  const [location] = useLocation();

  return (
    <div className="border-b border-border bg-background sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 md:px-8 h-14 flex items-center gap-6">
        <nav className="flex items-center gap-6 text-sm font-semibold">
          <Link 
            href="/" 
            className={`flex items-center gap-2 transition-colors hover:text-foreground py-4 border-b-2 ${location === '/' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground'}`}
          >
            <Youtube className="w-4 h-4" />
            SEO Helper
          </Link>
          <Link 
            href="/trending" 
            className={`flex items-center gap-2 transition-colors hover:text-foreground py-4 border-b-2 ${location === '/trending' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground'}`}
          >
            <TrendingUp className="w-4 h-4" />
            Konten Trending
          </Link>
        </nav>
      </div>
    </div>
  );
}
