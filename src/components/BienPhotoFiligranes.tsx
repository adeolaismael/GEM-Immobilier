import { getStatutFiligraneLabel } from "@/lib/bien-statut";

type Props = {
  statut?: string;
  showStatutFiligrane?: boolean;
};

export function BienLogoFiligrane() {
  return (
    <div
      className="pointer-events-none absolute right-0 bottom-0 rounded-tl-md bg-black/40 px-2 py-1 text-xs font-semibold tracking-wide text-white"
      aria-hidden="true"
    >
      GEM IMMOBILIER
    </div>
  );
}

export function BienStatutFiligrane({ statut }: { statut: string }) {
  const label = getStatutFiligraneLabel(statut);
  if (!label) return null;

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      <div className="absolute top-1/2 left-1/2 w-[150%] -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-red-600/70 py-3 text-center shadow-md">
        <span className="text-base font-bold tracking-[0.2em] text-white md:text-lg">
          {label}
        </span>
      </div>
    </div>
  );
}

export function BienPhotoFiligranes({
  statut,
  showStatutFiligrane = true,
}: Props) {
  return (
    <>
      {showStatutFiligrane && statut ? (
        <BienStatutFiligrane statut={statut} />
      ) : null}
      <BienLogoFiligrane />
    </>
  );
}
