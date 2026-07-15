import { useState, useMemo, useEffect } from 'react';
import { Copy, Info, CheckCircle2, Youtube, LayoutDashboard, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useLocation } from 'wouter';

export default function Home() {
  const [location] = useLocation();
  const [keyword, setKeyword] = useState('');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const { toast } = useToast();

  // Read keyword from URL search params on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlKeyword = params.get('keyword');
    if (urlKeyword) {
      setKeyword(urlKeyword);
      // Clear the URL param after setting the keyword
      window.history.replaceState({}, '', location.split('?')[0]);
    }
  }, [location]);

  const { score, hasKeywordInTitle, hasKeywordInDesc } = useMemo(() => {
    let score = 0;
    const k = keyword.trim().toLowerCase();
    const t = title.trim().toLowerCase();
    const d = desc.trim().toLowerCase();

    let hasKeywordInTitle = false;
    let hasKeywordInDesc = false;

    if (k) {
      if (t.includes(k)) {
        score += 40;
        hasKeywordInTitle = true;
      }
      if (d.includes(k)) {
        score += 20;
        hasKeywordInDesc = true;
      }
    }

    if (t.length > 0) {
      if (t.length >= 40 && t.length <= 70) {
        score += 20;
      } else {
        score += 10;
      }
    }

    if (d.length > 0) {
      if (d.length > 200) {
        score += 20;
      } else if (d.length > 50) {
        score += 10;
      }
    }

    return { score: Math.min(100, score), hasKeywordInTitle, hasKeywordInDesc };
  }, [keyword, title, desc]);

  const optimizedTitle = useMemo(() => {
    if (!keyword.trim()) return '';
    if (hasKeywordInTitle) {
      return `✅ Judul Anda sudah mengandung Keyword! (Coba tambahkan emoji atau angka, misal: [2025])`;
    }
    return `💡 Saran Judul: ${keyword.trim()} - Cara Mudah & Cepat | Tutorial Lengkap 2025`;
  }, [keyword, hasKeywordInTitle]);

  const optimizedDesc = useMemo(() => {
    const k = keyword.trim();
    if (!k) return '';
    const kNoSpaces = k.replace(/\s+/g, '');
    return `${k} - Di video ini kita akan membahas tentang ${k}. Pastikan tonton sampai habis!\n\n👇 Ringkasan:\n- Apa itu ${k}?\n- Tips terbaik ${k}\n\n🔗 Follow Saya:\nInstagram: https://instagram.com/\nTikTok: https://tiktok.com/@\n\n#${kNoSpaces} #SEO #YouTubeIndonesia`;
  }, [keyword]);

  const generatedTags = useMemo(() => {
    const k = keyword.trim();
    if (!k) return '';
    return `${k}, ${k} tutorial, ${k} indonesia, cara ${k}, tips ${k}, review ${k}, ${k} 2025, ${k} mudah`;
  }, [keyword]);

  const handleCopy = (text: string, label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast({
      title: "Berhasil disalin!",
      description: `${label} telah disalin ke clipboard.`,
    });
  };

  const getScoreColor = () => {
    if (score >= 80) return 'text-green-500 stroke-green-500';
    if (score >= 50) return 'text-orange-500 stroke-orange-500';
    return 'text-red-500 stroke-red-500';
  };

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-background text-foreground p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="space-y-3 border-b border-border pb-6 pt-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary text-primary-foreground p-2 rounded-xl shadow-lg shadow-primary/20">
              <Youtube className="w-8 h-8" />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              YouTube SEO <span className="text-muted-foreground font-light">&</span> Algorithm Helper
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Buat metadata yang disukai algoritma agar video mudah ditemukan.
          </p>
        </header>

        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-8 md:gap-12 items-start pb-12">
          {/* Left Column: Input */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-3 tracking-tight">
              <span className="flex items-center justify-center bg-secondary text-secondary-foreground w-8 h-8 rounded-full text-sm shadow-sm">1</span>
              Masukkan Data Video
            </h2>

            <Card className="border-border bg-card shadow-sm border-t-4 border-t-secondary">
              <CardContent className="p-6 md:p-8 space-y-8">
                <div className="space-y-3">
                  <Label htmlFor="keyword" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Kata Kunci Utama (Keyword)</Label>
                  <Input 
                    id="keyword" 
                    placeholder="Contoh: Cara Masak Nasi Goreng" 
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="bg-input border-border focus-visible:ring-primary h-12 text-lg px-4 font-medium placeholder:font-normal"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-baseline">
                    <Label htmlFor="title" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Judul Video Saat Ini</Label>
                    <span className={`text-xs font-mono ${title.length > 70 ? 'text-destructive font-bold' : 'text-muted-foreground'}`}>{title.length}/70</span>
                  </div>
                  <Input 
                    id="title" 
                    placeholder="Judul draft Anda..." 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={`bg-input border-border focus-visible:ring-primary h-12 text-base px-4 ${title.length > 70 ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                  />
                  {title.length > 70 && (
                    <p className="text-xs text-destructive flex items-center gap-1.5 mt-1.5 font-medium">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Judul terlalu panjang (ideal: 40-70 karakter).
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-baseline">
                    <Label htmlFor="desc" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Deskripsi Singkat</Label>
                    <span className="text-xs font-mono text-muted-foreground">{desc.length} char</span>
                  </div>
                  <Textarea 
                    id="desc" 
                    placeholder="Isi video ini tentang apa?" 
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    className="bg-input border-border focus-visible:ring-primary min-h-[140px] resize-y text-base p-4 leading-relaxed"
                  />
                </div>

                <div className="bg-primary/10 border border-primary/20 rounded-xl p-5 flex gap-4 text-sm text-foreground">
                  <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-primary mb-1.5">Tips Algoritma:</p>
                    <p className="text-muted-foreground leading-relaxed">Pastikan Kata Kunci Utama ada di <strong className="text-foreground">60 karakter pertama</strong> Judul dan Deskripsi untuk memaksimalkan potensi pencarian.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Results */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-3 tracking-tight">
              <span className="flex items-center justify-center bg-secondary text-secondary-foreground w-8 h-8 rounded-full text-sm shadow-sm">2</span>
              Hasil Optimasi
            </h2>

            <Card className="border-border bg-card shadow-sm overflow-hidden border-t-4 border-t-primary">
              <CardContent className="p-0">
                <div className="p-6 md:p-8 flex flex-col sm:flex-row items-center gap-8 bg-gradient-to-b from-card to-secondary/10 border-b border-border">
                  {/* SEO Score Ring */}
                  <div className="relative flex shrink-0 justify-center items-center">
                    <svg width="180" height="180" viewBox="0 0 180 180" className="transform -rotate-90 drop-shadow-xl">
                      <circle 
                        cx="90" cy="90" r={radius} 
                        fill="none" 
                        stroke="currentColor" 
                        className="text-secondary stroke-secondary" 
                        strokeWidth="12" 
                      />
                      <motion.circle
                        cx="90" cy="90" r={radius}
                        fill="none"
                        className={getScoreColor()}
                        strokeWidth="12"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center text-center">
                      <span className="text-5xl font-black tracking-tighter tabular-nums">{score}</span>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold mt-1">Score</span>
                    </div>
                  </div>

                  {/* Score details */}
                  <div className="flex-1 space-y-4 w-full">
                    <h3 className="font-bold text-lg border-b border-border pb-3 flex items-center gap-2">
                      <LayoutDashboard className="w-4 h-4 text-muted-foreground" />
                      Analisis Metadata
                    </h3>
                    <ul className="space-y-3 text-sm font-medium">
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className={`h-4 w-4 mt-0.5 shrink-0 ${hasKeywordInTitle ? 'text-green-500' : 'text-muted-foreground/30'}`} />
                        <span className={hasKeywordInTitle ? 'text-foreground' : 'text-muted-foreground'}>Keyword di Judul <span className="opacity-50 ml-1">(+40)</span></span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className={`h-4 w-4 mt-0.5 shrink-0 ${title.length >= 40 && title.length <= 70 ? 'text-green-500' : title.length > 0 ? 'text-orange-500' : 'text-muted-foreground/30'}`} />
                        <span className={title.length > 0 ? 'text-foreground' : 'text-muted-foreground'}>
                          Panjang Judul Ideal <span className="opacity-50 ml-1">(+{title.length >= 40 && title.length <= 70 ? 20 : title.length > 0 ? 10 : 0})</span>
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className={`h-4 w-4 mt-0.5 shrink-0 ${hasKeywordInDesc ? 'text-green-500' : 'text-muted-foreground/30'}`} />
                        <span className={hasKeywordInDesc ? 'text-foreground' : 'text-muted-foreground'}>Keyword di Deskripsi <span className="opacity-50 ml-1">(+20)</span></span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className={`h-4 w-4 mt-0.5 shrink-0 ${desc.length > 200 ? 'text-green-500' : desc.length > 50 ? 'text-orange-500' : 'text-muted-foreground/30'}`} />
                        <span className={desc.length > 0 ? 'text-foreground' : 'text-muted-foreground'}>
                          Panjang Deskripsi <span className="opacity-50 ml-1">(+{desc.length > 200 ? 20 : desc.length > 50 ? 10 : 0})</span>
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="p-6 md:p-8 space-y-8 bg-card">
                  <ResultBox 
                    title="Judul Optimasi (AI Suggestion)" 
                    copyLabel="Salin Judul"
                    content={optimizedTitle}
                    onCopy={() => handleCopy(optimizedTitle, "Judul")}
                  />
                  <ResultBox 
                    title="Deskripsi Siap Upload" 
                    copyLabel="Salin Deskripsi"
                    content={optimizedDesc}
                    onCopy={() => handleCopy(optimizedDesc, "Deskripsi")}
                  />
                  <ResultBox 
                    title="Tag / Keywords" 
                    copyLabel="Salin Tag"
                    content={generatedTags}
                    onCopy={() => handleCopy(generatedTags, "Tag")}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function ResultBox({ title, copyLabel, content, onCopy }: { title: string, copyLabel: string, content: string, onCopy: () => void }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-end">
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{title}</h3>
        <Button variant="secondary" size="sm" onClick={onCopy} className="h-8 gap-2 px-3 hover:bg-secondary text-xs font-semibold" disabled={!content}>
          <Copy className="h-3.5 w-3.5" />
          {copyLabel}
        </Button>
      </div>
      <div className="bg-[#0A0A0A] rounded-xl p-5 font-mono text-[13px] leading-[1.7] text-foreground whitespace-pre-wrap border border-border shadow-inner relative group">
        {!content ? (
          <span className="text-muted-foreground/50 italic">Masukkan kata kunci untuk melihat hasil...</span>
        ) : (
          content
        )}
      </div>
    </div>
  );
}
