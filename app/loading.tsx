export default function Loading() {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f6fa]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-[#5932ea] border-t-transparent" />
          <p className="text-sm font-medium text-[#acacac]">Loading...</p>
        </div>
      </div>
    );
  }