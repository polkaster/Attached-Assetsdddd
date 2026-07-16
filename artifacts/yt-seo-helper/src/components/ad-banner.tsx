import { useEffect, useRef } from 'react';

interface AdBannerProps {
  className?: string;
}

export function AdBanner({ className = '' }: AdBannerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const loaded = useRef(false);

  useEffect(() => {
    if (!ref.current || loaded.current) return;
    loaded.current = true;

    const script = document.createElement('script');
    script.src =
      'https://pl30385756.effectivecpmnetwork.com/e3/00/dd/e300dd405e6ccaf6a88177d9f9656ebc.js';
    script.async = true;
    ref.current.appendChild(script);
  }, []);

  return (
    <div
      className={`w-full flex justify-center items-center overflow-hidden rounded-xl ${className}`}
      style={{ minHeight: '90px' }}
    >
      <div ref={ref} className="w-full flex justify-center" />
    </div>
  );
}
