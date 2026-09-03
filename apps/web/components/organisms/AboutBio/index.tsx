import SectionHeading from '@/components/molecules/SectionHeading'

const AboutBio = () => (
  <section className="py-16 border-t border-[var(--border)]">
    <SectionHeading num="01" label="THE LONGER VERSION" title="A bit about me" />
    <div className="columns-2 gap-10 max-[760px]:columns-1">
      <p className="text-[15px] leading-[1.7] text-[var(--text)] mt-0 mb-[1.1em] text-wrap-pretty break-inside-avoid first-letter:text-[var(--accent)] first-letter:font-[family-name:var(--font-mono)] first-letter:text-[2em] first-letter:font-semibold first-letter:float-left first-letter:leading-[0.8] first-letter:mr-1 first-letter:mt-1">
        I&apos;m a self-taught Software and AI engineer. My path into tech didn&apos;t follow the
        typical script — I completed an{' '}
        <strong className="text-[var(--text-bright)] font-semibold">MSc in Physics</strong> at
        Central University of Tamil Nadu, then made a deliberate pivot into software. Not because I
        had to, but because I was already spending more time writing code than doing anything else.
        That pull was the signal.
      </p>
      <p className="text-[15px] leading-[1.7] text-[var(--text)] mt-0 mb-[1.1em] text-wrap-pretty break-inside-avoid">
        I went through an intensive full-stack program at{' '}
        <strong className="text-[var(--text-bright)] font-semibold">Brototype</strong>, but the real
        learning happened the way it always does: by building things, breaking them, and figuring
        out why. I went deep on the <em className="text-[var(--accent)] not-italic">MERN stack</em>{' '}
        — not just the happy path, but the architecture underneath it. Clean architecture,
        microservices, real-time systems with WebRTC and Kafka, cloud deployments on Azure and AWS.
        I wanted to understand how production software actually holds together, not just how to make
        a demo work.
      </p>
      <p className="text-[15px] leading-[1.7] text-[var(--text)] mt-0 mb-[1.1em] text-wrap-pretty break-inside-avoid">
        Now I work as a Software Engineer at an{' '}
        <em className="text-[var(--accent)] not-italic">AI company in Bangalore</em>, which is
        exactly where I wanted to be. The intersection of solid engineering and applied AI is where
        the most interesting problems live. I write TypeScript and Node.js daily, I care about
        systems that are maintainable and testable, and I&apos;m constantly exploring how LLMs can
        be wired into real products — not just as demos, but as things people actually rely on.
      </p>
      <p className="text-[15px] leading-[1.7] text-[var(--text)] mt-0 mb-0 text-wrap-pretty break-inside-avoid">
        The physics background is more useful than it sounds. It trained a way of thinking —
        breaking a problem down to fundamentals before reaching for a tool, staying skeptical of the
        first answer, and sitting with uncertainty until something actually makes sense. That
        mindset travels well into engineering.
      </p>
    </div>
  </section>
)

export default AboutBio
