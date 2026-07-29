import { useEffect, useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'

const BG_IMAGE_1 =
  '/assets/images/lithos-base.webp'

const BG_IMAGE_2 =
  '/assets/images/lithos-reveal.webp'

const SPOTLIGHT_R = 260

type RevealLayerProps = {
  image: string
  cursorX: number
  cursorY: number
}

function RevealLayer({ image, cursorX, cursorY }: RevealLayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const revealRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const sizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    sizeCanvas()
    window.addEventListener('resize', sizeCanvas)

    return () => window.removeEventListener('resize', sizeCanvas)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const reveal = revealRef.current
    const context = canvas?.getContext('2d')

    if (!canvas || !reveal || !context) return

    context.clearRect(0, 0, canvas.width, canvas.height)

    const gradient = context.createRadialGradient(
      cursorX,
      cursorY,
      0,
      cursorX,
      cursorY,
      SPOTLIGHT_R,
    )

    gradient.addColorStop(0, 'rgba(255,255,255,1)')
    gradient.addColorStop(0.4, 'rgba(255,255,255,1)')
    gradient.addColorStop(0.6, 'rgba(255,255,255,0.75)')
    gradient.addColorStop(0.75, 'rgba(255,255,255,0.4)')
    gradient.addColorStop(0.88, 'rgba(255,255,255,0.12)')
    gradient.addColorStop(1, 'rgba(255,255,255,0)')

    context.beginPath()
    context.arc(cursorX, cursorY, SPOTLIGHT_R, 0, Math.PI * 2)
    context.fillStyle = gradient
    context.fill()

    const mask = `url("${canvas.toDataURL()}")`
    reveal.style.maskImage = mask
    reveal.style.webkitMaskImage = mask
  })

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none reveal-canvas"
        style={{ display: 'none' }}
        aria-hidden="true"
      />
      <div
        ref={revealRef}
        className="absolute inset-0 bg-center bg-cover bg-no-repeat z-30 pointer-events-none reveal-layer"
        style={{
          backgroundImage: `url("${image}")`,
          maskImage: 'linear-gradient(transparent, transparent)',
          WebkitMaskImage: 'linear-gradient(transparent, transparent)',
          maskSize: '100% 100%',
          WebkitMaskSize: '100% 100%',
        }}
        aria-hidden="true"
      />
    </>
  )
}

const navItems = ['Course', 'Field Guides', 'Geology', 'Plans', 'Live Tour']

function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    if (!isMenuOpen) return

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMenuOpen(false)
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [isMenuOpen])

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between p-4 sm:p-5 site-nav"
      aria-label="Main navigation"
    >
      <a className="brand" href="#top" aria-label="Lithos home">
        <svg
          className="brand-mark"
          viewBox="0 0 256 256"
          width="26"
          height="26"
          fill="#ffffff"
          aria-hidden="true"
        >
          <path d="M 256 256 L 128 256 L 0 128 L 128 128 Z M 256 128 L 128 128 L 0 0 L 128 0 Z" />
        </svg>
        <span className="brand-wordmark font-playfair">Lithos</span>
      </a>

      <div className="desktop-nav" aria-label="Site sections">
        {navItems.map((item, index) => (
          <button
            className={`nav-link px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              index === 0
                ? 'is-active text-white'
                : 'text-white/80 hover:bg-white/20 hover:text-white'
            }`}
            type="button"
            key={item}
            aria-current={index === 0 ? 'page' : undefined}
          >
            {item}
          </button>
        ))}
      </div>

      <button
        className="sign-up desktop-sign-up hidden md:block bg-white text-gray-900 text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-gray-100"
        type="button"
      >
        Sign Up
      </button>

      <button
        className="menu-toggle md:hidden"
        type="button"
        aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={isMenuOpen}
        aria-controls="mobile-navigation"
        onClick={() => setIsMenuOpen((open) => !open)}
      >
        {isMenuOpen ? (
          <X size={20} strokeWidth={1.8} aria-hidden="true" />
        ) : (
          <Menu size={20} strokeWidth={1.8} aria-hidden="true" />
        )}
      </button>

      <div
        id="mobile-navigation"
        className={`mobile-nav${isMenuOpen ? ' is-open' : ''}`}
        aria-hidden={!isMenuOpen}
      >
        {navItems.map((item, index) => (
          <button
            className={`mobile-nav-link${index === 0 ? ' is-active' : ''}`}
            type="button"
            key={item}
            tabIndex={isMenuOpen ? 0 : -1}
            onClick={() => setIsMenuOpen(false)}
          >
            {item}
          </button>
        ))}
        <button
          className="sign-up mobile-sign-up"
          type="button"
          tabIndex={isMenuOpen ? 0 : -1}
          onClick={() => setIsMenuOpen(false)}
        >
          Sign Up
        </button>
      </div>
    </nav>
  )
}

