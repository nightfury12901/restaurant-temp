import { useEffect, useRef, useState } from "react"
import { motion, useInView, useScroll, useTransform, useMotionValue, AnimatePresence } from "framer-motion"
import ReservationModal from "./components/ReservationModal"

// Page Load Animation
const PageLoader = ({ onComplete }) => {
  return (
    <motion.div
      className="fixed inset-0 z-[9998] bg-luxuryGreen-900 flex items-center justify-center"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 1, delay: 2 }}
      onAnimationComplete={onComplete}
    >
      <motion.div className="text-center">
        <motion.div
          className="text-6xl md:text-8xl font-extralight text-luxuryGold-400 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {"FINE DINING HAVEN".split("").map((char, i) => (
            <motion.span
              key={i}
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.05, duration: 0.5, ease: "easeOut" }}
              className="inline-block"
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </motion.div>
        <motion.div
          className="mt-8 h-[2px] bg-luxuryGold-400"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.8, duration: 1.2, ease: "easeInOut" }}
        />
      </motion.div>
    </motion.div>
  )
}

// Magnetic Button Component
const MagneticButton = ({ children, className, ...props }) => {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const handleMouse = (e) => {
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set((e.clientX - centerX) * 0.3)
    y.set((e.clientY - centerY) * 0.3)
  }

  const reset = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.button
      ref={ref}
      style={{ x, y }}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={className}
      {...props}
    >
      {children}
    </motion.button>
  )
}

// Text Reveal Animation
const TextReveal = ({ children, className, delay = 0 }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ y: "100%" }}
        animate={isInView ? { y: 0 } : {}}
        transition={{ duration: 0.8, delay, ease: [0.33, 1, 0.68, 1] }}
      >
        {children}
      </motion.div>
    </div>
  )
}

// Split Text Animation
const SplitText = ({ children, className, delay = 0 }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  const words = children.split(" ")

  return (
    <div ref={ref} className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.25em]">
          <motion.span
            className="inline-block"
            initial={{ y: "100%", opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: delay + i * 0.05, ease: [0.33, 1, 0.68, 1] }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </div>
  )
}

// Counter Animation
const AnimatedCounter = ({ target, suffix = "", duration = 2 }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (isInView) {
      let start = 0
      const increment = target / (duration * 60)
      const timer = setInterval(() => {
        start += increment
        if (start >= target) {
          setCount(target)
          clearInterval(timer)
        } else {
          setCount(Math.floor(start))
        }
      }, 1000 / 60)
      return () => clearInterval(timer)
    }
  }, [isInView, target, duration])

  return <span ref={ref}>{count}{suffix}</span>
}

// 3D Tilt Card
const TiltCard = ({ children, className }) => {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const rotateX = useTransform(y, [-0.5, 0.5], [15, -15])
  const rotateY = useTransform(x, [-0.5, 0.5], [-15, 15])

  const handleMouse = (e) => {
    const rect = ref.current.getBoundingClientRect()
    const xVal = (e.clientX - rect.left) / rect.width - 0.5
    const yVal = (e.clientY - rect.top) / rect.height - 0.5
    x.set(xVal)
    y.set(yVal)
  }

  const reset = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default function App() {
  const [loading, setLoading] = useState(true)
  const [reservationOpen, setReservationOpen] = useState(false)

  const openReservation = () => setReservationOpen(true)
  const closeReservation = () => setReservationOpen(false)

  return (
    <div className="min-h-screen text-luxuryGold-400" style={{
      background: 'linear-gradient(135deg, #0a1f14 0%, #152f21 25%, #1a3a28 50%, #0d1a12 75%, #050a07 100%)'
    }}>
      {/* Subtle Animated Gradient Overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-30" style={{
        background: 'radial-gradient(ellipse at 30% 20%, rgba(255,204,51,0.08) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(255,214,102,0.05) 0%, transparent 50%)'
      }} />

      <div className="relative z-10">
        <AnimatePresence>
          {loading && <PageLoader onComplete={() => setLoading(false)} />}
        </AnimatePresence>
        <Navbar onBookClick={openReservation} />
        <Hero onReserveClick={openReservation} />
        <Philosophy />
        <SectionDivider />
        <Menu />
        <SectionDivider />
        <Kitchen />
        <Origin />
        <SectionDivider />
        <Gallery />
        <Testimonials />
        <SectionDivider />
        <CTA />
        <Contact onReserveClick={openReservation} />
        <Footer />
      </div>

      {/* Reservation Modal */}
      <ReservationModal isOpen={reservationOpen} onClose={closeReservation} />
    </div>
  )
}

const Navbar = ({ onBookClick }) => {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 1, delay: 2.2 }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ${scrolled
        ? "bg-luxuryGreen-900/90 backdrop-blur-xl py-4 shadow-2xl shadow-black/20"
        : "bg-transparent py-6"
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="text-xl font-light tracking-[0.3em]"
        >
          <span className="text-luxuryGold-300">FINE</span> DINING HAVEN
        </motion.div>
        <div className="hidden md:flex gap-12 text-sm font-light tracking-[0.2em] uppercase">
          {["Philosophy", "Menu", "Kitchen", "Reserve"].map((item, i) => (
            <motion.a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="relative group"
              whileHover={{ y: -2 }}
            >
              {item}
              <motion.span
                className="absolute -bottom-1 left-0 w-full h-px bg-luxuryGold-400 origin-left"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.a>
          ))}
        </div>
        <MagneticButton
          onClick={onBookClick}
          className="px-8 py-3 border border-luxuryGold-400/50 text-sm tracking-[0.2em] hover:bg-luxuryGold-400 hover:text-luxuryGreen-900 transition-all duration-500 backdrop-blur-sm"
        >
          BOOK TABLE
        </MagneticButton>
      </div>
    </motion.nav>
  )
}

