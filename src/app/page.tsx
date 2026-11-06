import { Buy } from '@organisms/Buy'
import { Features } from '@organisms/Features'
import { Footer } from '@organisms/Footer'
import { Header } from '@organisms/Header'
import { Hero } from '@organisms/Hero'
import { Rack } from '@organisms/Rack'
import { MotionProvider } from '@providers/MotionProvider'

export default function Home() {
  return (
    <MotionProvider>
      <div className="wrap">
        <Header />
        <Hero />
        <Rack />
      </div>
      <section className="mt-[70px] border-t border-rail py-16 rack:mt-28 sm:py-20">
        <div className="wrap">
          <Features />
          <Buy />
        </div>
      </section>
      <Footer />
    </MotionProvider>
  )
}
