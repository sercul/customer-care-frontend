export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="relative">
        <div className="h-12 w-12">
          <div className="absolute h-12 w-12 rounded-full border-4 border-solid border-indigo-100"></div>
          <div className="absolute h-12 w-12 rounded-full border-4 border-solid border-indigo-500 border-t-transparent animate-spin"></div>
        </div>
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
} 