const Hero = ({ onReserveClick }) => {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0.3])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2])

  return (
    <section ref={ref} className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <motion.div
        style={{ y, scale }}
        className="absolute inset-0"
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="https://v1.pinimg.com/videos/iht/expMp4/0e/f0/5b/0ef05bcb49f3063eea24c7434a2b68af_720w.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-luxuryGreen-900/60 via-luxuryGreen-900/40 to-luxuryGreen-900/80" />
      </motion.div>



      <motion.div
        style={{ opacity }}
        className="relative z-10 text-center px-6 max-w-6xl"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 2.3 }}
          className="mb-8"
        >
          <span className="text-sm tracking-[0.5em] text-luxuryGold-300 uppercase">
            Est. 2010 · New York
          </span>
        </motion.div>

        <div className="overflow-hidden mb-8">
          <motion.h1
            initial={{ y: 150 }}
            animate={{ y: 0 }}
            transition={{ duration: 1.2, delay: 2.5, ease: [0.33, 1, 0.68, 1] }}
            className="text-5xl md:text-8xl lg:text-9xl font-extralight leading-[0.9] tracking-tight"
          >
            Where Taste Meets
          </motion.h1>
        </div>
        <div className="overflow-hidden mb-12">
          <motion.h1
            initial={{ y: 150 }}
            animate={{ y: 0 }}
            transition={{ duration: 1.2, delay: 2.7, ease: [0.33, 1, 0.68, 1] }}
            className="text-5xl md:text-8xl lg:text-9xl font-light leading-[0.9] tracking-tight"
          >
            <span className="italic text-luxuryGold-300">Experience</span>
          </motion.h1>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 3 }}
          className="text-lg md:text-2xl font-extralight max-w-3xl mx-auto leading-relaxed text-gray-200/90"
        >
          Where the finest products from renowned regions blend with French craftsmanship
          and the flavors of Japan
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.3 }}
          className="mt-16 flex flex-col sm:flex-row gap-6 justify-center items-center"
        >
          <MagneticButton
            className="px-12 py-5 bg-luxuryGold-400 text-luxuryGreen-900 text-sm tracking-[0.2em] font-medium transition-all duration-500 hover:bg-luxuryGold-300"
          >
            VIEW MENU
          </MagneticButton>
          <MagneticButton
            onClick={onReserveClick}
            className="px-12 py-5 border-2 border-white/50 text-white text-sm tracking-[0.2em] font-light transition-all duration-500 hover:bg-white hover:text-luxuryGreen-900 backdrop-blur-sm"
          >
            RESERVE A TABLE
          </MagneticButton>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 15, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="w-px h-16 bg-gradient-to-b from-luxuryGold-400 to-transparent"
        />
      </motion.div>
    </section>
  )
}

