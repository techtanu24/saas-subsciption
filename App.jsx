import React, { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import {
  Activity, ArrowDownRight, ArrowRight, ArrowUpRight, Bell, Bot, Check, ChevronDown,
  ChevronLeft, ChevronRight, CircleHelp, CreditCard, Download, Ellipsis, FileText,
  Gauge, Headphones, Home, Info, LayoutDashboard, LogIn, LogOut, Mail, Menu, MessageCircle, Plus,
  Eye, EyeOff, KeyRound, Search, Settings, ShieldCheck, Sparkles, UserPlus, UserRound, Users,
  Send, Workflow, X, Zap,
} from 'lucide-react'

async function apiRequest(url, options) {
  let response
  try {
    response = await fetch(url, options)
  } catch {
    throw new Error('Unable to reach the authentication service. Make sure the backend is running and try again.')
  }

  const body = await response.text()
  let result = null
  if (body.trim()) {
    try {
      result = JSON.parse(body)
    } catch {
      if (response.status >= 500) {
        throw new Error('The authentication service is unavailable. Restart the app with npm run dev and try again.')
      }
      throw new Error('The authentication service returned an unexpected response. Please try again.')
    }
  }
  return { response, result }
}

const cyan = '#41e6ff'
const pageTransition = {
  initial: { opacity: 0, y: 12, scale: .99 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: .42, ease: [0.2, 0.65, 0.3, 0.9] } },
  exit: { opacity: 0, y: -8, scale: .995, transition: { duration: .22, ease: 'easeIn' } },
}
const heroCopyVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: .12, delayChildren: .18 } },
}
const heroItemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: .62, ease: [0.2, 0.65, 0.3, 0.9] } },
}
const heroTitleVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: .1, delayChildren: .08 } },
}
const heroTitleLineVariants = {
  hidden: { opacity: 0, y: 28, filter: 'blur(7px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: .78, ease: [0.2, 0.65, 0.3, 0.9] } },
}
const adminSections = [
  { title: 'Dashboard', icon: LayoutDashboard },
  { title: 'Subscription Plans', icon: CreditCard, children: ['Create Plan', 'Manage Plans'] },
  { title: 'Customers', icon: Users, children: ['All Customers', 'Customer Details'] },
  { title: 'Subscriptions', icon: Zap, children: ['Active Subscriptions', 'Trial Subscriptions', 'Past Due', 'Cancelled'] },
  { title: 'Billing & Payments', icon: CreditCard, children: ['Payment Transactions', 'Failed Payments', 'Payment History'] },
  { title: 'Invoices', icon: FileText, children: ['All Invoices', 'Generate Invoice', 'Download PDF'] },
  { title: 'Analytics', icon: Activity, children: ['Revenue Analytics', 'MRR & ARR', 'Churn Analysis', 'Plan Performance'] },
  { title: 'Notifications', icon: Bell },
  { title: 'Settings', icon: Settings, children: ['Profile Settings', 'Security', 'Billing Settings'] },
]
const customerSections = [
  { title: 'Overview', icon: LayoutDashboard },
  { title: 'Browse Plans', icon: Sparkles },
  { title: 'My Subscription', icon: Zap },
  { title: 'Billing & Payments', icon: CreditCard },
  { title: 'My Invoices', icon: FileText },
  { title: 'Payment History', icon: Activity },
  { title: 'Notifications', icon: Bell },
  { title: 'Account Settings', icon: Settings },
  { title: 'Help & Support', icon: CircleHelp },
]
const initialCustomers = [
  { name: 'Olivia Rhye', email: 'olivia@catalog.co', plan: 'Enterprise', amount: '$249.00', status: 'Active', initials: 'OR', paymentMethod: 'Card ending in 4242' },
  { name: 'Phoenix Baker', email: 'phoenix@lattice.io', plan: 'Growth', amount: '$89.00', status: 'Active', initials: 'PB', paymentMethod: 'UPI' },
  { name: 'Lana Steiner', email: 'lana@layers.app', plan: 'Starter', amount: '$29.00', status: 'Trial', initials: 'LS', paymentMethod: 'Wallet' },
  { name: 'Demi Wilkinson', email: 'demi@quotient.co', plan: 'Growth', amount: '$89.00', status: 'Past due', initials: 'DW', paymentMethod: 'Net banking' },
  { name: 'Candice Wu', email: 'candice@circooles.com', plan: 'Enterprise', amount: '$249.00', status: 'Active', initials: 'CW', paymentMethod: 'Card ending in 4242' },
]
const initialPlans = [
  { name: 'Starter', description: 'For small teams getting started', price: 29, cycle: 'month', users: 'Up to 5 seats', features: ['Core analytics', 'Email support', '5 projects'], popular: false },
  { name: 'Growth', description: 'For teams ready to scale', price: 89, cycle: 'month', users: 'Up to 20 seats', features: ['Advanced analytics', 'Priority support', 'Unlimited projects'], popular: true },
  { name: 'Enterprise', description: 'For ambitious businesses', price: 249, cycle: 'month', users: 'Unlimited seats', features: ['Custom reporting', 'Dedicated success', 'Advanced security'], popular: false },
]
const phoneCountries = [
  { country: 'United States', code: '+1' },
  { country: 'Canada', code: '+1' },
  { country: 'United Kingdom', code: '+44' },
  { country: 'India', code: '+91' },
  { country: 'Australia', code: '+61' },
  { country: 'New Zealand', code: '+64' },
  { country: 'Germany', code: '+49' },
  { country: 'France', code: '+33' },
  { country: 'Spain', code: '+34' },
  { country: 'Italy', code: '+39' },
  { country: 'Netherlands', code: '+31' },
  { country: 'Ireland', code: '+353' },
  { country: 'Singapore', code: '+65' },
  { country: 'Japan', code: '+81' },
  { country: 'United Arab Emirates', code: '+971' },
  { country: 'Saudi Arabia', code: '+966' },
  { country: 'South Africa', code: '+27' },
  { country: 'Brazil', code: '+55' },
  { country: 'Mexico', code: '+52' },
]
const quickActions = ['Create Subscription Plan', 'Add Customer', 'Generate Invoice', 'Record Payment']

const readStored = (key, fallback) => {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

const writeStored = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Keep the dashboard usable when browser storage is unavailable.
  }
}

const formatFullDate = (date = new Date()) => new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  year: 'numeric',
}).format(date).toUpperCase()

const formatTableDate = (date = new Date()) => new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
}).format(date)

