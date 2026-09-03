import Link from 'next/link'
import Blip from '@/components/atoms/Blip'
import Button from '@/components/atoms/Button'
import IconButtonLink from '@/components/atoms/IconButtonLink'
import GithubIcon from '@/components/atoms/GithubIcon'
import LinkedinIcon from '@/components/atoms/LinkedinIcon'
import MailIcon from '@/components/atoms/MailIcon'
import PageHeading from '@/components/organisms/PageHeading'
import { SITE_AUTHOR, AVAILABILITY } from '@/lib/site'

const HeroIntro = () => (
  <div>
    {AVAILABILITY.open && (
      <div className="inline-flex items-center gap-2.5 font-[family-name:var(--font-mono)] text-[12px] tracking-[0.04em] text-[var(--text-dim)] py-1.5 px-3 border border-[var(--border)] rounded-full bg-[var(--surface)] mb-7 whitespace-nowrap">
        <Blip />
        <span>AVAILABLE · {AVAILABILITY.label}</span>
      </div>
    )}
    <PageHeading
      leadingDollar
      title={
        <>
          hi, I&apos;m <span className="text-[var(--accent)]">Nahyan</span>
        </>
      }
      middle="Software Engineer & AI Engineer | Bangalore · Building at the edge of product and AI"
      description={
        <>
          I design and build{' '}
          <em className="text-[var(--accent)] not-italic">
            production-ready web applications end-to-end
          </em>
          , from pixel-perfect frontends to robust backends and everything in between. I care about{' '}
          <em className="text-[var(--accent)] not-italic">clean code</em>, great UX, and shipping
          things that actually work. This site is the latest thing I&apos;ve built — take a look
          around.
        </>
      }
    />
    <div className="flex flex-wrap gap-3 items-center">
      <Button as={Link} href="#contact" variant="primary">
        get in touch
      </Button>
      <Button as={Link} href="#projects">
        ls projects/
      </Button>
      <div className="ml-auto flex gap-2">
        <IconButtonLink href={SITE_AUTHOR.github} icon={<GithubIcon />} label="GitHub" external />
        <IconButtonLink
          href={SITE_AUTHOR.linkedin}
          icon={<LinkedinIcon />}
          label="LinkedIn"
          external
        />
        <IconButtonLink href={`mailto:${SITE_AUTHOR.email}`} icon={<MailIcon />} label="Email" />
      </div>
    </div>
  </div>
)

export default HeroIntro
