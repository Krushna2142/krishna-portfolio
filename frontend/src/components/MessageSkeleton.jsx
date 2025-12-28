export default function MessageSkeleton() {
  return (
    <div className="animate-pulse p-4 bg-gradient-to-r from-black/20 to-transparent border border-white/3 rounded-xl">
      <div className="h-4 w-1/3 bg-white/10 rounded mb-3"></div>
      <div className="h-3 w-3/4 bg-white/6 rounded mb-2"></div>
      <div className="h-3 w-1/2 bg-white/6 rounded"></div>
    </div>
  );
}