const formatRelativeTime = (timestamp) => {
  const elapsed = Math.max(0, Date.now() - new Date(timestamp).getTime())
  const minutes = Math.floor(elapsed / 60000)
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hr ago`
  const days = Math.floor(hours / 24)
  return `${days} day${days === 1 ? '' : 's'} ago`
}

function Logo({ small = false }) {
  return <div className={`brand ${small ? 'brand-small' : ''}`}><span className="brand-mark"><span /></span><span>Nexora</span></div>
}

function Reveal({ children, delay = 0, className = '' }) {
  return <motion.div className={className} initial={{ opacity: 0, y: 28, filter: 'blur(5px)' }} whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }} viewport={{ once: true, amount: 0.16, margin: '0px 0px -36px 0px' }} transition={{ duration: 0.72, delay, ease: [0.2, 0.65, 0.3, 0.9] }}>{children}</motion.div>
}

function InteractiveFeatureCard({ Icon, title, copy }) {
  const prefersReducedMotion = useReducedMotion()
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const smoothRotateX = useSpring(rotateX, { stiffness: 190, damping: 22, mass: .45 })
  const smoothRotateY = useSpring(rotateY, { stiffness: 190, damping: 22, mass: .45 })
  const handlePointerMove = event => {
    if (prefersReducedMotion || event.pointerType === 'touch') return
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - bounds.left) / bounds.width
    const y = (event.clientY - bounds.top) / bounds.height
    rotateX.set((.5 - y) * 6)
    rotateY.set((x - .5) * 8)
  }
  const resetTilt = () => {
    rotateX.set(0)
    rotateY.set(0)
  }

  return <motion.article
    className="feature-card"
    style={{ rotateX: smoothRotateX, rotateY: smoothRotateY, transformPerspective: 900 }}
    onPointerMove={handlePointerMove}
    onPointerLeave={resetTilt}
    whileHover={prefersReducedMotion ? undefined : { y: -5, borderColor: 'rgba(65,230,255,.35)' }}
    whileTap={prefersReducedMotion ? undefined : { scale: .99 }}
    transition={{ type: 'spring', stiffness: 230, damping: 24 }}
  >
    <div className="feature-icon"><Icon size={20} /></div>
    <h3>{title}</h3>
    <p>{copy}</p>
    <a href="#pricing">Explore feature <ArrowRight size={14} /></a>
  </motion.article>
}

function Landing({ onAuth, onStart }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const [authMode, setAuthMode] = useState('login')
  const heroRef = useRef(null)
  const prefersReducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const orbY = useTransform(scrollYProgress, [0, 1], [0, prefersReducedMotion ? 0 : 72])
  const artY = useTransform(scrollYProgress, [0, 1], [0, prefersReducedMotion ? 0 : -34])
  const smoothOrbY = useSpring(orbY, { stiffness: 80, damping: 22, mass: .55 })
  const smoothArtY = useSpring(artY, { stiffness: 80, damping: 22, mass: .55 })
  const secondaryOrbY = useTransform(smoothOrbY, value => value * -.55)
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  const openLogin = () => { setMenuOpen(false); setAuthMode('login'); setLoginOpen(true) }
  const openSignup = () => { setMenuOpen(false); setAuthMode('signup'); setLoginOpen(true) }
  const links = [[Home, 'Home', '#home'], [Sparkles, 'Features', '#features'], [Workflow, 'How it works', '#how-it-works'], [CreditCard, 'Pricing', '#pricing'], [Info, 'About', '#about'], [Mail, 'Contact', '#contact']]
  return (
    <>
    <div className="landing" id="home">
      <header className={`site-nav ${scrolled ? 'scrolled' : ''}`}>
        <a href="#home" className="logo-link"><Logo /></a>
        <nav className={`nav-links ${menuOpen ? 'nav-open' : ''}`}>
          {links.map(([Icon, label, href]) => <a key={label} href={href} onClick={() => setMenuOpen(false)}><Icon size={13} aria-hidden="true" /><span>{label}</span></a>)}
          <button className="mobile-login" onClick={openLogin}><LogIn size={15} /> Log in</button>
          <button className="mobile-start" onClick={openSignup}><UserPlus size={15} /> Sign up</button>
        </nav>
        <div className="nav-actions"><button className="nav-login" onClick={openLogin}><LogIn size={14} /> Log in</button><button className="button button-primary nav-cta" onClick={openSignup}><UserPlus size={15} /> Sign up</button></div>
        <button className="hamburger" aria-label="Toggle menu" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
      </header>
      <main>
        <section className="hero" ref={heroRef}>
          <motion.div className="hero-orb orb-one" style={{ y: smoothOrbY }} /><motion.div className="hero-orb orb-two" style={{ y: secondaryOrbY }} />
          <motion.div className="hero-art" aria-hidden="true" style={{ y: smoothArtY }}>
            <div className="hero-contour" />
            <div className="falling-cubes">
              {[0, 1, 2, 3, 4].map(cube => (
                <span className={`falling-cube cube-${cube + 1}`} key={cube}>
                  <span className="cube-shape">
                    {[0, 1, 2, 3, 4, 5].map(face => <i key={face} />)}
                  </span>
                </span>
              ))}
            </div>
            <img className="hero-art-orbit" src="/images/payment-orbit.svg" alt="" />
            <img className="hero-art-network" src="/images/transaction-network.svg" alt="" />
          </motion.div>
          <motion.div className="hero-copy" variants={heroCopyVariants} initial="hidden" animate="visible">
            <motion.div className="eyebrow" variants={heroItemVariants}><span className="live-dot" /> THE BILLING PLATFORM BUILT FOR WHAT'S NEXT</motion.div>
            <motion.h1 className="hero-headline" variants={heroTitleVariants}>
              <motion.span className="hero-title-line" variants={heroTitleLineVariants}>Subscriptions,</motion.span>
              <motion.span className="hero-title-line" variants={heroTitleLineVariants}>without the <span className="text-gradient">friction.</span></motion.span>
            </motion.h1>
            <motion.p className="hero-description" variants={heroItemVariants}>One beautiful platform to manage recurring revenue, delight customers, and grow your business — on autopilot.</motion.p>
            <motion.div className="hero-buttons" variants={heroItemVariants}><motion.button className="button button-primary" onClick={openSignup} whileHover={{ scale: 1.035, y: -2 }} whileTap={{ scale: .98 }}>Start for free <ArrowRight size={16} /></motion.button><a className="text-button" href="#how-it-works"><span className="play-icon">▶</span> See how it works</a></motion.div>
            <motion.div className="hero-proof" variants={heroItemVariants}><div className="avatar-stack"><span>J</span><span>M</span><span>A</span><span>K</span></div><div><div className="stars">★★★★★</div><small>Trusted by 2,400+ teams</small></div><div className="proof-divider" /><div><strong>99.98%</strong><small>platform uptime</small></div></motion.div>
          </motion.div>
          <motion.div className="hero-visual" initial={{ opacity: 0, y: 36, rotate: 1, scale: .975 }} animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 62, damping: 18, delay: .28 }}>
            <DashboardPreview />
            <motion.div className="hero-insight-card insight-revenue" initial={{ opacity: 0, x: 18, y: 8 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ delay: .9, duration: .55 }}>
              <span className="insight-icon"><Activity size={15} /></span><span><small>MONTHLY REVENUE</small><strong>$48,294 <i>+12.8%</i></strong></span>
            </motion.div>
            <motion.div className="hero-insight-card insight-payment" initial={{ opacity: 0, x: -14, y: 8 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ delay: 1.15, duration: .55 }}>
              <span className="insight-icon"><Check size={15} /></span><span><small>PAYMENT SECURED</small><strong>All systems go</strong></span>
            </motion.div>
          </motion.div>
          <div className="hero-bottom-fade" />
        </section>
        <section className="trusted"><p>POWERING THE NEXT GENERATION OF SAAS</p><div className="trusted-logos"><span>◈ Layers</span><span>◉ Catalog</span><span>✳ Circooles</span><span>◌ Quotient</span><span>⌘ Sisyphus</span></div></section>
        <section className="section features-section" id="features">
          <Reveal><div className="section-heading"><span className="section-kicker">EVERYTHING IN ONE PLACE</span><h2>Revenue operations,<br /><span className="text-gradient">beautifully connected.</span></h2><p>Less time wrestling with billing. More time building something remarkable.</p></div></Reveal>
          <div className="feature-grid">{[
            [Zap, 'Flexible subscriptions', 'Launch any pricing model, from usage-based to annual plans, without writing a line of billing logic.'],
            [Users, 'Customers feel at home', 'Give every customer a polished portal to manage their plan, payment details, and invoices.'],
            [Activity, 'Know your numbers', 'Real-time MRR, churn, and revenue insights put your next best decision right in front of you.'],
            [ShieldCheck, 'Payments you can trust', 'Enterprise-grade security and smart retries protect every transaction and your peace of mind.'],
          ].map(([Icon, title, copy], i) => <Reveal key={title} delay={i * .07}><InteractiveFeatureCard Icon={Icon} title={title} copy={copy} /></Reveal>)}</div>
        </section>
        <section className="workflow-section" id="how-it-works"><Reveal><div className="workflow-inner"><div><span className="section-kicker">UP AND RUNNING IN MINUTES</span><h2>From first plan<br />to <span className="text-gradient">first payment.</span></h2><p className="section-copy">A simpler way to launch and scale recurring revenue. No complicated setup. No billing headaches.</p><div className="steps">{[['01', 'Set up your plans', 'Build the pricing your customers actually want.'], ['02', 'Bring your customers', 'Migrate or invite your people with a few clicks.'], ['03', 'Grow on autopilot', 'Nexora handles the billing. You focus on the big picture.']].map(([n, title, text]) => <div className="step" key={n}><span>{n}</span><div><strong>{title}</strong><p>{text}</p></div></div>)}</div></div><div className="workflow-card"><div className="workflow-card-glow" /><div className="workflow-top"><span>PAYMENT RECEIVED</span><span className="workflow-check"><Check size={14} /></span></div><strong className="workflow-amount">+$249.00</strong><span className="workflow-client">Olivia Rhye · Enterprise plan</span><div className="workflow-line"><span /><span /><span /><span /><span /><span /><span /></div><div className="workflow-footer"><span>Monthly recurring revenue</span><strong>$48,294 <small>+12.8%</small></strong></div><div className="floating-note"><span className="note-icon"><Zap size={15} /></span><div><strong>Smart retry recovered</strong><small>$89 payment · just now</small></div><Check size={15} className="note-check" /></div></div></div></Reveal></section>
        <section className="section pricing-section" id="pricing"><Reveal><div className="section-heading"><span className="section-kicker">SIMPLE, PREDICTABLE PRICING</span><h2>Room to grow.<br /><span className="text-gradient">No surprises.</span></h2><p>Start free. Upgrade when you're ready. Every plan comes with the essentials.</p></div></Reveal><div className="pricing-grid">{initialPlans.map((plan, i) => <Reveal key={plan.name} delay={i * .08}><PricingCard plan={plan} onChoose={() => onStart('customer', plan)} /></Reveal>)}</div><p className="pricing-footnote">All plans include secure payments, a customer portal, and friendly human support.</p></section>
        <section className="about-section" id="about"><Reveal><div className="about-card"><div><span className="section-kicker">BUILT FOR THE LONG GAME</span><h2>Good businesses<br />deserve <span className="text-gradient">great billing.</span></h2><p>We believe the best tools make the complex feel effortless. Nexora gives ambitious teams the clarity and confidence to build lasting customer relationships.</p><a href="#contact" className="text-button">Meet your growth partner <ArrowRight size={16} /></a></div><div className="about-stat"><span className="stat-ring"><span>↗</span></span><strong>2.4k<span>+</span></strong><small>teams growing with Nexora</small><div className="about-bars"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div></div></div></Reveal></section>
        <section className="contact-section" id="contact"><Reveal><div className="contact-card"><div><span className="section-kicker">LET'S BUILD SOMETHING</span><h2>Your next chapter<br />starts <span className="text-gradient">right here.</span></h2><p>Join thousands of teams making subscription billing the easiest part of their business.</p></div><div className="contact-action"><button className="button button-primary" onClick={openSignup}><UserPlus size={15} /> Sign up free</button><span>No credit card required · Cancel anytime</span></div></div></Reveal></section>
      </main>
      <footer className="site-footer"><Logo small /><span>© {new Date().getFullYear()} Nexora, Inc.</span><div><a href="#features">Features</a><a href="#pricing">Pricing</a><a href="#contact">Contact</a><button onClick={openLogin}>Log in</button></div></footer>
    </div>
    <AnimatePresence>{loginOpen && <LoginDialog mode={authMode} onModeChange={setAuthMode} onClose={() => setLoginOpen(false)} onSubmit={onAuth} />}</AnimatePresence>
    </>
  )
}

function LoginDialog({ mode, onModeChange, onClose, onSubmit }) {
  const isSignup = mode === 'signup'
  const [authError, setAuthError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const changeMode = nextMode => { setAuthError(''); setShowPassword(false); onModeChange(nextMode) }
  const submitForm = async event => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    setSubmitting(true)
    setAuthError('')
    try {
      await onSubmit({
        mode,
        name: String(formData.get('name') || ''),
        email: String(formData.get('email') || ''),
        password: String(formData.get('password') || ''),
      })
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Unable to authenticate. Please try again.')
      setSubmitting(false)
    }
  }
  return (
    <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={event => { if (event.target === event.currentTarget) onClose() }}>
      <motion.div className="modal-card" role="dialog" aria-modal="true" aria-labelledby="login-dialog-title" initial={{ opacity: 0, y: 16, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: .98 }} transition={{ duration: .2 }}>
        <div className="modal-heading">
          <div>
            <span className="section-kicker">{isSignup ? 'YOUR NEXT CHAPTER' : 'WELCOME BACK'}</span>
            <h2 id="login-dialog-title">{isSignup ? 'Create your account' : 'Customer log in'}</h2>
            <p>{isSignup ? 'Join Nexora to manage your subscriptions.' : 'Enter your account details to continue.'}</p>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Close dialog"><X size={18} /></button>
        </div>
        <div className="auth-tabs" role="tablist" aria-label="Account access">
          <button type="button" role="tab" aria-selected={!isSignup} className={!isSignup ? 'auth-tab-active' : ''} onClick={() => changeMode('login')}><LogIn size={14} /> Log in</button>
          <button type="button" role="tab" aria-selected={isSignup} className={isSignup ? 'auth-tab-active' : ''} onClick={() => changeMode('signup')}><UserPlus size={14} /> Sign up</button>
        </div>
        <form className="modal-form" onSubmit={submitForm}>
          {isSignup && <label className="auth-field"><span><UserRound size={14} /> Full name</span><input name="name" type="text" placeholder="Your name" autoComplete="name" required maxLength={100} /></label>}
          <label className="auth-field"><span><Mail size={14} /> Email address</span><input name="email" type="email" placeholder="you@example.com" autoComplete="email" required /></label>
          <label className="auth-field"><span><KeyRound size={14} /> Password</span><div className="password-input-wrap"><input name="password" type={showPassword ? 'text' : 'password'} placeholder={isSignup ? 'Create a password' : 'Enter your password'} autoComplete={isSignup ? 'new-password' : 'current-password'} minLength={isSignup ? 8 : undefined} maxLength={128} required /><button type="button" className="password-toggle" onClick={() => setShowPassword(value => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'} aria-pressed={showPassword}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></label>
          {authError && <p className="auth-error" role="alert">{authError}</p>}
          <div className="modal-buttons">
            <button type="button" className="button button-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="button button-primary" disabled={submitting}>{submitting ? 'Please wait…' : isSignup ? 'Create account' : 'Log in'} <ArrowRight size={15} /></button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

function DashboardPreview() {
  return <div className="preview-shell"><div className="preview-window"><div className="preview-topbar"><div className="mini-brand"><span className="brand-mark"><span /></span><b>nexora</b></div><div className="preview-controls"><span /><span /><span /></div></div><div className="preview-content"><div className="preview-greeting"><div><small>{formatFullDate(new Date())}</small><strong>Good morning, Alex <span>✦</span></strong></div><span className="preview-avatar">A</span></div><div className="preview-stats">{[['Monthly recurring revenue', '$48,294', '+12.8%'], ['Active subscriptions', '1,284', '+8.2%'], ['Avg. revenue per user', '$37.61', '+3.4%']].map(([label, val, change]) => <div key={label}><small>{label}</small><strong>{val}</strong><span>↗ {change}</span></div>)}</div><div className="preview-chart"><div className="chart-heading"><div><small>REVENUE OVERVIEW</small><strong>$48,294.00 <span>↑ 12.8%</span></strong></div><span className="chart-filter">Last 30 days⌄</span></div><div className="chart-graph"><div className="chart-grid"><i /><i /><i /><i /></div><svg viewBox="0 0 540 125" preserveAspectRatio="none"><defs><linearGradient id="area" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor={cyan} stopOpacity=".22" /><stop offset="100%" stopColor={cyan} stopOpacity="0" /></linearGradient></defs><path d="M0 105 C30 92 43 94 68 87 S105 98 131 75 S173 78 196 65 S228 75 250 57 S291 70 318 46 S354 62 378 41 S410 48 431 28 S462 39 482 22 S514 34 540 9 V125 H0 Z" fill="url(#area)" /><path d="M0 105 C30 92 43 94 68 87 S105 98 131 75 S173 78 196 65 S228 75 250 57 S291 70 318 46 S354 62 378 41 S410 48 431 28 S462 39 482 22 S514 34 540 9" fill="none" stroke={cyan} strokeWidth="2.4" /></svg></div><div className="chart-labels"><span>Sep 22</span><span>Sep 29</span><span>Oct 06</span><span>Oct 13</span><span>Oct 20</span></div></div><div className="preview-lower"><span>Recent activity</span><div><i className="activity-avatar">OR</i><span>Olivia Rhye upgraded to Enterprise</span><small>2 min ago</small><b>+$249</b></div><div><i className="activity-avatar second">PB</i><span>Phoenix Baker's payment succeeded</span><small>18 min ago</small><b>+$89</b></div></div></div></div><motion.div className="preview-badge" animate={{ y: [0, -7, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}><span className="badge-check"><Check size={14} /></span><div><strong>Payment received</strong><small>Just now · $249.00</small></div></motion.div></div>
}

function PricingCard({ plan, onChoose }) {
  const prefersReducedMotion = useReducedMotion()
  return <motion.article className={`price-card ${plan.popular ? 'popular' : ''} ${plan.highlighted ? 'search-result-highlight' : ''}`} whileHover={prefersReducedMotion ? undefined : { y: -6, scale: 1.015 }} whileTap={prefersReducedMotion ? undefined : { scale: .99 }} transition={{ type: 'spring', stiffness: 240, damping: 24 }}>{plan.popular && <div className="popular-label"><Sparkles size={12} /> MOST POPULAR</div>}<div className="price-plan-icon"><Zap size={17} /></div><h3>{plan.name}</h3><p>{plan.description}</p><div className="price"><strong>${plan.price}</strong><span> / month</span></div><small className="price-users">{plan.users}</small><button className={`button ${plan.popular ? 'button-primary' : 'button-outline'}`} onClick={onChoose}>Choose {plan.name} <ArrowRight size={15} /></button><div className="plan-divider" /><ul>{plan.features.map(feature => <li key={feature}><Check size={14} />{feature}</li>)}</ul></motion.article>
}

function Dashboard({ role, user, onLogout, initialCheckout }) {
  const [active, setActive] = useState(role === 'admin' ? 'Dashboard' : 'Overview')
  const [expanded, setExpanded] = useState('Dashboard')
  const [collapsed, setCollapsed] = useState(false)
  const [mobileSidebar, setMobileSidebar] = useState(false)
  const [quickOpen, setQuickOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchIndex, setSearchIndex] = useState(0)
  const [highlightedPlan, setHighlightedPlan] = useState('')
  const [range, setRange] = useState('Last 30 days')
  const [rangeOpen, setRangeOpen] = useState(false)
  const [modal, setModal] = useState(initialCheckout ? 'Confirm subscription' : '')
  const [checkoutPlan, setCheckoutPlan] = useState(initialCheckout)
  const [customers, setCustomers] = useState(() => readStored('nexora_customers', initialCustomers))
  const [plans, setPlans] = useState(() => readStored('nexora_plans', initialPlans))
  const [updates, setUpdates] = useState(() => readStored('nexora_updates', []))
  const [invoices, setInvoices] = useState(() => readStored('nexora_invoices', []))
  const [payments, setPayments] = useState(() => readStored('nexora_payments', []))
  const [profile, setProfile] = useState(() => readStored('nexora_profile', null))
  const [toast, setToast] = useState('')
  const [now, setNow] = useState(() => new Date())
  const searchInputRef = useRef(null)
  const searchTriggerRef = useRef(null)
  const returningSearchFocusRef = useRef(false)
  const menu = role === 'admin' ? adminSections : customerSections
  const isAdmin = role === 'admin'
  const displayName = profile?.name || user?.name || (isAdmin ? 'Jordan Davis' : 'Customer')
  const displayEmail = profile?.email || user?.email || (isAdmin ? 'jordan@nexora.io' : '')
  const displayInitials = displayName.split(/\s+/).filter(Boolean).map(part => part[0]).slice(0, 2).join('').toUpperCase()
  const filteredCustomers = useMemo(() => customers.filter(c => `${c.name} ${c.email} ${c.plan} ${c.status} ${c.paymentMethod || ''}`.toLowerCase().includes(search.toLowerCase())), [customers, search])
  const plansDestination = isAdmin ? 'Manage Plans' : 'Browse Plans'
  const subscriptionsDestination = isAdmin ? 'Active Subscriptions' : 'My Subscription'
  const searchItems = [
    { title: isAdmin ? 'Subscription plans' : 'Browse available plans', description: 'Compare pricing and plan features', destination: plansDestination, keywords: 'plan plans pricing available browse subscription subscriptions', icon: CreditCard },
    { title: isAdmin ? 'Active subscriptions' : 'My subscription', description: 'View current subscriptions and billing status', destination: subscriptionsDestination, keywords: 'subscription subscriptions active current', icon: Zap },
    ...plans.map(plan => ({ title: plan.name, description: `$${plan.price}/${plan.cycle || 'month'} · Subscription plan`, destination: plansDestination, keywords: `${plan.description} plan subscription`, icon: Sparkles, planName: plan.name })),
    ...(isAdmin ? customers.map(customer => ({ title: customer.name, description: `${customer.plan} plan · ${customer.email}`, destination: 'All Customers', keywords: `${customer.email} ${customer.plan} customer`, icon: Users })) : []),
  ]
  const normalizedSearch = search.trim().toLowerCase()
  const searchTerms = normalizedSearch.split(/\s+/).filter(Boolean)
  const visibleSearchItems = searchItems.filter(item => {
    const searchableText = `${item.title} ${item.description} ${item.keywords}`.toLowerCase()
    return searchTerms.every(term => searchableText.includes(term))
  }).slice(0, 8)
  const openAction = (action) => { setQuickOpen(false); setModal(action) }
  const closeSearch = () => {
    setSearchOpen(false)
    returningSearchFocusRef.current = true
    window.requestAnimationFrame(() => {
      searchTriggerRef.current?.focus()
      window.setTimeout(() => { returningSearchFocusRef.current = false }, 0)
    })
  }
  const chooseSearchItem = (item) => {
    setActive(item.destination)
    setMobileSidebar(false)
    setHighlightedPlan(item.planName || '')
    if (item.destination === 'Manage Plans') setExpanded('Subscription Plans')
    if (item.destination === 'All Customers') setSearch(item.title)
    else setSearch('')
    setSearchOpen(false)
  }
  useEffect(() => {
    if (searchOpen) {
      setSearchIndex(0)
      window.requestAnimationFrame(() => searchInputRef.current?.focus())
      document.body.style.overflow = 'hidden'
      return () => { document.body.style.overflow = '' }
    }
  }, [searchOpen])
  useEffect(() => {
    const handleGlobalKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setSearchOpen(true)
      } else if (event.key === 'Escape') {
        closeSearch()
        setRangeOpen(false)
      }
    }
    window.addEventListener('keydown', handleGlobalKeyDown)
    return () => window.removeEventListener('keydown', handleGlobalKeyDown)
  }, [])
  useEffect(() => {
    if (highlightedPlan && ['Manage Plans', 'Subscription Plans', 'Create Plan', 'Browse Plans'].includes(active)) {
      window.requestAnimationFrame(() => document.querySelector('.search-result-highlight')?.scrollIntoView({ behavior: 'smooth', block: 'center' }))
    }
  }, [active, highlightedPlan])
  useEffect(() => {
    writeStored('nexora_customers', customers)
  }, [customers])
  useEffect(() => {
    writeStored('nexora_plans', plans)
  }, [plans])
  useEffect(() => {
    writeStored('nexora_updates', updates)
  }, [updates])
  useEffect(() => {
    writeStored('nexora_invoices', invoices)
  }, [invoices])
  useEffect(() => {
    writeStored('nexora_payments', payments)
  }, [payments])
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60000)
    return () => window.clearInterval(timer)
  }, [])
  useEffect(() => {
    const refreshProfile = () => setProfile(readStored('nexora_profile', null))
    window.addEventListener('nexora-profile-updated', refreshProfile)
    return () => window.removeEventListener('nexora-profile-updated', refreshProfile)
  }, [])
  const notify = (text) => {
    setToast(text)
    setUpdates(previous => [{ id: `${Date.now()}`, text, timestamp: new Date().toISOString() }, ...previous].slice(0, 20))
    window.setTimeout(() => setToast(''), 2600)
  }
  const handleLogout = async () => {
    try {
      await onLogout()
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Unable to log out. Please try again.')
    }
  }
  const selectMenu = (title, hasChildren) => {
    if (hasChildren) {
      setExpanded(expanded === title ? '' : title)
      const defaults = {
        'Subscription Plans': 'Manage Plans',
        Customers: 'All Customers',
        Subscriptions: 'Active Subscriptions',
        'Billing & Payments': 'Payment Transactions',
        Invoices: 'All Invoices',
        Analytics: 'Revenue Analytics',
        Settings: 'Profile Settings',
      }
      setActive(defaults[title] || title)
    }
    else { setActive(title); setMobileSidebar(false) }
  }
  const saveForm = (event) => {
    event.preventDefault()
    const data = Object.fromEntries(new FormData(event.currentTarget).entries())
    if (modal === 'Create Subscription Plan') {
      if (!data.name || !data.price) return
      setPlans(previous => [...previous, { name: data.name, description: data.description || 'A flexible plan for your customers', price: Number(data.price), cycle: data.cycle === 'Yearly' ? 'year' : 'month', users: 'Flexible seats', features: ['Secure checkout', 'Customer portal', 'Email support'], updatedAt: new Date().toISOString() }])
    } else if (modal === 'Add Customer') {
      if (!data.name || !data.email) return
      const country = phoneCountries.find(item => item.country === data.country)
      setCustomers(previous => [{ name: data.name, email: data.email, country: data.country, phone: `${country?.code || ''} ${data.phone}`, plan: data.plan || 'Starter', amount: data.plan === 'Enterprise' ? '$249.00' : data.plan === 'Growth' ? '$89.00' : '$29.00', status: 'Active', initials: data.name.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase(), paymentMethod: data.paymentMethod || 'Card ending in 4242', updatedAt: new Date().toISOString() }, ...previous])
    } else if (modal === 'Generate Invoice') {
      if (!data.amount) return
      const selectedName = String(data.customer || '').split(' · ')[0]
      setInvoices(previous => [[`INV-${new Date().getFullYear()}-${1049 + previous.length}`, selectedName, formatTableDate(new Date()), `$${Number(data.amount).toFixed(2)}`, 'Pending'], ...previous])
    } else if (modal === 'Record Payment') {
      if (!data.amount) return
      setPayments(previous => [[`PMT-${8043 + previous.length}`, data.customer || 'Customer', formatTableDate(new Date()), `$${Number(data.amount).toFixed(2)}`, 'Succeeded', data.paymentMethod || 'Card ending in 4242'], ...previous])
    }
    setModal('')
    notify(`${modal} saved successfully`)
  }
  return (
    <div className="dashboard-app">
      <AnimatePresence>{mobileSidebar && <motion.div className="mobile-scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileSidebar(false)} />}</AnimatePresence>
      <aside className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''} ${mobileSidebar ? 'sidebar-mobile-open' : ''}`}>
        <div className="sidebar-brand"><Logo small /><button className="collapse-button" onClick={() => setCollapsed(!collapsed)} aria-label="Collapse sidebar"><ChevronLeft size={17} /></button></div>
        <div className="workspace-switch"><span className="workspace-icon">N</span><span className="workspace-name"><strong>Northstar Studio</strong><small>{isAdmin ? 'Admin workspace' : 'Customer account'}</small></span><ChevronDown size={14} /></div>
        <div className="sidebar-label">{isAdmin ? 'WORKSPACE' : 'YOUR ACCOUNT'}</div>
        <nav className="side-nav">
          {menu.map(item => <div className="side-item-wrap" key={item.title}><button className={`side-item ${active === item.title ? 'side-item-active' : ''} ${expanded === item.title && item.children ? 'side-item-expanded' : ''}`} onClick={() => selectMenu(item.title, !!item.children)} title={collapsed ? item.title : undefined}><item.icon size={17} /><span>{item.title}</span>{item.children && !collapsed && <ChevronDown size={14} className="side-chevron" />}</button><AnimatePresence initial={false}>{item.children && expanded === item.title && !collapsed ? <motion.div key="submenu" className="side-submenu" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: .22, ease: 'easeOut' }}>{item.children.map(child => <button key={child} className={active === child ? 'submenu-active' : ''} onClick={() => { setActive(child); setMobileSidebar(false); if (child === 'Create Plan' || child === 'Generate Invoice') setModal(child === 'Create Plan' ? 'Create Subscription Plan' : child) }}>{child}</button>)}</motion.div> : null}</AnimatePresence></div>)}
        </nav>
        <button className="side-item logout-item" onClick={handleLogout} title={collapsed ? 'Logout' : undefined}><LogOut size={17} /><span>Log out</span></button>
        <div className="sidebar-profile"><div className="profile-avatar">{displayInitials}</div><div className="profile-info"><strong>{displayName}</strong><small>{displayEmail}</small></div><Ellipsis size={18} /></div>
      </aside>
      <div className="dashboard-main">
        <header className="dashboard-header"><button className="mobile-menu-button" onClick={() => setMobileSidebar(true)} aria-label="Open menu"><Menu size={20} /></button><button className="mobile-search-button" onClick={() => setSearchOpen(true)} aria-label="Search plans and subscriptions"><Search size={18} /></button><div className="breadcrumb"><span>{isAdmin ? 'Workspace' : 'Account'}</span><ChevronRight size={14} /><strong>{active}</strong></div><div className="header-controls"><label className="dash-search" onClick={() => setSearchOpen(true)}><Search size={16} /><input ref={searchTriggerRef} value={search} onFocus={() => { if (!returningSearchFocusRef.current) setSearchOpen(true) }} onChange={event => setSearch(event.target.value)} placeholder="Search anything..." aria-label="Search anything" /><kbd>⌘ K</kbd></label><div className="header-date"><button aria-haspopup="menu" aria-expanded={rangeOpen} onClick={() => setRangeOpen(!rangeOpen)}>{range}<ChevronDown size={14} /></button><AnimatePresence>{rangeOpen && <motion.div className="range-menu" role="menu" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}>{['Today', 'Last 7 days', 'Last 30 days', 'This year'].map(option => <button key={option} role="menuitemradio" aria-checked={range === option} className={range === option ? 'range-option-selected' : ''} onClick={() => { setRange(option); setRangeOpen(false) }}>{option}{range === option && <Check size={14} />}</button>)}</motion.div>}</AnimatePresence></div><div className="header-popover-wrap"><button className="icon-button notification-button" aria-label="Notifications" onClick={() => setNotificationsOpen(!notificationsOpen)}><Bell size={18} />{updates.length > 0 && <i />}</button><AnimatePresence>{notificationsOpen && <motion.div className="popover notification-popover" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}><strong>Notifications <span>{updates.length ? `${updates.length} latest` : 'Up to date'}</span></strong>{updates.length ? updates.slice(0, 4).map(update => <p key={update.id}><i /> {update.text} <small>{formatRelativeTime(update.timestamp)}</small></p>) : <p><i /> No account updates yet <small>Just now</small></p>}<button onClick={() => { setActive('Notifications'); setNotificationsOpen(false) }}>View all notifications</button></motion.div>}</AnimatePresence></div>{isAdmin && <div className="header-popover-wrap"><button className="button button-primary create-button" onClick={() => setQuickOpen(!quickOpen)}><Plus size={16} /> Create <ChevronDown size={14} /></button><AnimatePresence>{quickOpen && <motion.div className="popover quick-popover" initial={{ opacity: 0, y: 8, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8 }}><span>QUICK ACTIONS</span>{quickActions.map(action => <button key={action} onClick={() => openAction(action)}><Plus size={15} />{action}</button>)}</motion.div>}</AnimatePresence></div>}<div className="header-popover-wrap"><button className="header-user" onClick={() => setProfileOpen(!profileOpen)}><span className="profile-avatar small-avatar">{displayInitials}</span><ChevronDown size={14} /></button><AnimatePresence>{profileOpen && <motion.div className="popover profile-popover" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}><strong>{displayName}</strong><small>{displayEmail}</small><button onClick={() => { setActive(isAdmin ? 'Settings' : 'Account Settings'); setProfileOpen(false) }}><Settings size={15} /> Account settings</button><button onClick={handleLogout}><LogOut size={15} /> Log out</button></motion.div>}</AnimatePresence></div></div></header>
        <AnimatePresence mode="wait"><motion.main key={active} className="dash-content" variants={pageTransition} initial="initial" animate="animate" exit="exit">
          <div className="page-heading"><div><div className="today-label">{formatFullDate(now)}</div><h1>{active === 'Dashboard' || active === 'Overview' ? <>Good morning, {isAdmin ? 'Jordan' : displayName} <span className="greeting-spark">✦</span></> : active}</h1><p>{pageDescription(active, isAdmin)}</p></div>{!isAdmin && active === 'Browse Plans' && <button className="button button-primary" onClick={() => notify('Plan selection saved')}>Compare plans <ArrowRight size={15} /></button>}</div>
          {(active === 'Dashboard' || active === 'Overview') && <Overview isAdmin={isAdmin} customers={customers} range={range} onAction={openAction} user={user} />}
          {(active === 'All Customers' || active === 'Customer Details') && <CustomersTable customers={filteredCustomers} search={search} onView={name => notify(`Viewing ${name}`)} />}
          {(active === 'Manage Plans' || active === 'Subscription Plans') && <PlansGrid plans={plans} highlightedPlan={highlightedPlan} onAdd={() => openAction('Create Subscription Plan')} onNotify={notify} />}
          {(active === 'Browse Plans') && <div className="dashboard-pricing-grid">{plans.map((plan, i) => <PricingCard key={plan.name + i} plan={{ ...plan, highlighted: plan.name === highlightedPlan }} onChoose={() => { setCheckoutPlan(plan); setModal('Confirm subscription'); }} />)}</div>}
          {active === 'Create Plan' && <PlansGrid plans={plans} highlightedPlan={highlightedPlan} onAdd={() => openAction('Create Subscription Plan')} onNotify={notify} />}
          {active.includes('Invoice') && <Invoices invoices={invoices} onGenerate={() => openAction('Generate Invoice')} onNotify={notify} isAdmin={isAdmin} user={user} />}
          {active.includes('Payment') || active === 'Failed Payments' ? <Payments active={active} payments={payments} customers={customers} onNotify={notify} isAdmin={isAdmin} user={user} /> : null}
          {active.includes('Subscription') && active !== 'Subscription Plans' && active !== 'Create Plan' ? <Subscriptions active={active} onNotify={notify} user={user} /> : null}
          {active.includes('Analytics') || active.includes('MRR') || active.includes('Churn') || active.includes('Performance') ? <Analytics active={active} range={range} /> : null}
          {!['Dashboard', 'Overview', 'All Customers', 'Customer Details', 'Manage Plans', 'Subscription Plans', 'Browse Plans', 'Create Plan', 'All Invoices', 'My Invoices', 'Generate Invoice', 'Download PDF', 'Payment Transactions', 'Failed Payments', 'Payment History', 'Billing & Payments', 'Active Subscriptions', 'Trial Subscriptions', 'Past Due', 'Cancelled', 'My Subscription', 'Revenue Analytics', 'MRR & ARR', 'Churn Analysis', 'Plan Performance'].includes(active) && <GenericPage active={active} isAdmin={isAdmin} onNotify={notify} user={user} updates={updates} />}
        </motion.main></AnimatePresence>
        <footer className="dashboard-footer"><span>© {new Date().getFullYear()} Nexora, Inc.</span><span><a href="#support">Help center</a><a href="#status">System status <i className="status-live" /></a></span></footer>
      </div>
      <AnimatePresence>{modal && <Modal title={modal} plan={checkoutPlan} onClose={() => setModal('')} onSubmit={saveForm} onNotify={notify} />}</AnimatePresence>
      <AnimatePresence>{toast && <motion.div className="toast" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}><span><Check size={14} /></span>{toast}</motion.div>}</AnimatePresence>
      <AnimatePresence>{searchOpen && <motion.div className="search-overlay" role="presentation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={event => { if (event.target === event.currentTarget) closeSearch() }}><section className="search-dialog" role="dialog" aria-modal="true" aria-labelledby="search-dialog-title"><div className="search-dialog-header"><div><span className="search-dialog-kicker">NEXORA SEARCH</span><h2 id="search-dialog-title">Where would you like to go?</h2></div><button type="button" className="search-close-button" onClick={closeSearch} aria-label="Close search"><X size={20} /></button></div><label className="search-dialog-input"><Search size={20} /><input ref={searchInputRef} value={search} onChange={event => { setSearch(event.target.value); setSearchIndex(0) }} onKeyDown={event => { if (event.key === 'ArrowDown' && visibleSearchItems.length) { event.preventDefault(); setSearchIndex(index => (index + 1) % visibleSearchItems.length) } else if (event.key === 'ArrowUp' && visibleSearchItems.length) { event.preventDefault(); setSearchIndex(index => (index - 1 + visibleSearchItems.length) % visibleSearchItems.length) } else if (event.key === 'Enter' && visibleSearchItems[searchIndex]) { event.preventDefault(); chooseSearchItem(visibleSearchItems[searchIndex]) } }} placeholder="Search plans, subscriptions, or customers..." aria-label="Search plans, subscriptions, or customers" aria-controls="global-search-results" aria-activedescendant={visibleSearchItems.length ? `search-result-${searchIndex}` : undefined} /><kbd>ESC</kbd></label><div className="search-results-heading"><span>{normalizedSearch ? 'MATCHING DESTINATIONS' : 'QUICK ACCESS'}</span><small>↑↓ to navigate · Enter to open</small></div><div className="search-results" id="global-search-results" role="listbox" aria-label="Search results">{visibleSearchItems.map((item, index) => <button type="button" role="option" aria-selected={searchIndex === index} id={`search-result-${index}`} className={`search-result ${searchIndex === index ? 'search-result-active' : ''}`} key={`${item.destination}-${item.title}`} onMouseEnter={() => setSearchIndex(index)} onClick={() => chooseSearchItem(item)}><span className="search-result-icon"><item.icon size={18} /></span><span className="search-result-copy"><strong>{highlightSearchMatch(item.title, normalizedSearch)}</strong><small>{item.description}</small></span><span className="search-result-destination">{item.destination}<ArrowRight size={15} /></span></button>)}</div>{!visibleSearchItems.length && <div className="search-empty"><Search size={22} /><strong>No matching plans or pages</strong><span>Try a plan name, “plans,” or “subscriptions.”</span></div>}<div className="search-dialog-footer"><span>Search plans and subscription pages</span><span><kbd>↵</kbd> Open destination</span></div></section></motion.div>}</AnimatePresence>
    </div>
  )
}

