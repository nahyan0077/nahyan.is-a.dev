import SectionHeading from '@/components/molecules/SectionHeading'
import NowCard from '@/components/molecules/NowCard'

const CURRENTLY = [
  {
    verb: 'BUILDING',
    what: 'AI-powered tools that ship to production',
    detail: 'Wiring LLMs into real workflows — not just demos, but things people rely on.',
  },
  {
    verb: 'READING',
    what: 'System Design Interview by Alex Xu',
    detail: 'Sharpening the architecture muscle. Patterns that scale.',
  },
  {
    verb: 'LEARNING',
    what: 'RAG pipelines and vector search',
    detail: 'Building context-aware AI systems with embeddings and retrieval.',
  },
]

const AboutCurrently = () => (
  <section className="py-16 border-t border-[var(--border)]">
    <SectionHeading num="05" label="RIGHT NOW" title="Currently" />
    <div className="grid grid-cols-3 gap-4 max-[760px]:grid-cols-1">
      {CURRENTLY.map((c) => (
        <NowCard key={c.verb} {...c} />
      ))}
    </div>
  </section>
)

export default AboutCurrently
