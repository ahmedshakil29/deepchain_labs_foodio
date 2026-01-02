export default function FoodItemCardSkeleton() {
  return (
    <div
      className="relative w-[280px] h-[300px] bg-[#FEF7EA] overflow-hidden"
      style={{ borderTopRightRadius: "34px", borderBottomLeftRadius: "34px" }}
    >
      {/* Image skeleton */}
      <div
        className="absolute bg-gray-200 animate-pulse rounded-full"
        style={{
          width: "200px",
          height: "200px",
          top: "-60px",
          left: "-50px",
        }}
      />

      {/* Text skeleton */}
      <div className="absolute left-[56px] right-[20px] top-[150px] space-y-3">
        <div className="h-5 w-3/4 bg-gray-200 animate-pulse rounded" />
        <div className="h-3 w-full bg-gray-200 animate-pulse rounded" />
        <div className="h-3 w-5/6 bg-gray-200 animate-pulse rounded" />
        <div className="h-6 w-1/3 bg-gray-300 animate-pulse rounded mt-4" />
      </div>

      {/* Button skeleton */}
      <div className="absolute bottom-5 left-3/4 -translate-x-1/2 translate-y-1/2">
        <div className="w-[140px] h-[45px] bg-gray-300 animate-pulse rounded-full" />
      </div>
    </div>
  );
}