function highlightSearchMatch(text, query) {
  const matchingTerm = query.split(/\s+/).find(term => text.toLowerCase().includes(term)) || ''
  const matchIndex = matchingTerm ? text.toLowerCase().indexOf(matchingTerm) : -1
  if (matchIndex < 0) return text
  return <>{text.slice(0, matchIndex)}<mark>{text.slice(matchIndex, matchIndex + matchingTerm.length)}</mark>{text.slice(matchIndex + matchingTerm.length)}</>
}

function pageDescription(active, isAdmin) {
  const descriptions = {
    Dashboard: 'Here’s what’s happening with your subscriptions today.',
    Overview: 'Your subscription at a glance. Everything is looking good.',
    'All Customers': 'Manage your customers and keep every relationship growing.',
    'Manage Plans': 'Create, edit, and manage your subscription plans.',
    'Subscription Plans': 'Create, edit, and manage your subscription plans.',
    'Browse Plans': 'Find the plan that gives your business room to grow.',
    'My Subscription': 'Manage your plan, billing cycle, and account details.',
    'Billing & Payments': 'Keep your payment details up to date.',
    'Payment History': 'A complete record of your payments and transactions.',
    'Payment Transactions': 'Review and manage your recent payment activity.',
    'Failed Payments': 'Follow up on payment issues and retry transactions.',
    'All Invoices': 'View, download, and manage invoices for your customers.',
    'My Invoices': 'Your invoices are ready whenever you need them.',
    'Revenue Analytics': 'Understand the trends behind your recurring revenue.',
    'MRR & ARR': 'Track the metrics that matter as you scale.',
    'Churn Analysis': 'Identify patterns and keep more customers for longer.',
    'Plan Performance': 'See how each plan contributes to your growth.',
  }
  return descriptions[active] || (isAdmin ? `Manage ${active.toLowerCase()} and keep your business moving.` : `Manage your ${active.toLowerCase()} and account preferences.`)
}

