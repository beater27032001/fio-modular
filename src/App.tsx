import { MotionConfig } from 'motion/react'
import { Header } from '@/components/organisms/Header'
import { Hero } from '@/components/organisms/Hero'

export function App() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="wrap">
        <Header />
        <Hero />
      </div>
    </MotionConfig>
  )
}
