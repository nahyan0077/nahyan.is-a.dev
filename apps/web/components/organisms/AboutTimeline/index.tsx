import SectionHeading from '@/components/molecules/SectionHeading'
import TimelineRow from '@/components/molecules/TimelineRow'

const TIMELINE = [
  {
    when: '2025',
    title: 'Software Engineer at an AI company',
    body: 'Joined an AI-focused product company in Bangalore. Working across the full stack — TypeScript, Node.js, React — on tools that wire LLMs and intelligent automation into real workflows. Exactly where the interesting problems are.',
  },
  {
    when: '2024',
    title: 'First professional role',
    body: "Landed my first engineering job after completing Brototype's intensive MERN program. Went from building projects to owning features in a real codebase, real users, real consequences. The gap between training and production turned out to be where most of the learning happens.",
  },
  {
    when: '2023',
    title: 'Brototype — going deep on the stack',
    body: "Joined Brototype's intensive full-stack program and treated it as a launchpad, not a course. Built EduVerse — a full e-learning platform with microservices, Kafka, WebRTC video calls, and a CI/CD pipeline on Azure. Built DropShip — a production e-commerce platform deployed on AWS EC2. The goal was always: understand the architecture, not just make it work.",
  },
  {
    when: '2021',
    title: 'MSc Physics → decided to pivot',
    body: "Completed a postgraduate degree in Physics at Central University of Tamil Nadu. By the time I finished, I was already spending more hours writing code than studying physics. The pivot wasn't a backup plan — it was where the energy was pointing.",
  },
  {
    when: '~2020',
    title: 'Self-taught from zero',
    body: 'Started learning to code independently — no bootcamp, no formal CS degree, just documentation, projects, and stubbornness. JavaScript first, then Node.js, then everything else. Built small projects, broke them, understood why, rebuilt them better.',
  },
]

const AboutTimeline = () => (
  <section className="py-16 border-t border-[var(--border)]">
    <SectionHeading num="03" label="HOW I GOT HERE" title="The short timeline" />
    <div>
      {TIMELINE.map((t) => (
        <TimelineRow key={t.when} {...t} />
      ))}
    </div>
  </section>
)

export default AboutTimeline