function Overview({ isAdmin, customers, range, onAction, user }) {
  const displayName = user?.name || 'Customer'
  const activityCustomers = isAdmin
    ? customers.slice(0, 4)
    : customers.slice(0, 4).map(customer => ({ ...customer, name: displayName }))
  const cards = isAdmin ? [
    { label: 'Monthly recurring revenue', value: '$48,294', change: '+12.8%', icon: Activity, positive: true },
    { label: 'Active subscriptions', value: '1,284', change: '+8.2%', icon: Zap, positive: true },
    { label: 'Total customers', value: '2,419', change: '+16.4%', icon: Users, positive: true },
    { label: 'Churn rate', value: '2.4%', change: '-0.8%', icon: ArrowDownRight, positive: true },
  ] : [
    { label: 'Current plan', value: 'Enterprise', change: 'Renews Nov 21', icon: Zap, positive: true },
    { label: 'Next payment', value: '$249.00', change: formatTableDate(new Date(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate())), icon: CreditCard, positive: true },
    { label: 'Total invoices', value: '18', change: 'View all →', icon: FileText, positive: true },
    { label: 'Account status', value: 'In good standing', change: 'All caught up', icon: ShieldCheck, positive: true },
  ]
  return <div className="overview-content"><div className="stats-grid">{cards.map((card, i) => <motion.div className="stat-card" key={card.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * .07 }}><div className="stat-card-top"><span>{card.label}</span><i><card.icon size={16} /></i></div><strong>{card.value}</strong><div className="stat-card-bottom"><span className="change-tag">{card.positive && <ArrowUpRight size={13} />}{card.change}</span><span>{isAdmin ? 'vs. last month' : ''}</span></div><div className="stat-sparkline">{[30, 45, 37, 58, 49, 67, 55, 75, 65, 90].map((h, j) => <i key={j} style={{ height: `${h}%`, opacity: .35 + j * .065 }} />)}</div></motion.div>)}</div>
    <div className="dashboard-grid"><section className="panel revenue-panel"><div className="panel-heading"><div><h2>{isAdmin ? 'Revenue overview' : 'Subscription overview'}</h2><p>{isAdmin ? 'Track your recurring revenue over time' : 'Your plan activity over the last 30 days'}</p></div><button className="subtle-select" onClick={() => {}}>{range}<ChevronDown size={14} /></button></div><div className="revenue-summary"><strong>{isAdmin ? '$48,294.00' : '$2,988.00'}</strong><span><ArrowUpRight size={13} /> 12.8%</span><small>vs. previous period</small></div><RevenueChart /></section>
      <section className="panel plan-panel"><div className="panel-heading"><div><h2>{isAdmin ? 'Plan distribution' : 'Your subscription'}</h2><p>{isAdmin ? 'Active subscriptions by plan' : 'Your active plan details'}</p></div><button className="more-button"><Ellipsis size={19} /></button></div>{isAdmin ? <><div className="donut-wrap"><div className="donut"><div><strong>1,284</strong><small>subscribers</small></div></div></div><div className="plan-legend"><span><i />Growth <strong>48%</strong></span><span><i />Starter <strong>32%</strong></span><span><i />Enterprise <strong>20%</strong></span></div></> : <div className="subscription-detail"><div className="subscription-logo"><Zap size={20} /></div><div><strong>Enterprise plan</strong><small>Billed monthly · Next bill Nov 21</small></div><button className="button button-outline" onClick={() => onAction('Change subscription')}>Manage</button><div className="subscription-includes"><span><Check size={13} />Unlimited seats</span><span><Check size={13} />Advanced analytics</span><span><Check size={13} />Priority support</span></div></div>}</section>
      <section className="panel activity-panel"><div className="panel-heading"><div><h2>{isAdmin ? 'Recent customers' : 'Recent activity'}</h2><p>{isAdmin ? 'The latest people joining your platform' : 'Your latest account activity'}</p></div><button className="link-button" onClick={() => onAction('All Customers')}>{isAdmin ? 'View all' : 'View history'} <ArrowRight size={14} /></button></div><CustomersMini customers={activityCustomers} isAdmin={isAdmin} /></section>
      <section className="panel quick-panel"><div className="panel-heading"><div><h2>{isAdmin ? 'Quick actions' : 'Need a hand?'}</h2><p>{isAdmin ? 'The things you do most, all in one place' : 'We’re here when you need us'}</p></div><Sparkles size={18} className="quick-spark" /></div>{isAdmin ? <div className="quick-actions-grid">{[['Create plan', '↗', 'Create Subscription Plan'], ['Add customer', '+', 'Add Customer'], ['Generate invoice', '▤', 'Generate Invoice'], ['Record payment', '↙', 'Record Payment']].map(([label, icon, full]) => <button key={label} onClick={() => onAction(full)}><span>{icon}</span>{label}<ArrowRight size={13} /></button>)}</div> : <div className="help-callout"><Headphones size={20} /><div><strong>Talk to a real person</strong><small>Our support team typically replies in under an hour.</small></div><button onClick={() => onAction('Help & Support')}><ArrowRight size={16} /></button></div>}</section></div>
  </div>
}

