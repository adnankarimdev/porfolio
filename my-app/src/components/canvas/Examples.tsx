'use client'

import { Line, MeshDistortMaterial, useCursor, useGLTF } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

export const Blob = ({ route = '/', ...props }) => {
  const router = useRouter()
  const [hovered, hover] = useState(false)
  useCursor(hovered)
  return (
    <mesh
      onClick={() => router.push(route)}
      onPointerOver={() => hover(true)}
      onPointerOut={() => hover(false)}
      {...props}>
      <sphereGeometry args={[1, 64, 64]} />
      <MeshDistortMaterial roughness={0.5} color={hovered ? 'hotpink' : '#1fb2f5'} />
    </mesh>
  )
}

export const Logo = ({ route = '/blob', ...props }) => {
  const mesh = useRef(null)
  const router = useRouter()

  const [hovered, hover] = useState(false)
  const points = useMemo(() => new THREE.EllipseCurve(0, 0, 3, 1.15, 0, 2 * Math.PI, false, 0).getPoints(100), [])

  useCursor(hovered)
  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime()
    mesh.current.rotation.y = Math.sin(t) * (Math.PI / 8)
    mesh.current.rotation.x = Math.cos(t) * (Math.PI / 8)
    mesh.current.rotation.z -= delta / 4
  })

  return (
    <group ref={mesh} {...props}>
      {/* @ts-ignore */}
      <Line worldUnits points={points} color='#1fb2f5' lineWidth={0.15} />
      {/* @ts-ignore */}
      <Line worldUnits points={points} color='#1fb2f5' lineWidth={0.15} rotation={[0, 0, 1]} />
      {/* @ts-ignore */}
      <Line worldUnits points={points} color='#1fb2f5' lineWidth={0.15} rotation={[0, 0, -1]} />
      <mesh onClick={() => router.push(route)} onPointerOver={() => hover(true)} onPointerOut={() => hover(false)}>
        <sphereGeometry args={[0.55, 64, 64]} />
        <meshPhysicalMaterial roughness={0.5} color={hovered ? 'hotpink' : '#1fb2f5'} />
      </mesh>
    </group>
  )
}

export function Duck(props) {
  const { scene } = useGLTF('/duck.glb')

  useFrame((state, delta) => (scene.rotation.y += delta))

  return <primitive object={scene} {...props} />
}
export function Dog(props) {
  const { scene } = useGLTF('/avatar.glb')

  return <primitive object={scene} {...props} />
}

// ... existing code ...

// ... existing code ...

export function Avatar(props) {
  const { scene } = useGLTF('/avatar.glb')
  const { mouse } = useThree()  // Assuming useThree is imported; add if not
  const headBone = useRef()  // Existing ref for head
  const leftEyeBone = useRef()  // New ref for LeftEye
  const rightEyeBone = useRef()  // New ref for RightEye

  // Traverse to find the head and eye bones
  useEffect(() => {
    scene.traverse((child) => {
      if (child.isBone) {
        if (child.name === 'Head') {
          headBone.current = child
        } else if (child.name === 'LeftEye') {
          leftEyeBone.current = child
        } else if (child.name === 'RightEye') {
          rightEyeBone.current = child
        }
      }
    })
  }, [scene])

  useFrame(() => {
    // Existing head rotation
    if (headBone.current) {
      headBone.current.rotation.y = mouse.x * Math.PI / 4
      headBone.current.rotation.x = -mouse.y * Math.PI / 6
    }

    // Eye rotations: Apply similar yaw/pitch to make them "follow" the mouse
    // Adjust multipliers for sensitivity; eyes usually have smaller range
    if (leftEyeBone.current) {
      leftEyeBone.current.rotation.y = mouse.x * Math.PI / 6  // Yaw (left/right)
      leftEyeBone.current.rotation.x = -mouse.y * Math.PI / 8  // Pitch (up/down); adjust sign if needed
    }
    if (rightEyeBone.current) {
      rightEyeBone.current.rotation.y = mouse.x * Math.PI / 6  // Yaw (left/right)
      rightEyeBone.current.rotation.x = -mouse.y * Math.PI / 8  // Pitch (up/down); adjust sign if needed
    }
  })

  return <primitive object={scene} {...props} />
}

// ... existing code ...

// ... existing code ...

// ... existing code ...


// ... existing code (skip to Avatar function) ...



// ... existing code ...