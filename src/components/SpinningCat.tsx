import { useGLTF, useAnimations } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef, useEffect, useState } from 'react'
import * as THREE from 'three'

export function SpinningCat() {
  const catRef = useRef<THREE.Group>(null)
  const [animationSpeed, setAnimationSpeed] = useState(0)
  const scrollTimeoutRef = useRef<number>(0)
  const lastScrollTimeRef = useRef<number>(0)
  const { scene, animations } = useGLTF('/src/assets/oiiaioooooiai_cat.glb')
  const { actions } = useAnimations(animations, catRef)

  useEffect(() => {
    const handleScroll = (event: WheelEvent) => {
      const currentTime = Date.now()
      const timeSinceLastScroll = currentTime - lastScrollTimeRef.current
      lastScrollTimeRef.current = currentTime

      // 直接使用滾動速度
      const speed = event.deltaY * 0.01
      setAnimationSpeed(speed)

      // 清除之前的計時器
      if (scrollTimeoutRef.current) {
        window.clearTimeout(scrollTimeoutRef.current)
      }

      // 設置停止動畫的計時器，但只在停止滾動後才觸發
      if (timeSinceLastScroll > 100) { // 如果距離上次滾動超過100ms，才設置停止計時器
        scrollTimeoutRef.current = window.setTimeout(() => {
          setAnimationSpeed(0)
        }, 1500)
      }
    }

    window.addEventListener('wheel', handleScroll)
    
    return () => {
      window.removeEventListener('wheel', handleScroll)
      if (scrollTimeoutRef.current) {
        window.clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [])

  useFrame((state, delta) => {
    if (actions && Object.keys(actions).length > 0) {
      const firstAction = Object.values(actions)[0]
      if (firstAction) {
        firstAction.timeScale = animationSpeed
        if (animationSpeed !== 0) {
          firstAction.play()
        } else {
          firstAction.stop()
        }
      }
    }
  })

  return (
    <primitive 
      ref={catRef}
      object={scene}
      scale={4}
      position={[0, 0, 0]}
    />
  )
}

// 預加載模型
useGLTF.preload('/src/assets/oiiaioooooiai_cat.glb')