function RevenueChart() {
  return <div className="revenue-chart"><div className="revenue-y-axis"><span>$50k</span><span>$40k</span><span>$30k</span><span>$20k</span><span>$10k</span></div><div className="revenue-chart-inner"><div className="chart-grid-lines"><i /><i /><i /><i /><i /></div><svg viewBox="0 0 720 190" preserveAspectRatio="none"><defs><linearGradient id="dashArea" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor={cyan} stopOpacity=".16" /><stop offset="100%" stopColor={cyan} stopOpacity="0" /></linearGradient></defs><path d="M0 163 C40 155 43 151 74 148 S112 133 145 141 S184 119 218 123 S260 128 290 103 S330 117 362 94 S402 107 435 78 S473 97 507 70 S548 83 580 58 S620 72 650 38 S690 48 720 17 V190 H0 Z" fill="url(#dashArea)" /><path d="M0 163 C40 155 43 151 74 148 S112 133 145 141 S184 119 218 123 S260 128 290 103 S330 117 362 94 S402 107 435 78 S473 97 507 70 S548 83 580 58 S620 72 650 38 S690 48 720 17" fill="none" stroke={cyan} strokeWidth="2.5" /><circle cx="650" cy="38" r="4" fill={cyan} stroke="#10151f" strokeWidth="2" /></svg><div className="revenue-x-axis"><span>Sep 22</span><span>Sep 29</span><span>Oct 06</span><span>Oct 13</span><span>Oct 20</span></div></div></div>
}

