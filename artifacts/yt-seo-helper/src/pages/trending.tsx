import { useState } from 'react';
import { AdBanner } from '@/components/ad-banner';
import { useGetTrending } from '@workspace/api-client-react';
import { TrendingUp, Play, Eye, Clock, AlertCircle, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';

const REGIONS = [
  { code: 'ID', name: 'Indonesia' },
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'JP', name: 'Japan' },
  { code: 'KR', name: 'South Korea' },
];

export default function Trending() {
  const [regionCode, setRegionCode] = useState('ID');
  const [, setLocation] = useLocation();
  const { data, isLoading, error, refetch } = useGetTrending({ regionCode });

  const handleUseKeyword = (title: string) => {
    setLocation(`/?keyword=${encodeURIComponent(title)}`);
  };

  // Backend already formats these — display as-is

  return (
    <div className="bg-background text-foreground p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="space-y-4 border-b border-border pb-6 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-primary text-primary-foreground p-2 rounded-xl shadow-lg shadow-primary/20">
                  <TrendingUp className="w-7 h-7" />
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                  Konten Trending YouTube
                </h1>
              </div>
              <p className="text-muted-foreground text-lg max-w-2xl">
                Lihat video paling trending saat ini dan gunakan judulnya sebagai inspirasi keyword.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-muted-foreground">Region:</span>
              <Select value={regionCode} onValueChange={setRegionCode}>
                <SelectTrigger className="w-[180px] bg-card border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {REGIONS.map((region) => (
                    <SelectItem key={region.code} value={region.code}>
                      {region.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </header>

        {/* Ad — below header, above video grid */}
        <AdBanner className="opacity-90" />

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, i) => (
              <Card key={i} className="border-border bg-card overflow-hidden">
                <CardContent className="p-0">
                  <Skeleton className="w-full h-48 rounded-none" />
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {error && (
          <Card className="border-destructive bg-destructive/5">
            <CardContent className="p-8 text-center space-y-4">
              <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
              <div>
                <h3 className="text-lg font-bold text-foreground mb-2">Gagal Memuat Video Trending</h3>
                <p className="text-muted-foreground mb-4">
                  Terjadi kesalahan saat mengambil data. Silakan coba lagi.
                </p>
                <Button onClick={() => refetch()} variant="destructive">
                  Coba Lagi
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {!isLoading && !error && data && data.videos.length === 0 && (
          <Card className="border-border bg-card">
            <CardContent className="p-12 text-center">
              <TrendingUp className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-30" />
              <h3 className="text-lg font-bold text-foreground mb-2">Tidak Ada Video Trending</h3>
              <p className="text-muted-foreground">
                Tidak ada video trending untuk region ini saat ini.
              </p>
            </CardContent>
          </Card>
        )}

        {!isLoading && !error && data && data.videos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
            {data.videos.map((video, index) => (
              <motion.div
                key={video.videoId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card 
                  className="border-border bg-card hover:border-primary/50 transition-all duration-300 overflow-hidden group h-full flex flex-col"
                  data-testid={`card-trending-video-${video.videoId}`}
                >
                  <CardContent className="p-0 flex flex-col h-full">
                    {/* Thumbnail */}
                    <div className="relative overflow-hidden bg-black">
                      <img 
                        src={video.thumbnailUrl} 
                        alt={video.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {/* Rank Badge */}
                      <div className="absolute top-3 left-3 bg-primary text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center font-black text-base shadow-lg">
                        #{video.rank}
                      </div>
                      {/* Duration Badge */}
                      {video.duration && (
                        <div className="absolute bottom-3 right-3 bg-black/90 text-white px-2 py-1 rounded text-xs font-bold backdrop-blur-sm">
                          {video.duration}
                        </div>
                      )}
                      {/* Play Overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                        <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-3 flex flex-col flex-1">
                      {/* Title */}
                      <h3 
                        className="font-bold text-base leading-snug line-clamp-2 text-foreground min-h-[2.5rem]"
                        title={video.title}
                        data-testid={`text-video-title-${video.videoId}`}
                      >
                        {video.title}
                      </h3>

                      {/* Channel */}
                      <p className="text-sm text-muted-foreground font-medium" data-testid={`text-channel-name-${video.videoId}`}>
                        {video.channelName}
                      </p>

                      {/* Stats */}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium">
                        <span className="flex items-center gap-1.5" data-testid={`text-view-count-${video.videoId}`}>
                          <Eye className="w-3.5 h-3.5" />
                          {video.viewCount}
                        </span>
                        <span className="flex items-center gap-1.5" data-testid={`text-published-at-${video.videoId}`}>
                          <Clock className="w-3.5 h-3.5" />
                          {video.publishedAt}
                        </span>
                      </div>

                      {/* Use Keyword Button */}
                      <div className="pt-2 mt-auto">
                        <Button 
                          onClick={() => handleUseKeyword(video.title)}
                          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold gap-2 shadow-md shadow-primary/20"
                          data-testid={`button-use-keyword-${video.videoId}`}
                        >
                          <Sparkles className="w-4 h-4" />
                          Gunakan Keyword
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
