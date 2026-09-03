'use client'
import { LightboxImage } from '@/components/atoms/ImageLightbox'
import SectionHeading from '@/components/molecules/SectionHeading'

const shots = [
  {
    src: '/profile.jpg',
    alt: 'My working setup',
    label: '~/me/setup.webp',
  },
  {
    src: '/profile.jpg',
    alt: 'Working remotely',
    label: '~/me/remote.webp',
  },
  {
    src: '/profile.jpg',
    alt: 'Enjoying a coffee',
    label: '~/me/coffee.webp',
  },
  {
    src: '/profile.jpg',
    alt: 'Team work',
    label: '~/me/team.webp',
  },
  {
    src: '/profile.jpg',
    alt: 'Working and enjoying',
    label: '~/me/flow.webp',
  },
  {
    src: '/profile.jpg',
    alt: 'Working from the office',
    label: '~/me/office.webp',
  },
]

const AboutGallery = () => (
  <section className="py-16 border-t border-[var(--border)]">
    <SectionHeading num="02" label="OFF THE CLOCK" title="A few moments" />
    <div className="columns-3 gap-3 max-[640px]:columns-2">
      {shots.map(({ src, alt, label }) => (
        <div
          key={src}
          className="break-inside-avoid mb-3 relative border border-[var(--border)] rounded-xl overflow-hidden bg-[var(--surface)] transition-[border-color,transform] duration-200 hover:border-[var(--accent)] hover:-translate-y-0.5"
        >
          <LightboxImage src={src} alt={alt} />
          <span className="absolute bottom-2.5 left-2.5 font-[family-name:var(--font-mono)] text-[10px] text-[var(--text-dim)] bg-[var(--surface)]/80 px-2 py-0.5 rounded-[4px] backdrop-blur-sm">
            {label}
          </span>
        </div>
      ))}
    </div>
  </section>
)

export default AboutGallery