const Philosophy = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="philosophy" className="py-40 relative overflow-hidden">
      {/* Background Gradient Orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-luxuryGold-400/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-luxuryGold-400/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <motion.div
          ref={ref}
          className="text-center mb-24"
        >
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-sm tracking-[0.5em] text-luxuryGold-300 uppercase mb-8 block"
          >
            Our Philosophy
          </motion.span>

          <TextReveal className="mb-6">
            <h2 className="text-4xl md:text-7xl font-extralight leading-tight">
              A Place That Bears
            </h2>
          </TextReveal>
          <TextReveal delay={0.1}>
            <h2 className="text-4xl md:text-7xl font-light leading-tight">
              <span className="italic text-luxuryGold-300">Our Personal Touch</span>
            </h2>
          </TextReveal>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-xl md:text-2xl font-extralight text-gray-300 max-w-4xl mx-auto leading-relaxed mt-12"
          >
            Every dish comes directly from our heart – individually composed, thoughtfully crafted,
            and perfected down to the finest detail.
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mt-32">
          {[
            { number: 23, suffix: "", label: "Course Menu", desc: "A finely tuned culinary experience" },
            { number: 100, suffix: "%", label: "Handcraft", desc: "Every detail personally considered" },
            { number: 15, suffix: "+", label: "Years", desc: "Of culinary excellence" }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.5 + i * 0.2 }}
              whileHover={{ y: -10 }}
              className="text-center group cursor-hover p-8 rounded-2xl bg-gradient-to-b from-white/5 to-transparent border border-white/5 hover:border-luxuryGold-400/30 transition-all duration-500"
            >
              <div className="text-6xl md:text-8xl font-extralight mb-4 text-luxuryGold-400 transition-all duration-500 group-hover:text-luxuryGold-300">
                <AnimatedCounter target={item.number} suffix={item.suffix} />
              </div>
              <h3 className="text-xl font-light tracking-wider mb-3">{item.label}</h3>
              <p className="text-gray-400 font-extralight leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Decorative Section Divider
const SectionDivider = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <div ref={ref} className="py-16 flex items-center justify-center gap-4 relative">
      {/* Three animated dots */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.1 + i * 0.15, type: "spring", stiffness: 300 }}
          className={`rounded-full bg-luxuryGold-400 ${i === 1 ? 'w-3 h-3' : 'w-2 h-2 opacity-60'}`}
        />
      ))}

      {/* Subtle glow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: 0.3 }}
        className="absolute w-32 h-32 bg-luxuryGold-400/10 rounded-full blur-3xl"
      />
    </div>
  )
}

const Menu = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [activeFilter, setActiveFilter] = useState("All")

  const dishes = [
    { name: "Amuse-Bouche · Local Surprise", img: "https://i.pinimg.com/736x/e8/35/ed/e835ed89023c2a6d2d1933321d59efc4.jpg", category: "Starters", price: "85" },
    { name: "Oysters · Yuzu · Caviar", img: "https://i.pinimg.com/736x/cc/16/0b/cc160b4d778c8374d7c6e5e4d1101028.jpg", category: "Starters", price: "120" },
    { name: "Wagyu Tartare · Truffle", img: "https://i.pinimg.com/736x/21/1c/19/211c1953cf3a604cf6ffe0590eb167d1.jpg", category: "Mains", price: "180" },
    { name: "Lobster · Champagne Foam", img: "https://i.pinimg.com/736x/2a/fc/05/2afc053b9ac5d29c7b314a23faf58d9f.jpg", category: "Mains", price: "195" },
    { name: "Foie Gras · Apple · Hazelnut", img: "https://i.pinimg.com/736x/bc/2b/38/bc2b38e58739cc17a063d93997a7013d.jpg", category: "Starters", price: "145" },
    { name: "Scallop · Curry · Lime", img: "https://i.pinimg.com/736x/33/1c/cc/331cccbfef47eb0c1138a3d175c82af9.jpg", category: "Mains", price: "165" },
    { name: "Chocolate Soufflé · Gold Leaf", img: "https://i.pinimg.com/736x/5c/89/b7/5c89b70ab3806050c257c791689b97e5.jpg", category: "Desserts", price: "75" },
    { name: "Passion Fruit · Coconut Cloud", img: "https://i.pinimg.com/736x/85/5a/b0/855ab02628980881558f18fa8fd60bbf.jpg", category: "Desserts", price: "70" }
  ]

  const filters = ["All", "Starters", "Mains", "Desserts"]
  const filteredDishes = activeFilter === "All" ? dishes : dishes.filter(d => d.category === activeFilter)

  return (
    <section id="menu" className="py-40 relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <span className="text-sm tracking-[0.5em] text-luxuryGold-300 uppercase mb-8 block">
            Culinary Creations
          </span>
          <TextReveal>
            <h2 className="text-5xl md:text-8xl font-extralight mb-8">The Menu</h2>
          </TextReveal>
          <SplitText className="text-xl md:text-2xl font-extralight text-gray-300 max-w-3xl mx-auto" delay={0.2}>
            A 23-course menu combining the highest precision with surprising flavors
          </SplitText>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3 }}
          className="flex justify-center gap-4 mb-16 flex-wrap"
        >
          {filters.map((filter) => (
            <motion.button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-8 py-3 text-sm tracking-[0.15em] transition-all duration-300 cursor-hover rounded-full ${activeFilter === filter
                ? "bg-luxuryGold-400 text-luxuryGreen-900"
                : "border border-white/20 hover:border-luxuryGold-400/50"
                }`}
            >
              {filter}
            </motion.button>
          ))}
        </motion.div>

        <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredDishes.map((dish, i) => (
              <motion.div
                key={dish.name}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
              >
                <TiltCard className="group cursor-hover">
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-sm border border-white/10 hover:border-luxuryGold-400/30 transition-all duration-500">
                    {/* Image Container */}
                    <div className="relative h-64 overflow-hidden">
                      <motion.img
                        src={dish.img}
                        alt={dish.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-luxuryGreen-900 via-transparent to-transparent opacity-80" />

                      {/* Chef's Pick Badge */}
                      {i < 2 && (
                        <motion.div
                          initial={{ x: -100 }}
                          animate={{ x: 0 }}
                          className="absolute top-4 left-4 px-3 py-1 bg-luxuryGold-400 text-luxuryGreen-900 text-xs tracking-wider rounded-full font-medium"
                        >
                          CHEF'S PICK
                        </motion.div>
                      )}

                      {/* Price */}
                      <div className="absolute top-4 right-4 text-2xl font-light text-white">
                        ${dish.price}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="text-xs text-luxuryGold-400 tracking-[0.2em] mb-2">{dish.category.toUpperCase()}</div>
                      <h3 className="text-lg font-light tracking-wide leading-snug">{dish.name}</h3>

                      {/* Hover Reveal */}
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        whileHover={{ height: "auto", opacity: 1 }}
                        className="overflow-hidden"
                      >
                        <p className="text-gray-400 text-sm mt-3 font-extralight">
                          Prepared with locally sourced ingredients and seasonal produce
                        </p>
                      </motion.div>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          className="text-center mt-20"
        >
          <MagneticButton
            className="px-16 py-5 border-2 border-luxuryGold-400 text-luxuryGold-400 text-sm tracking-[0.2em] transition-all duration-500 hover:bg-luxuryGold-400 hover:text-luxuryGreen-900 cursor-hover"
          >
            VIEW FULL MENU
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  )
}