function CustomersMini({ customers, isAdmin }) {
  return <div className="mini-customer-list">{customers.map((c, i) => <div className="mini-customer" key={`${c.email}-${i}`}><span className={`customer-avatar avatar-${i % 5}`}>{c.initials}</span><span className="mini-customer-name"><strong>{c.name}</strong><small>{isAdmin ? c.email : `Invoice #INV-${new Date().getFullYear()}-${1048 - i}`}</small></span><span className={`status-pill ${c.status.toLowerCase().replace(' ', '-')}`}>{c.status}</span><strong className="mini-amount">{c.amount}</strong></div>)}</div>
}

function CustomersTable({ customers, search, onView }) {
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  return <>
    <section className="panel full-table-panel"><div className="panel-heading"><div><h2>All customers <span className="count-badge">{customers.length}</span></h2><p>A list of everyone subscribed to your plans.</p></div><button className="button button-outline"><Download size={15} /> Export</button></div><div className="table-scroll"><table className="data-table"><thead><tr><th><input type="checkbox" aria-label="Select all" /></th><th>Customer</th><th>Plan</th><th>Payment method</th><th>Status</th><th>Amount</th><th>Next billing date</th><th /></tr></thead><tbody>{customers.map((c, i) => <tr key={`${c.email}-${i}`}><td><input type="checkbox" aria-label={`Select ${c.name}`} /></td><td><div className="table-person"><span className={`customer-avatar avatar-${i % 5}`}>{c.initials}</span><span><strong>{c.name}</strong><small>{c.email}</small>{c.phone && <small>{c.phone}</small>}</span></div></td><td>{c.plan}</td><td>{c.paymentMethod || 'Card ending in 4242'}</td><td><span className={`status-pill ${c.status.toLowerCase().replace(' ', '-')}`}>{c.status}</span></td><td>{c.amount}<small className="table-cycle"> / month</small></td><td>Nov {21 + i}, 2025</td><td><button className="row-action" aria-label={`View ${c.name}`} onClick={() => { setSelectedCustomer(c); onView(c.name) }}><Ellipsis size={18} /></button></td></tr>)}</tbody></table>{customers.length === 0 && <div className="empty-state">No customers match “{search}”.</div>}</div><div className="table-pagination"><span>Showing <strong>{customers.length ? 1 : 0}–{customers.length}</strong> of <strong>{customers.length}</strong> results</span><div><button><ChevronLeft size={15} /> Previous</button><button>Next <ChevronRight size={15} /></button></div></div></section>
    <AnimatePresence>{selectedCustomer && <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={event => { if (event.target === event.currentTarget) setSelectedCustomer(null) }}>
      <motion.section className="modal-card invoice-details-modal" role="dialog" aria-modal="true" aria-labelledby="customer-details-title" initial={{ opacity: 0, y: 16, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: .98 }} transition={{ duration: .2 }}>
        <div className="modal-heading"><div><span className="section-kicker">CUSTOMER DETAILS</span><h2 id="customer-details-title">{selectedCustomer.name}</h2><p>Client account and billing information.</p></div><button type="button" className="icon-button" onClick={() => setSelectedCustomer(null)} aria-label="Close customer details"><X size={18} /></button></div>
        <dl className="invoice-details-list">
          <div><dt>Email</dt><dd>{selectedCustomer.email}</dd></div>
          {selectedCustomer.phone && <div><dt>Phone</dt><dd>{selectedCustomer.phone}</dd></div>}
          {selectedCustomer.country && <div><dt>Country</dt><dd>{selectedCustomer.country}</dd></div>}
          <div><dt>Subscription plan</dt><dd>{selectedCustomer.plan}</dd></div>
          <div><dt>Payment method</dt><dd>{selectedCustomer.paymentMethod || 'Card ending in 4242'}</dd></div>
          <div><dt>Status</dt><dd><span className={`status-pill ${selectedCustomer.status.toLowerCase().replace(' ', '-')}`}>{selectedCustomer.status}</span></dd></div>
          <div><dt>Billing amount</dt><dd>{selectedCustomer.amount} / month</dd></div>
        </dl>
        <div className="modal-buttons"><button type="button" className="button button-outline" onClick={() => setSelectedCustomer(null)}>Close</button></div>
      </motion.section>
    </motion.div>}</AnimatePresence>
  </>
}

function PlansGrid({ plans, highlightedPlan, onAdd, onNotify }) {
  return <div><div className="section-toolbar"><div><span className="section-kicker">YOUR PRICING</span><h2>Subscription plans <span className="count-badge">{plans.length} plans</span></h2><p>Manage the plans your customers know and love.</p></div><button className="button button-primary" onClick={onAdd}><Plus size={16} /> Create plan</button></div><div className="dashboard-pricing-grid">{plans.map((plan, i) => <div className={`managed-plan ${plan.name === highlightedPlan ? 'search-result-highlight' : ''}`} key={`${plan.name}-${i}`}><div className="managed-plan-top"><span className="price-plan-icon"><Zap size={17} /></span><button className="more-button" onClick={() => onNotify(`${plan.name} plan options`)}><Ellipsis size={19} /></button></div><h3>{plan.name}</h3><p>{plan.description}</p><div className="managed-price"><strong>${plan.price}</strong><span>/ month</span></div><span className="plan-user-count">{plan.users}</span><div className="managed-plan-stats"><span>Active subscribers<strong>{plan.name === 'Growth' ? '616' : plan.name === 'Starter' ? '411' : '257'}</strong></span><span>Monthly revenue<strong>${plan.price * (plan.name === 'Growth' ? 616 : plan.name === 'Starter' ? 411 : 257) .toLocaleString()}</strong></span></div><button className="button button-outline" onClick={() => onNotify(`Editing ${plan.name} plan`)}>Edit plan <ArrowRight size={14} /></button></div>)}</div></div>
}

function Invoices({ invoices, onGenerate, onNotify, isAdmin, user }) {
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const today = new Date()
  const defaultInvoices = [
    ['INV-' + today.getFullYear() + '-1048', 'Olivia Rhye', formatTableDate(today), '$249.00', 'Paid'],
    ['INV-' + today.getFullYear() + '-1047', 'Phoenix Baker', formatTableDate(new Date(today.getTime() - 86400000)), '$89.00', 'Paid'],
    ['INV-' + today.getFullYear() + '-1046', 'Lana Steiner', formatTableDate(new Date(today.getTime() - 2 * 86400000)), '$29.00', 'Pending'],
    ['INV-' + today.getFullYear() + '-1045', 'Demi Wilkinson', formatTableDate(new Date(today.getTime() - 3 * 86400000)), '$89.00', 'Overdue'],
  ]
  const invoiceRows = invoices.length ? [...invoices, ...defaultInvoices] : defaultInvoices
  const visibleInvoices = isAdmin ? invoiceRows : invoiceRows.map(([id, , date, amount, status]) => [id, user?.name || 'Customer', date, amount, status])
  return <>
    <section className="panel full-table-panel">
      <div className="panel-heading"><div><h2>Recent invoices</h2><p>Manage and download your invoices.</p></div>{isAdmin && <button className="button button-primary" onClick={onGenerate}><Plus size={15} /> Generate invoice</button>}</div>
      <div className="table-scroll"><table className="data-table"><thead><tr><th>Invoice</th><th>Customer</th><th>Issue date</th><th>Amount</th><th>Status</th><th>Actions</th></tr></thead><tbody>
        {visibleInvoices.map(([id, name, date, amount, status]) => {
          const invoice = { id, name, date, amount, status }
          return <tr key={id}><td className="invoice-id">{id}</td><td>{name}</td><td>{date}</td><td>{amount}</td><td><span className={`status-pill ${status.toLowerCase()}`}>{status}</span></td><td><div className="invoice-row-actions"><button type="button" className="table-details-button" onClick={() => setSelectedInvoice(invoice)} aria-label={`View details for ${id}`}><FileText size={14} /><span>Details</span></button><button type="button" className="row-action" onClick={() => onNotify(`${id} downloaded`)} aria-label={`Download ${id}`}><Download size={16} /></button></div></td></tr>
        })}
      </tbody></table></div>
      <div className="table-pagination"><span>Showing <strong>1–{visibleInvoices.length}</strong> of <strong>{visibleInvoices.length}</strong> results</span><div><button><ChevronLeft size={15} /> Previous</button><button>Next <ChevronRight size={15} /></button></div></div>
    </section>
    <AnimatePresence>{selectedInvoice && <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={event => { if (event.target === event.currentTarget) setSelectedInvoice(null) }}>
      <motion.section className="modal-card invoice-details-modal" role="dialog" aria-modal="true" aria-labelledby="invoice-details-title" initial={{ opacity: 0, y: 16, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: .98 }} transition={{ duration: .2 }}>
        <div className="modal-heading"><div><span className="section-kicker">INVOICE DETAILS</span><h2 id="invoice-details-title">{selectedInvoice.id}</h2><p>Invoice summary and payment status.</p></div><button type="button" className="icon-button" onClick={() => setSelectedInvoice(null)} aria-label="Close invoice details"><X size={18} /></button></div>
        <dl className="invoice-details-list">
          <div><dt>Customer</dt><dd>{selectedInvoice.name}</dd></div>
          <div><dt>Issue date</dt><dd>{selectedInvoice.date}</dd></div>
          <div><dt>Amount due</dt><dd>{selectedInvoice.amount}</dd></div>
          <div><dt>Status</dt><dd><span className={`status-pill ${selectedInvoice.status.toLowerCase()}`}>{selectedInvoice.status}</span></dd></div>
        </dl>
        <div className="modal-buttons"><button type="button" className="button button-outline" onClick={() => setSelectedInvoice(null)}>Close</button><button type="button" className="button button-primary" onClick={() => { onNotify(`${selectedInvoice.id} downloaded`); setSelectedInvoice(null) }}><Download size={14} /> Download</button></div>
      </motion.section>
    </motion.div>}</AnimatePresence>
  </>
}

