import Placeholder from "@/components/Placeholder";
import TextReveal from "@/components/TextReveal";
import { editingPhilosophy, introParagraphs } from "@/lib/content";

export default function Intro() {
  return (
    <section
      id="about"
      className="relative w-full bg-background px-6 py-24 sm:px-10 md:px-14 md:py-32"
    >
      <div className="mb-10 text-[11px] uppercase tracking-[0.2em] text-muted">
        About
      </div>

      <Placeholder
        label="[TODO] 자기소개 문구"
        className="mb-12 h-28 w-full max-w-2xl sm:h-32"
      />

      <div className="grid gap-12 md:grid-cols-2 md:gap-16">
        <div className="space-y-2">
          {introParagraphs.map((line, i) => (
            <TextReveal
              key={i}
              as="p"
              className="text-base leading-relaxed text-foreground sm:text-lg"
            >
              {line}
            </TextReveal>
          ))}
        </div>

        <TextReveal
          as="p"
          className="text-lg leading-relaxed text-muted sm:text-xl"
        >
          {editingPhilosophy}
        </TextReveal>
      </div>
    </section>
  );
}