function App() {
  const mouse = useRef({ x: -999, y: -999 })
  const smooth = useRef({ x: -999, y: -999 })
  const rafRef = useRef<number | null>(null)
  const [cursorPos, setCursorPos] = useState({ x: -999, y: -999 })

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mouse.current.x = event.clientX
      mouse.current.y = event.clientY
    }

    const animate = () => {
      smooth.current.x += (mouse.current.x - smooth.current.x) * 0.1
      smooth.current.y += (mouse.current.y - smooth.current.y) * 0.1

      setCursorPos({
        x: smooth.current.x,
        y: smooth.current.y,
      })

      rafRef.current = window.requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    rafRef.current = window.requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      if (rafRef.current !== null) window.cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <div
      className="min-h-screen bg-white tracking-[-0.02em] app-shell"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <Navigation />

      <main>
        <section
          id="top"
          className="relative w-full overflow-hidden h-screen bg-black hero-section"
          style={{ height: '100dvh' }}
        >
          <div
            className="absolute inset-0 bg-center bg-cover bg-no-repeat z-10 base-image hero-zoom"
            style={{ backgroundImage: `url("${BG_IMAGE_1}")` }}
            aria-hidden="true"
          />

          <RevealLayer
            image={BG_IMAGE_2}
            cursorX={cursorPos.x}
            cursorY={cursorPos.y}
          />

          <div className="absolute top-[14%] left-0 right-0 flex flex-col items-center text-center px-5 pointer-events-none z-50 hero-heading">
            <h1 className="text-white leading-[0.95]">
              <span
                className="block font-playfair italic font-normal text-5xl sm:text-7xl md:text-8xl headline-line headline-accent hero-anim hero-reveal"
                style={{ letterSpacing: '-0.05em', animationDelay: '0.25s' }}
              >
                Layers hold
              </span>
              <span
                className="block font-normal text-5xl sm:text-7xl md:text-8xl -mt-1 headline-line headline-main hero-anim hero-reveal"
                style={{ letterSpacing: '-0.08em', animationDelay: '0.42s' }}
              >
                tales of time
              </span>
            </h1>
          </div>

          <div
            className="hidden sm:block absolute bottom-14 left-10 md:left-14 max-w-[260px] z-50 hero-note hero-anim hero-fade"
            style={{ animationDelay: '0.7s' }}
          >
            <p className="text-sm text-white/80 leading-relaxed">
              Every layer of sediment records a chapter of our planet, from
              ancient seabeds to drifting ash, layered across millions of years
              beneath us.
            </p>
          </div>

          <div
            className="absolute bottom-10 sm:bottom-24 left-5 right-5 sm:left-auto sm:right-10 md:right-14 max-w-full sm:max-w-[260px] flex flex-col items-start gap-4 sm:gap-5 z-50 hero-action hero-anim hero-fade"
            style={{ animationDelay: '0.85s' }}
          >
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
              Our interactive maps let you peel back the crust to trace how
              stones, fossils, and deep time combine to shape the ground beneath
              your feet.
            </p>
            <button
              className="bg-[#e8702a] hover:bg-[#d2611f] text-white text-sm font-medium px-7 py-3 rounded-full transition-all hover:scale-[1.03] active:scale-95 hover:shadow-lg hover:shadow-[#e8702a]/30 start-button"
              type="button"
            >
              Start Digging
            </button>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