function Payments({ active, payments, customers, onNotify, isAdmin, user }) {
  const [selectedPayment, setSelectedPayment] = useState(null)
  const today = new Date()
  const defaultRows = [
    ['PMT-8042', 'Olivia Rhye', formatTableDate(today), '$249.00', 'Succeeded', 'Card ending in 4242'],
    ['PMT-8041', 'Phoenix Baker', formatTableDate(new Date(today.getTime() - 86400000)), '$89.00', 'Succeeded', 'UPI'],
    ['PMT-8040', 'Demi Wilkinson', formatTableDate(new Date(today.getTime() - 2 * 86400000)), '$89.00', 'Failed', 'Net banking'],
    ['PMT-8039', 'Candice Wu', formatTableDate(new Date(today.getTime() - 3 * 86400000)), '$249.00', 'Succeeded', 'Card ending in 4242'],
  ]
  const rows = payments.length ? [...payments, ...defaultRows] : defaultRows
  const visibleRows = isAdmin ? rows : rows.map(([id, , date, amount, status]) => [id, user?.name || 'Customer', date, amount, status])
  const filteredRows = visibleRows.filter(row => active !== 'Failed Payments' || row[4] === 'Failed')
  return <>
    <section className="panel full-table-panel"><div className="panel-heading"><div><h2>{active === 'Failed Payments' ? 'Failed payments' : 'Payment transactions'}</h2><p>Review your payment activity and transaction status.</p></div>{isAdmin && <button className="button button-outline" onClick={() => onNotify('Payment report exported')}><Download size={15} /> Export</button>}</div><div className="table-scroll"><table className="data-table"><thead><tr><th>Transaction</th><th>Customer</th><th>Date</th><th>Amount</th><th>Status</th><th>Actions</th></tr></thead><tbody>
      {filteredRows.map(([id, name, date, amount, status, method]) => {
        const customer = customers.find(item => item.name.toLowerCase() === name.toLowerCase()) || (!isAdmin && user?.name === name ? user : null)
        const payment = { id, name, date, amount, status, email: customer?.email, plan: customer?.plan, paymentMethod: method || customer?.paymentMethod }
        return <tr key={id}><td className="invoice-id">{id}</td><td>{name}</td><td>{date}</td><td>{amount}</td><td><span className={`status-pill ${status.toLowerCase()}`}>{status}</span></td><td><button type="button" className="table-details-button" onClick={() => setSelectedPayment(payment)} aria-label={`View details for payment ${id}`}><FileText size={14} /><span>Details</span></button></td></tr>
      })}
    </tbody></table></div></section>
    <AnimatePresence>{selectedPayment && <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={event => { if (event.target === event.currentTarget) setSelectedPayment(null) }}>
      <motion.section className="modal-card invoice-details-modal" role="dialog" aria-modal="true" aria-labelledby="payment-details-title" initial={{ opacity: 0, y: 16, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: .98 }} transition={{ duration: .2 }}>
        <div className="modal-heading"><div><span className="section-kicker">PAYMENT DETAILS</span><h2 id="payment-details-title">{selectedPayment.id}</h2><p>Customer and subscription payment information.</p></div><button type="button" className="icon-button" onClick={() => setSelectedPayment(null)} aria-label="Close payment details"><X size={18} /></button></div>
        <dl className="invoice-details-list">
          <div><dt>Customer</dt><dd>{selectedPayment.name}</dd></div>
          {selectedPayment.email && <div><dt>Email</dt><dd>{selectedPayment.email}</dd></div>}
          {selectedPayment.plan && <div><dt>Subscription plan</dt><dd>{selectedPayment.plan}</dd></div>}
          {selectedPayment.paymentMethod && <div><dt>Payment method</dt><dd>{selectedPayment.paymentMethod}</dd></div>}
          <div><dt>Payment date</dt><dd>{selectedPayment.date}</dd></div>
          <div><dt>Amount</dt><dd>{selectedPayment.amount}</dd></div>
          <div><dt>Status</dt><dd><span className={`status-pill ${selectedPayment.status.toLowerCase()}`}>{selectedPayment.status}</span></dd></div>
        </dl>
        <div className="modal-buttons"><button type="button" className="button button-outline" onClick={() => setSelectedPayment(null)}>Close</button></div>
      </motion.section>
    </motion.div>}</AnimatePresence>
  </>
}

function Subscriptions({ active, onNotify, user }) {
  const today = new Date()
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate())
  const data = [
    ['Olivia Rhye', 'Enterprise', '$249.00', formatTableDate(nextMonth), 'Active'],
    ['Phoenix Baker', 'Growth', '$89.00', formatTableDate(new Date(nextMonth.getTime() - 86400000)), 'Active'],
    ['Lana Steiner', 'Starter', '$29.00', formatTableDate(new Date(nextMonth.getTime() - 2 * 86400000)), 'Trial'],
    ['Demi Wilkinson', 'Growth', '$89.00', formatTableDate(new Date(nextMonth.getTime() - 3 * 86400000)), 'Past due'],
  ]
  const rows = active === 'My Subscription'
    ? [[user?.name || 'Customer', 'Enterprise', '$249.00', formatTableDate(nextMonth), 'Active']]
    : active === 'Active Subscriptions' ? data.filter(r => r[4] === 'Active') : active === 'Trial Subscriptions' ? data.filter(r => r[4] === 'Trial') : active === 'Past Due' ? data.filter(r => r[4] === 'Past due') : active === 'Cancelled' ? [] : data
  return <section className="panel full-table-panel"><div className="panel-heading"><div><h2>{active}</h2><p>Stay on top of customer plans and renewal dates.</p></div><button className="button button-outline" onClick={() => onNotify('Subscription report exported')}><Download size={15} /> Export</button></div>{rows.length ? <div className="table-scroll"><table className="data-table"><thead><tr><th>Customer</th><th>Plan</th><th>Amount</th><th>Next billing date</th><th>Status</th><th /></tr></thead><tbody>{rows.map((r, i) => <tr key={r[0]}><td><div className="table-person"><span className={`customer-avatar avatar-${i}`}>{r[0].split(' ').map(x => x[0]).join('')}</span><strong>{r[0]}</strong></div></td><td>{r[1]}</td><td>{r[2]}</td><td>{r[3]}</td><td><span className={`status-pill ${r[4].toLowerCase().replace(' ', '-')}`}>{r[4]}</span></td><td><button className="row-action" onClick={() => onNotify(`${r[0]} subscription options`)}><Ellipsis size={18} /></button></td></tr>)}</tbody></table></div> : <div className="empty-state">No {active.toLowerCase()} to show right now.</div>}</section>
}

function Analytics({ active, range }) {
  return <div className="analytics-wrap"><section className="panel revenue-panel"><div className="panel-heading"><div><h2>{active}</h2><p>Performance and trends for {range.toLowerCase()}.</p></div><button className="subtle-select">{range}<ChevronDown size={14} /></button></div><div className="revenue-summary"><strong>$48,294.00</strong><span><ArrowUpRight size={13} /> 12.8%</span><small>compared to previous period</small></div><RevenueChart /></section><div className="analytics-secondary">{[['Average revenue per customer', '$37.61', '+3.4%'], ['Customer lifetime value', '$864.20', '+8.1%'], ['Net revenue retention', '108.6%', '+2.2%']].map(([name, value, change]) => <div className="panel analytic-stat" key={name}><span>{name}</span><strong>{value}</strong><small><ArrowUpRight size={13} /> {change} vs. last month</small></div>)}</div></div>
}

function GenericPage({ active, isAdmin, onNotify, user, updates = [] }) {
  if (active.toLowerCase().includes('setting') || active === 'Security' || active === 'Billing Settings' || active === 'Profile Settings' || active === 'Account Settings') {
    return <section className="panel settings-panel"><div className="settings-title"><div className="settings-symbol"><Settings size={18} /></div><div><h2>Account preferences</h2><p>Manage your personal information and workspace preferences.</p></div></div><form onSubmit={event => {
      event.preventDefault()
      const data = Object.fromEntries(new FormData(event.currentTarget).entries())
      writeStored('nexora_profile', data)
      onNotify('Your settings have been saved')
      window.dispatchEvent(new Event('nexora-profile-updated'))
    }}><label>Full name<input name="name" defaultValue={isAdmin ? 'Jordan Davis' : user?.name || 'Customer'} /></label><label>Email address<input name="email" type="email" defaultValue={isAdmin ? 'jordan@nexora.io' : user?.email || ''} /></label><label>Time zone<select name="timezone" defaultValue="Pacific Time (PT)"><option>Pacific Time (PT)</option><option>Eastern Time (ET)</option><option>Greenwich Mean Time (GMT)</option></select></label><div className="settings-toggle"><div><strong>Email notifications</strong><small>Receive important updates about your account.</small></div><input name="notifications" type="checkbox" defaultChecked /></div><button className="button button-primary" type="submit">Save changes <Check size={15} /></button></form></section>
  }
  if (active === 'Notifications') {
    return <section className="panel generic-panel"><div className="generic-icon"><Bell /></div><h2>Latest updates</h2>{updates.length ? <div className="updates-list">{updates.map(update => <div className="update-row" key={update.id}><i /><div><strong>{update.text}</strong><small>{formatRelativeTime(update.timestamp)}</small></div></div>)}</div> : <p>No account updates yet. New changes will appear here.</p>}</section>
  }
  return <section className="panel generic-panel"><div className="generic-icon">{active === 'Notifications' ? <Bell /> : active.includes('Help') ? <Headphones /> : <Gauge />}</div><h2>{active === 'Notifications' ? 'You’re all caught up' : active.includes('Help') ? 'How can we help?' : `${active} at a glance`}</h2><p>{active === 'Notifications' ? 'We’ll let you know when something needs your attention.' : active.includes('Help') ? 'Browse helpful articles or get in touch with our friendly support team.' : 'Your account is in good shape. Check back here for the latest updates.'}</p>{active.includes('Help') && <button className="button button-primary" onClick={() => onNotify('Support request started')}>Contact support <ArrowRight size={15} /></button>}</section>
}