const Kitchen = () => {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"])
  const isInView = useInView(ref, { once: true })

  return (
    <section id="kitchen" className="py-40 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div ref={ref} className="grid md:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -80 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1.2, ease: [0.33, 1, 0.68, 1] }}
          >
            <span className="text-sm tracking-[0.5em] text-luxuryGold-300 uppercase mb-8 block">
              The Heart
            </span>

            <TextReveal className="mb-4">
              <h2 className="text-4xl md:text-6xl font-extralight leading-tight">
                Highest Precision,
              </h2>
            </TextReveal>
            <TextReveal delay={0.1}>
              <h2 className="text-4xl md:text-6xl font-light leading-tight">
                <span className="italic text-luxuryGold-300">Calm and Heart</span>
              </h2>
            </TextReveal>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.4 }}
              className="text-xl font-extralight text-gray-300 leading-relaxed my-8"
            >
              Deliberately small and exclusive – to give full attention to every dish
              and lighting composition. An intimate space, personal and full of atmosphere.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.6 }}
              className="flex gap-8 mt-12"
            >
              {[
                { num: "12", label: "Seats Only" },
                { num: "3", label: "Michelin Stars" }
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <div className="text-4xl font-extralight text-luxuryGold-400 mb-2">{item.num}</div>
                  <div className="text-sm tracking-wider text-gray-400">{item.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="relative"
          >
            <motion.div
              style={{ y }}
              className="relative h-[500px] md:h-[600px] rounded-3xl overflow-hidden"
            >
              <video
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              >
                <source src="https://v1.pinimg.com/videos/iht/expMp4/ab/8a/c2/ab8ac2807e2b41f8ac91173c683dc866_720w.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-luxuryGreen-900/60 to-transparent" />
            </motion.div>

            {/* Decorative Elements */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-8 -right-8 w-32 h-32 border border-luxuryGold-400/30 rounded-full"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute -bottom-8 -left-8 w-48 h-48 border border-luxuryGold-400/20 rounded-full"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

const Origin = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <section className="py-40 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <motion.div
          ref={ref}
          className="text-center"
        >
          <span className="text-sm tracking-[0.5em] text-luxuryGold-300 uppercase mb-8 block">
            Our Philosophy
          </span>

          <TextReveal className="mb-4">
            <h2 className="text-4xl md:text-6xl font-extralight leading-tight">
              From Farm to Fork
            </h2>
          </TextReveal>
          <TextReveal delay={0.1}>
            <h2 className="text-4xl md:text-6xl font-light leading-tight">
              <span className="italic text-luxuryGold-300">With Purpose</span>
            </h2>
          </TextReveal>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.4 }}
            className="mt-16 max-w-4xl mx-auto"
          >
            <p className="text-xl md:text-2xl font-extralight text-gray-300 leading-relaxed mb-8">
              We source <span className="text-luxuryGold-400 font-light">directly from local farms</span> within 50 miles,
              ensuring every vegetable reaches your plate within 24 hours of harvest.
            </p>
            <p className="text-xl md:text-2xl font-extralight text-gray-300 leading-relaxed mb-8">
              Our seafood arrives daily from <span className="text-luxuryGold-400 font-light">sustainable fisheries</span> in
              Brittany, while our wagyu is aged for a minimum of 45 days.
            </p>
            <p className="text-xl md:text-2xl font-extralight text-gray-300 leading-relaxed">
              In our kitchen, <span className="text-luxuryGold-400 font-light">nothing goes to waste</span>.
              Every trim, every peel, every bone finds new life in our stocks, oils, and ferments.
            </p>
          </motion.div>

          {/* Simple stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.8 }}
            className="flex justify-center gap-16 mt-20"
          >
            {[
              { num: "50mi", label: "Maximum Sourcing Radius" },
              { num: "24hrs", label: "Farm to Table" },
              { num: "0", label: "Waste to Landfill" }
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-4xl font-extralight text-luxuryGold-400 mb-2">{item.num}</div>
                <div className="text-xs tracking-widest text-gray-400 uppercase">{item.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

const Gallery = () => {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-83.33%"])

  const images = [
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
    "https://images.unsplash.com/photo-1551782450-17144efb5723?w=800",
    "https://images.unsplash.com/photo-1544025162-d76694265947?w=800",
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800",
    "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800",
    "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800"
  ]

  return (
    <section ref={containerRef} className="relative h-[300vh]">
      {/* Sticky container */}
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
          <span className="text-sm tracking-[0.5em] text-luxuryGold-300 uppercase mb-4 block">
            Visual Journey
          </span>
          <h2 className="text-5xl md:text-7xl font-extralight mb-4">Gallery</h2>
          <p className="text-lg md:text-xl font-extralight text-gray-300 max-w-2xl mx-auto">
            A glimpse into our world of culinary excellence
          </p>
        </div>

        {/* Horizontal scrolling gallery */}
        <motion.div
          style={{ x }}
          className="flex gap-8 px-6"
        >
          {images.map((img, i) => (
            <div
              key={i}
              className="relative w-[350px] md:w-[450px] h-[400px] md:h-[500px] rounded-2xl overflow-hidden flex-shrink-0 group"
            >
              <img
                src={img}
                alt={`Gallery ${i + 1}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="text-sm tracking-[0.3em] text-luxuryGold-400 mb-2">0{i + 1}</div>
                <div className="text-xl font-light text-white">Culinary Artistry</div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Progress indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3">
          <span className="text-xs text-gray-400 tracking-widest uppercase">Scroll</span>
          <div className="w-24 h-1 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              style={{ scaleX: scrollYProgress }}
              className="h-full bg-luxuryGold-400 origin-left"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

const Testimonials = () => {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  const testimonials = [
    {
      text: "An absolutely transcendent dining experience. Every course was a masterpiece of flavor and presentation.",
      author: "James Mitchell",
      role: "Food Critic, NY Times"
    },
    {
      text: "The attention to detail is unparalleled. This is what fine dining should be.",
      author: "Sarah Chen",
      role: "Michelin Guide"
    },
    {
      text: "A symphony for the senses. From the moment you enter, you know you're in for something extraordinary.",
      author: "Marco Bellini",
      role: "Celebrity Chef"
    }
  ]

  // One testimonial fades in, then out, then the next
  const opacity1 = useTransform(scrollYProgress, [0, 0.1, 0.25, 0.33], [0, 1, 1, 0])
  const opacity2 = useTransform(scrollYProgress, [0.33, 0.43, 0.58, 0.66], [0, 1, 1, 0])
  const opacity3 = useTransform(scrollYProgress, [0.66, 0.76, 0.9, 1], [0, 1, 1, 0])

  const opacities = [opacity1, opacity2, opacity3]

  return (
    <section ref={containerRef} className="relative h-[300vh]">
      <div className="sticky top-0 h-screen flex flex-col justify-center items-center overflow-hidden">
        {/* Header */}
        <div className="text-center mb-16 px-6">
          <span className="text-sm tracking-[0.5em] text-luxuryGold-300 uppercase mb-4 block">
            What They Say
          </span>
          <h2 className="text-4xl md:text-5xl font-extralight">
            Trusted by <span className="text-luxuryGold-300">10,000+</span> Diners
          </h2>
        </div>

        {/* Testimonials - stacked, one visible at a time */}
        <div className="relative w-full max-w-4xl mx-auto px-6 h-64">
          {testimonials.map((item, i) => (
            <motion.div
              key={i}
              style={{ opacity: opacities[i] }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center"
            >
              {/* Quote */}
              <p className="text-2xl md:text-4xl font-extralight text-white leading-relaxed italic mb-8">
                "{item.text}"
              </p>

              {/* Author */}
              <div>
                <div className="text-lg font-light text-luxuryGold-400">{item.author}</div>
                <div className="text-sm text-gray-400 tracking-wider">{item.role}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Progress indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-4">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              style={{ opacity: useTransform(opacities[i], [0, 1], [0.3, 1]) }}
              className="w-2 h-2 rounded-full bg-luxuryGold-400"
            />
          ))}
        </div>
      </div>
    </section>
  )
}

const CTA = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <section className="py-40 relative overflow-hidden">
      {/* Animated Gradient Background */}
      <motion.div
        animate={{
          background: [
            "radial-gradient(ellipse at 50% 50%, rgba(255,204,51,0.1) 0%, transparent 50%)",
            "radial-gradient(ellipse at 30% 70%, rgba(255,204,51,0.1) 0%, transparent 50%)",
            "radial-gradient(ellipse at 70% 30%, rgba(255,204,51,0.1) 0%, transparent 50%)",
            "radial-gradient(ellipse at 50% 50%, rgba(255,204,51,0.1) 0%, transparent 50%)",
          ]
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute inset-0"
      />

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1 }}
          className="p-16 rounded-3xl bg-gradient-to-b from-white/5 to-transparent border border-white/10 backdrop-blur-sm"
        >
          <TextReveal>
            <h2 className="text-4xl md:text-6xl font-extralight mb-6">
              Your Food Deserves
            </h2>
          </TextReveal>
          <TextReveal delay={0.1}>
            <h2 className="text-4xl md:text-6xl font-light mb-8">
              <span className="italic text-luxuryGold-300">A Better Website</span>
            </h2>
          </TextReveal>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4 }}
            className="text-xl font-extralight text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Most restaurant websites lose customers before they even see the menu.
            This design fixes that. Upgrade to a website that matches your culinary excellence.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-6 justify-center"
          >
            <MagneticButton
              className="px-12 py-5 bg-luxuryGold-400 text-luxuryGreen-900 text-sm tracking-[0.2em] font-medium transition-all duration-500 hover:bg-luxuryGold-300 cursor-hover rounded-full"
            >
              UPGRADE YOUR WEBSITE
            </MagneticButton>
            <MagneticButton
              className="px-12 py-5 border border-white/30 text-white text-sm tracking-[0.2em] font-light transition-all duration-500 hover:bg-white hover:text-luxuryGreen-900 cursor-hover rounded-full"
            >
              GET A FREE DEMO
            </MagneticButton>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

const Contact = ({ onReserveClick }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <section id="contact" className="py-40 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <span className="text-sm tracking-[0.5em] text-luxuryGold-300 uppercase mb-8 block">
            Reserve Your Table
          </span>
          <TextReveal>
            <h2 className="text-5xl md:text-7xl font-extralight mb-8">Welcome</h2>
          </TextReveal>
          <p className="text-xl font-extralight text-gray-300">
            Reserve your table for an unforgettable culinary experience
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
          className="rounded-3xl bg-gradient-to-b from-white/5 to-transparent border border-white/10 p-12 mb-12 backdrop-blur-sm"
        >
          <div className="grid md:grid-cols-2 gap-12 mb-8">
            <div>
              <h3 className="text-sm tracking-[0.3em] text-luxuryGold-400 mb-8">HOURS</h3>
              <div className="space-y-4 font-extralight">
                {["Thursday", "Friday", "Saturday"].map((day, i) => (
                  <motion.div
                    key={day}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="flex justify-between items-center py-2 border-b border-white/5"
                  >
                    <span>{day}</span>
                    <span className="text-gray-400">6:00 PM – Late</span>
                  </motion.div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm tracking-[0.3em] text-luxuryGold-400 mb-8">CONTACT</h3>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.5 }}
                className="space-y-3 font-extralight text-gray-300"
              >
                <p>123 Gourmet Street</p>
                <p>New York, NY 10001</p>
                <p>United States</p>
                <p className="mt-6 text-luxuryGold-400">+1 (555) 123-4567</p>
                <p className="text-luxuryGold-400">info@finedining.com</p>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <MagneticButton
            onClick={onReserveClick}
            className="px-20 py-6 bg-luxuryGold-400 text-luxuryGreen-900 text-sm tracking-[0.2em] font-medium transition-all duration-500 hover:bg-luxuryGold-300 rounded-full"
          >
            RESERVE NOW
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  )
}

const Footer = () => {
  const socialLinks = ["Instagram", "Facebook", "Twitter"]

  return (
    <footer className="py-16 bg-luxuryGreen-900 border-t border-luxuryGold-400/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          <div>
            <div className="text-2xl font-light tracking-[0.2em] mb-6">
              <span className="text-luxuryGold-300">FINE</span> DINING HAVEN
            </div>
            <p className="text-gray-400 font-extralight">
              Where culinary artistry meets unforgettable experiences.
            </p>
          </div>

          <div className="text-center">
            <h4 className="text-sm tracking-[0.3em] text-luxuryGold-400 mb-6">FOLLOW US</h4>
            <div className="flex justify-center gap-6">
              {socialLinks.map((social, i) => (
                <motion.a
                  key={social}
                  href="#"
                  whileHover={{ y: -5, color: "#ffd666" }}
                  className="text-gray-400 hover:text-luxuryGold-400 transition-colors cursor-hover tracking-wider text-sm"
                >
                  {social}
                </motion.a>
              ))}
            </div>
          </div>

          <div className="text-right">
            <h4 className="text-sm tracking-[0.3em] text-luxuryGold-400 mb-6">LOCATION</h4>
            <p className="text-gray-400 font-extralight">
              123 Gourmet Street<br />
              New York, NY 10001
            </p>
          </div>
        </div>

        <motion.div
          className="h-px bg-gradient-to-r from-transparent via-luxuryGold-400/30 to-transparent mb-8"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 1 }}
        />

        <div className="text-center text-sm tracking-[0.2em] font-extralight text-gray-500">
          <p>© 2026 FINE DINING HAVEN · All rights reserved</p>
          <p className="mt-2 text-xs text-luxuryGold-400/50">
            Designed with ❤️ for culinary excellence
          </p>
        </div>
      </div>
    </footer>
  )
}
