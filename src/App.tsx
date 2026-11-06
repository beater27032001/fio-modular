import { MotionConfig } from 'motion/react'
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
    </MotionConfig>
  )
}
