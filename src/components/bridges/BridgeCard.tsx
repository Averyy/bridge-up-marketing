// Bridge card used on the Bridge Info list, region hubs, and the "nearby bridges"
// section. Glass-overlay styling mirrors the map popup (translucent + backdrop
// blur + hairline border). Server component: the static parts render on the
// server; the live status is the hydrated <LiveStatus> island inside.
import { Link } from "@/i18n/navigation";
import { LiveStatus } from "./LiveStatus";

interface Props {
  apiId: string;
  href: string;
  name: string;
  statText: string;
}

export function BridgeCard({ apiId, href, name, statText }: Props): React.ReactElement {
  return (
    <Link
      href={href}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] p-5 shadow-xl shadow-black/20 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.1]"
    >
      {/* glass top highlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
      />
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-white">{name}</h3>
        <svg
          aria-hidden
          className="h-4 w-4 flex-shrink-0 text-white/30 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-white/60"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </div>
      <div className="mt-3">
        <LiveStatus apiId={apiId} iconSize={28} />
      </div>
      <div className="mt-4 border-t border-white/10 pt-3 text-sm text-white/60">{statText}</div>
    </Link>
  );
}