function Modal({ title, plan, onClose, onSubmit, onNotify }) {
  const [country, setCountry] = useState(phoneCountries[0].country)
  const [paymentMethod, setPaymentMethod] = useState('Card')
  const isPlan = title === 'Create Subscription Plan'
  const isCustomer = title === 'Add Customer'
  const isInvoice = title === 'Generate Invoice'
  const isConfirm = title === 'Confirm subscription'
  const selectedCountry = phoneCountries.find(item => item.country === country)
  const paymentMethods = ['Card', 'UPI', 'Net banking', 'Wallet']
  const completeCheckout = event => {
    event.preventDefault()
    onClose()
    onNotify(`Demo checkout selected: ${paymentMethod} for ${plan.name}. Payment processing isn't connected yet.`)
  }

  return (
    <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={event => { if (event.target === event.currentTarget) onClose() }}>
      <motion.div className="modal-card" initial={{ opacity: 0, y: 16, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: .98 }} transition={{ duration: .2 }}>
        <div className="modal-heading">
          <div>
            <span className="section-kicker">{isConfirm ? 'SECURE CHECKOUT' : 'QUICK ACTION'}</span>
            <h2>{title}</h2>
            <p>{isPlan ? 'Set up a plan your customers will love.' : isCustomer ? 'Add a customer to your Nexora workspace.' : isInvoice ? 'Create a new invoice for a customer.' : isConfirm ? 'Choose how you’d like to pay for your subscription.' : 'Complete this action for your workspace.'}</p>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Close dialog"><X size={18} /></button>
        </div>
        {isConfirm ? (
          <form className="checkout-form" onSubmit={completeCheckout}>
            <div className="checkout-plan">
              <span className="price-plan-icon"><Zap size={18} /></span>
              <div><strong>{plan.name} plan</strong><small>Monthly billing</small></div>
              <strong className="checkout-price">${plan.price}<small> / month</small></strong>
            </div>
            <fieldset className="payment-methods">
              <legend>Payment method</legend>
              {paymentMethods.map(method => (
                <label key={method} className={`payment-method ${paymentMethod === method ? 'payment-method-selected' : ''}`}>
                  <input type="radio" name="paymentMethod" value={method} checked={paymentMethod === method} onChange={() => setPaymentMethod(method)} />
                  <span>{method}</span>
                  {paymentMethod === method && <Check size={15} />}
                </label>
              ))}
            </fieldset>
            <p className="checkout-note">Demo checkout only. No payment will be processed.</p>
            <div className="modal-buttons">
              <button type="button" className="button button-outline" onClick={onClose}>Cancel</button>
              <button type="submit" className="button button-primary">Continue <ArrowRight size={15} /></button>
            </div>
          </form>
        ) : (
          <form onSubmit={isPlan || isCustomer ? onSubmit : event => { event.preventDefault(); onClose(); onNotify(`${title} completed successfully`) }} className="modal-form">
            {isPlan && <>
              <label>Plan name<input name="name" placeholder="e.g. Growth" required /></label>
              <label>Monthly price<div className="input-prefix"><span>$</span><input name="price" type="number" min="1" placeholder="89" required /></div></label>
              <label>Plan description<input name="description" placeholder="What’s included in this plan?" /></label>
              <label>Billing cycle<select name="cycle"><option>Monthly</option><option>Yearly</option></select></label>
            </>}
            {isCustomer && <>
              <label>Username / full name<input name="name" placeholder="Full name" autoComplete="name" required /></label>
              <label>Email address<input name="email" type="email" placeholder="name@company.com" autoComplete="email" required /></label>
              <label>Country
                <select name="country" value={country} onChange={event => setCountry(event.target.value)} required>
                  {phoneCountries.map(item => <option key={item.country} value={item.country}>{item.country}</option>)}
                </select>
              </label>
              <label>Phone number
                <div className="phone-input"><span>{selectedCountry.code}</span><input name="phone" type="tel" inputMode="tel" autoComplete="tel-national" placeholder="Phone number" required /></div>
              </label>
              <label>Subscription plan<select name="plan"><option>Starter</option><option>Growth</option><option>Enterprise</option></select></label>
              <label>Payment method<select name="paymentMethod"><option>Card ending in 4242</option><option>UPI</option><option>Net banking</option><option>Wallet</option></select></label>
            </>}
            {isInvoice && <>
              <label>Customer<select name="customer"><option>Olivia Rhye · olivia@catalog.co</option><option>Phoenix Baker · phoenix@lattice.io</option><option>Choose a customer…</option></select></label>
              <label>Invoice amount<div className="input-prefix"><span>$</span><input name="amount" type="number" placeholder="249.00" required /></div></label>
              <label>Due date<input name="date" type="date" required /></label>
            </>}
            {title === 'Record Payment' && <>
              <label>Customer<select name="customer"><option>Olivia Rhye</option><option>Phoenix Baker</option></select></label>
              <label>Payment amount<div className="input-prefix"><span>$</span><input name="amount" type="number" placeholder="249.00" required /></div></label>
              <label>Payment method<select name="paymentMethod"><option>Card ending in 4242</option><option>UPI</option><option>Net banking</option><option>Wallet</option><option>Bank transfer</option></select></label>
            </>}
            {!isPlan && !isCustomer && !isInvoice && title !== 'Record Payment' && <>
              <label>Choose an option<select><option>Enterprise — $249/month</option><option>Growth — $89/month</option><option>Starter — $29/month</option></select></label>
              <label>Effective date<input type="date" /></label>
            </>}
            <div className="modal-buttons">
              <button type="button" className="button button-outline" onClick={onClose}>Cancel</button>
              <button type="submit" className="button button-primary">{isPlan ? 'Create plan' : isCustomer ? 'Add customer' : isInvoice ? 'Create invoice' : title === 'Record Payment' ? 'Record payment' : 'Continue'} <ArrowRight size={15} /></button>
            </div>
          </form>
        )}
      </motion.div>
    </motion.div>
  )
}

function getAssistantReply(message) {
  const query = message.toLowerCase()

  if (/\b(hi|hello|hey|good morning|good afternoon)\b/.test(query)) {
    return 'Hi! I can help with plans, billing, payments, invoices, and account access. What would you like to know?'
  }
  if (/\b(price|pricing|plan|starter|growth|enterprise|cost|how much)\b/.test(query)) {
    const planList = initialPlans.map(plan => `${plan.name}: $${plan.price}/month`).join(' · ')
    return `Our current plans are ${planList}. You can compare their features in the pricing section.`
  }
  if (/\b(pay|payment|card|checkout|upi|bank|wallet|charge)\b/.test(query)) {
    return 'Checkout is currently a demo: no payment is processed or card details saved. The dashboard can show recorded demo payments under Billing & Payments.'
  }
  if (/\b(invoice|receipt|pdf|download)\b/.test(query)) {
    return 'Invoices are listed in My Invoices (customer account) or Invoices (admin workspace). Use the download icon on an invoice row. Generated demo invoices appear in the invoice list.'
  }
  if (/\b(cancel|cancellation|change plan|upgrade|downgrade|subscription|renew)\b/.test(query)) {
    return 'Open My Subscription in your customer account to review your plan. Plan changes are currently a demo interaction; no real subscription or renewal is processed.'
  }
  if (/\b(sign ?up|register|create account|login|log in|password|forgot)\b/.test(query)) {
    return 'Use the Sign up or Log in buttons in the top navigation. Sign up requires your name, a valid email address, and a password of at least 8 characters. Use the eye icon to show or hide your password.'
  }
  if (/\b(customer|add customer|contact|support|help|human|email)\b/.test(query)) {
    return 'For account-specific help, open Help & Support in the dashboard or use the Contact section on the home page. This help bot does not access private account data.'
  }
  if (/\b(feature|how does|analytics|security|retry|revenue)\b/.test(query)) {
    return 'Nexora’s demo showcases subscription plans, customer management, billing and invoice views, and revenue analytics. Use the Features section on the home page to explore them. Some dashboard data is sample data.'
  }
  return 'I can answer common questions about plan pricing, payments, invoices, subscriptions, sign-in, and support. Try asking about one of those topics.'
}

function HelpAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState([
    { id: 'welcome', role: 'assistant', text: 'Hi! I’m the Nexora help assistant. Ask me about plans, billing, invoices, or your account.' },
  ])
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [messages, isOpen])

  const ask = text => {
    const trimmed = text.trim()
    if (!trimmed) return
    setMessages(previous => [
      ...previous,
      { id: `${Date.now()}-user`, role: 'user', text: trimmed },
      { id: `${Date.now()}-assistant`, role: 'assistant', text: getAssistantReply(trimmed) },
    ])
    setQuestion('')
  }

  return (
    <div className="help-assistant">
      <AnimatePresence>
        {isOpen && (
          <motion.section className="help-chat-panel" role="dialog" aria-modal="false" aria-labelledby="help-chat-title"
            initial={{ opacity: 0, y: 14, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: .97 }} transition={{ duration: .18 }}>
            <header className="help-chat-header">
              <span className="help-chat-avatar"><Bot size={19} /></span>
              <div><strong id="help-chat-title">Nexora help</strong><small>Instant answers to common questions</small></div>
              <button type="button" className="help-chat-close" onClick={() => setIsOpen(false)} aria-label="Close help chat"><X size={18} /></button>
            </header>
            <div className="help-chat-messages" role="log" aria-live="polite">
              {messages.map(item => (
                <div className={`help-chat-message ${item.role === 'user' ? 'help-chat-user' : ''}`} key={item.id}>
                  {item.role === 'assistant' && <Bot size={14} aria-hidden="true" />}
                  <p>{item.text}</p>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            {messages.length === 1 && <div className="help-chat-suggestions">
              {['What plans do you offer?', 'Are payments real?', 'Where are my invoices?'].map(prompt => (
                <button type="button" key={prompt} onClick={() => ask(prompt)}>{prompt}</button>
              ))}
            </div>}
            <form className="help-chat-form" onSubmit={event => { event.preventDefault(); ask(question) }}>
              <input aria-label="Ask Nexora help" value={question} onChange={event => setQuestion(event.target.value)} placeholder="Ask a question..." maxLength={500} />
              <button type="submit" aria-label="Send question" disabled={!question.trim()}><Send size={16} /></button>
            </form>
            <p className="help-chat-note">Automated help · Don’t share passwords or payment details</p>
          </motion.section>
        )}
      </AnimatePresence>
      <button type="button" className={`help-assistant-toggle ${isOpen ? 'help-assistant-toggle-open' : ''}`}
        onClick={() => setIsOpen(open => !open)} aria-label={isOpen ? 'Close help assistant' : 'Open help assistant'}
        aria-expanded={isOpen}>
        {isOpen ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </div>
  )
}

export default function App() {
  const [mode, setMode] = useState('landing')
  const [role, setRole] = useState('admin')
  const [pendingCheckout, setPendingCheckout] = useState(null)
  const [user, setUser] = useState(null)
  const [authReady, setAuthReady] = useState(false)

  useEffect(() => {
    let active = true
    const restoreSession = async () => {
      try {
        const { response, result } = await apiRequest('/api/auth/me')
        if (response.status === 401) return
        if (!response.ok) throw new Error(result?.error || 'Unable to restore your session.')
        if (!result?.user) throw new Error('The authentication service did not return account details.')
        if (active) {
          setUser(result.user)
          setRole('customer')
          setMode('dashboard')
        }
      } catch (error) {
        console.error('Unable to restore the customer session.', error)
      } finally {
        if (active) setAuthReady(true)
      }
    }
    restoreSession()
    return () => { active = false }
  }, [])

  const enterDashboard = (nextRole, plan = null) => { setRole(nextRole); setPendingCheckout(plan); setMode('dashboard'); window.scrollTo(0, 0) }
  const authenticate = async credentials => {
    const endpoint = credentials.mode === 'signup' ? '/api/auth/signup' : '/api/auth/login'
    const { response, result } = await apiRequest(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    })
    if (!response.ok) {
      const message = result?.error || (response.status === 404 || response.status >= 500
        ? 'The authentication service is unavailable. Restart the app with npm run dev and try again.'
        : 'Unable to authenticate. Please check your details and try again.')
      throw new Error(message)
    }
    if (!result?.user) throw new Error('The authentication service did not return account details.')
    setUser(result.user)
    setRole('customer')
    setPendingCheckout(null)
    setMode('dashboard')
    window.scrollTo(0, 0)
  }
  const logout = async () => {
    const { response, result } = await apiRequest('/api/auth/logout', { method: 'POST' })
    if (!response.ok) throw new Error(result?.error || 'Unable to log out. Please try again.')
    setUser(null)
    setPendingCheckout(null)
    setMode('landing')
    window.scrollTo(0, 0)
  }

  if (!authReady) return <div className="auth-loading" role="status">Loading your Nexora workspace…</div>
  return <>
    <AnimatePresence mode="wait">{mode === 'landing' ? <motion.div key="landing" variants={pageTransition} initial="initial" animate="animate" exit="exit"><Landing onAuth={authenticate} onStart={enterDashboard} /></motion.div> : <motion.div key="dashboard" variants={pageTransition} initial="initial" animate="animate" exit="exit"><Dashboard role={role} user={user} onLogout={logout} initialCheckout={pendingCheckout} /></motion.div>}</AnimatePresence>
    <HelpAssistant />
  </>
}
