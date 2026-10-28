import type { LayoutId } from "@/lib/layouts";

// Miniaturas esquemáticas de cada layout, usadas na landing, no cadastro do portal e em Aparência.
const T = ({ w = "100%", h = 6 }: { w?: string; h?: number }) => (
  <div className="rounded-[2px] bg-ink/85" style={{ width: w, height: h }} />
);
const P = ({ w = "100%" }: { w?: string }) => <div className="mt-1 h-[4px] rounded-[2px] bg-ink/15" style={{ width: w }} />;
const Img = ({ h, className = "" }: { h: number; className?: string }) => (
  <div className={`rounded-[3px] bg-[#d7dce4] ${className}`} style={{ height: h }} />
);

export function LayoutThumb({ layout, color = "#2F5BFF" }: { layout: LayoutId; color?: string }) {
  return (
    <div className="aspect-[4/3] overflow-hidden bg-white p-2.5 select-none" aria-hidden="true">
      {layout === "classico" && (
        <>
          <div className="mx-auto h-[7px] w-1/2 rounded-[2px] bg-ink" />
          <div className="my-1.5 h-[8px] rounded-[2px]" style={{ background: color }} />
          <div className="grid grid-cols-[2fr_1fr] gap-1.5">
            <div><Img h={46} /><T h={5} /><P /></div>
            <div className="space-y-1.5"><T /><P /><T /><P /><T /><P /></div>
          </div>
          <div className="mt-1.5 grid grid-cols-3 gap-1"><Img h={18} /><Img h={18} /><Img h={18} /></div>
        </>
      )}
      {layout === "feed" && (
        <>
          <div className="-m-2.5 mb-1.5 flex h-[16px] items-center px-2.5" style={{ background: color }}>
            <div className="h-[5px] w-10 rounded-[2px] bg-white" />
          </div>
          <div className="grid grid-cols-[1.4fr_1fr] gap-1.5">
            <div><Img h={36} /><T h={5} /><P w="80%" /><P w="60%" /></div>
            <div className="space-y-1"><T /><P /><T w="80%" /><P /></div>
          </div>
          <div className="mt-1.5 space-y-1.5 border-t border-ink/10 pt-1.5">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex gap-1.5"><Img h={14} className="w-[24px] shrink-0" /><div className="flex-1"><T h={4} /><P w="70%" /></div></div>
            ))}
          </div>
        </>
      )}
      {layout === "revista" && (
        <>
          <div className="mb-1.5 flex items-center justify-between"><div className="h-[6px] w-12 rounded-[2px] bg-ink" /><div className="h-[4px] w-16 rounded-[2px] bg-ink/15" /></div>
          <div className="relative -mx-2.5 h-[62px] bg-[#9aa6b5]">
            <div className="absolute right-6 bottom-2 left-2.5 space-y-1"><div className="h-[6px] rounded-[2px] bg-white" /><div className="h-[6px] w-2/3 rounded-[2px] bg-white" /></div>
          </div>
          <div className="mt-1.5 grid grid-cols-3 gap-1">
            {[0, 1, 2].map((i) => <div key={i}><Img h={22} /><div className="mt-1"><T h={4} /></div></div>)}
          </div>
        </>
      )}
      {layout === "plantao" && (
        <>
          <div className="flex items-center justify-between"><div className="h-[6px] w-12 rounded-[2px] bg-ink" /><div className="rounded-[2px] bg-red-600 px-1 text-[5px] leading-[8px] font-bold text-white">AO VIVO</div></div>
          <div className="my-1.5 h-[5px] rounded-[2px]" style={{ background: color }} />
          <div className="grid grid-cols-[1.6fr_1fr] gap-1.5">
            <div className="space-y-1.5 border-l-2 pl-1.5" style={{ borderColor: color }}>
              {[0, 1, 2, 3, 4].map((i) => <div key={i}><T h={4} w={`${90 - i * 6}%`} /><P w="60%" /></div>)}
            </div>
            <div className="space-y-1"><Img h={24} /><T h={4} /><Img h={24} /></div>
          </div>
        </>
      )}
      {layout === "coluna" && (
        <div className="px-5">
          <div className="mx-auto h-[6px] w-1/2 rounded-[2px] bg-ink" />
          <div className="mx-auto mt-1 mb-2 h-[3px] w-1/3 rounded-[2px] bg-ink/15" />
          <Img h={36} />
          <div className="mt-1.5 space-y-0.5"><T h={5} /><T h={5} w="60%" /></div>
          <P /><P w="85%" />
          <div className="mt-1.5 border-t border-ink/10 pt-1.5"><T h={4} /><P /></div>
          <div className="mt-1.5 border-t border-ink/10 pt-1.5"><T h={4} w="80%" /></div>
        </div>
      )}
    </div>
  );
}
