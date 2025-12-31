// components/Footer.tsx
export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-[#FAFAF8]">
      <div className="mx-auto max-w-7xl px-6 py-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Left side */}
        <p className="text-sm text-neutral-600">
          <span className="font-semibold text-neutral-900">Foodio.</span> © 2025
          Foodio Inc.
        </p>

        {/* Right side */}
        <div className="flex items-center gap-6 text-sm text-neutral-500">
          <a href="#" className="hover:text-neutral-900 transition">
            Privacy
          </a>
          <a href="#" className="hover:text-neutral-900 transition">
            Terms
          </a>
          <a href="#" className="hover:text-neutral-900 transition">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
