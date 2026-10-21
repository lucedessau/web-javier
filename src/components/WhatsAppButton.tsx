import { WhatsappLogo } from '@phosphor-icons/react'
import { site } from '../config/site'

type Props = {
  label?: string
  size?: 'sm' | 'lg'
  className?: string
}

const sizes = {
  sm: { link: 'gap-2.5 py-1 pl-4 pr-1 text-sm', icon: 'size-8', glyph: 18 },
  lg: { link: 'gap-3.5 py-1.5 pl-6 pr-1.5 text-[0.95rem]', icon: 'size-11', glyph: 22 },
}

export default function WhatsAppButton({ label = 'Hablemos por WhatsApp', size = 'lg', className = '' }: Props) {
  const s = sizes[size]
  return (
    <a
      href={site.whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`group inline-flex items-center rounded-full bg-accent-strong font-medium text-white transition-[transform,background-color] duration-200 ease-out-strong hover:bg-accent active:scale-[0.97] ${s.link} ${className}`}
    >
      <span>{label}</span>
      <span
        aria-hidden
        className={`grid place-items-center rounded-full bg-white/15 transition-transform duration-300 ease-out-strong group-hover:-translate-y-px group-hover:translate-x-0.5 group-hover:scale-105 ${s.icon}`}
      >
        <WhatsappLogo size={s.glyph} weight="light" />
      </span>
    </a>
  )
}
