import { MotionConfig } from 'motion/react'

export function App() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="wrap" />
    </MotionConfig>
  )
}
