import { MotionConfig } from 'motion/react'
import { Buy } from '@/components/organisms/Buy'
import { Features } from '@/components/organisms/Features'
import { Footer } from '@/components/organisms/Footer'
import { Header } from '@/components/organisms/Header'
import { Hero } from '@/components/organisms/Hero'
import { Rack } from '@/components/organisms/Rack'

export function App() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="wrap">
        <Header />
        <Hero />
        <Rack />
      </div>
      <section className="mt-[70px] border-t border-rail py-16 sm:py-20">
        <div className="wrap">
          <Features />
          <Buy />
        </div>
      </section>
      <Footer />
    </MotionConfig>
  )
}
