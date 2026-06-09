"use client";

// Live "upcoming closures" list for a bridge page. Scheduled closures arrive on
// the same WebSocket feed as the status, so this is a client island on top of the
// otherwise server-rendered (ISR) page. Times are reformatted per-locale here
// because the shared FutureClosure.formattedTimeRange is en-only (iOS parity).
import { useLocale, useTranslations } from "next-intl";
import { useData } from "@/lib/useData";
import type { FutureClosure } from "@/lib/bridges";

function intlLocale(locale: string): string {
  return locale === "fr" ? "fr-CA" : locale === "es" ? "es-MX" : "en-CA";
}

function formatRange(
  fc: FutureClosure,
  intl: string,
  lbl: { today: string; tomorrow: string; allDay: string },
): string {
  const start = new Date(fc.time);
  const now = new Date();
  const day = (d: Date): string => {
    const ds = d.toDateString();
    if (ds === now.toDateString()) return lbl.today;
    const tm = new Date(now);
    tm.setDate(tm.getDate() + 1);
    if (ds === tm.toDateString()) return lbl.tomorrow;
    return d.toLocaleDateString(intl, { weekday: "short", month: "short", day: "numeric" });
  };
  const clock = (d: Date): string =>
    d.toLocaleTimeString(intl, { hour: "numeric", minute: "2-digit" });

  if (!fc.endTime) return `${day(start)} ${clock(start)}`;
  const end = new Date(fc.endTime);
  const sameDay = start.toDateString() === end.toDateString();
  const allDay =
    start.getHours() === 0 &&
    start.getMinutes() === 0 &&
    end.getHours() === 23 &&
    end.getMinutes() === 59;
  if (allDay) {
    return sameDay
      ? `${day(start)} (${lbl.allDay})`
      : `${day(start)} – ${day(end)} (${lbl.allDay})`;
  }
  if (sameDay) return `${day(start)} ${clock(start)} – ${clock(end)}`;
  return `${day(start)} ${clock(start)} – ${day(end)} ${clock(end)}`;
}

export function LiveClosures({ apiId }: { apiId: string }): React.ReactElement {
  const locale = useLocale();
  const t = useTranslations("bridgePages");
  const tStatus = useTranslations("bridgeStatus");
  const { bridges, loading } = useData();
  const bridge = bridges.find((b) => b.id === apiId);

  // Before hydration / first data load: neutral placeholder so nothing live is
  // baked into the cached HTML and the row doesn't shift.
  if (!bridge) {
    return (
      <p className="min-h-[1.5rem] text-xs text-white/40">
        {loading ? tStatus("checking") : t("noClosures")}
      </p>
    );
  }

  const closures = bridge.futureClosures;
  if (closures.length === 0) {
    return <p className="text-xs text-white/50">{t("noClosures")}</p>;
  }

  const intl = intlLocale(locale);
  const lbl = {
    today: t("closureToday"),
    tomorrow: t("closureTomorrow"),
    allDay: t("closureAllDay"),
  };

  return (
    <ul className="-my-1 divide-y divide-white/5">
      {closures.map((fc, i) => (
        <li key={i} className="flex items-center justify-between gap-4 py-2.5">
          <span className="inline-flex items-center gap-2.5 text-sm text-white/85">
            <span
              aria-hidden
              className={`h-2 w-2 shrink-0 rounded-full ${
                fc.type === "Construction" ? "bg-amber-400" : "bg-sky-400"
              }`}
            />
            {fc.type === "Construction"
              ? t("closureConstruction")
              : fc.type === "Boat"
                ? t("closureBoat")
                : fc.type}
          </span>
          <span className="text-right text-sm tabular-nums text-white/60">
            {formatRange(fc, intl, lbl)}
          </span>
        </li>
      ))}
    </ul>
  );
}
