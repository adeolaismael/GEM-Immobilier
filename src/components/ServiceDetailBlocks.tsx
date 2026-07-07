import type { ServiceDetailBlock } from "@/lib/services-detail-content";

type Props = {
  blocks: ServiceDetailBlock[];
};

export function ServiceDetailBlocks({ blocks }: Props) {
  return (
    <div className="mt-6 space-y-6 text-base leading-7 text-[color:var(--foreground)]">
      {blocks.map((b, i) => {
        if (b.type === "p") {
          return <p key={i}>{b.text}</p>;
        }
        if (b.type === "h3") {
          return (
            <h3 key={i} className="text-lg font-bold tracking-tight text-[color:var(--foreground)]">
              {b.text}
            </h3>
          );
        }
        if (b.type === "ul") {
          return (
            <ul key={i} className="list-none space-y-3 pl-0">
              {b.items.map((item, j) => (
                <li key={j} className="flex gap-3">
                  <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--brand)]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          );
        }
        if (b.type === "ol") {
          return (
            <ol
              key={i}
              className="list-decimal space-y-3 pl-6 marker:font-semibold marker:text-[color:var(--brand)]"
            >
              {b.items.map((item, j) => (
                <li key={j} className="pl-1">
                  {item}
                </li>
              ))}
            </ol>
          );
        }
        return null;
      })}
    </div>
  );
}
