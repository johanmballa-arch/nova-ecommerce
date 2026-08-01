import { Package, Star, Headphones, Laptop, Smartphone, Watch, Speaker, Camera, Tablet, Keyboard } from "lucide-react";

export const ICONS: Record<string, any> = {
  Headphones, Laptop, Smartphone, Watch, Speaker, Camera, Tablet, Keyboard, Package
};

export function Icon({ name, size = 28 }: { name: string; size?: number }) {
  const C = ICONS[name] || Package;
  return <C size={size} strokeWidth={1.6} />;
}

export function Stars({ rating }: { rating: number }) {
  return (
    <span className="lq-rating">
      <Star size={13} fill="currentColor" color="#ffce54" style={{ color: "#ffce54" }} />
      {rating}
    </span>
  );
}