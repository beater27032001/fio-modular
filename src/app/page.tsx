import { MotionProvider } from '@/providers/MotionProvider'
import { Buy } from '@/components/organisms/Buy'
import { Features } from '@/components/organisms/Features'
import { Footer } from '@/components/organisms/Footer'
import { Header } from '@/components/organisms/Header'
import { Hero } from '@/components/organisms/Hero'
import { Rack } from '@/components/organisms/Rack'

export default function Home() {
  return (
    <MotionProvider>
      <div className="wrap">
        <Header />
        <Hero />
        <Rack />
      </div>
      <section className="mt-[70px] rack:mt-28 border-t border-rail py-16 sm:py-20">
        <div className="wrap">
          <Features />
          <Buy />
        </div>
      </section>
      <Footer />
    </MotionProvider>
  )
}
