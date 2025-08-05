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

// ... existing code ...

export function Avatar(props) {
  const { scene } = useGLTF('/avatar.glb')
  const { mouse } = useThree()  // Assuming useThree is imported; add if not
  const headBone = useRef()  // Existing ref for head
  const leftEyeBone = useRef()  // Existing ref for LeftEye
  const rightEyeBone = useRef()  // Existing ref for RightEye
  const headMesh = useRef()  // New ref for head mesh with morph targets

  // Traverse to find bones, meshes, and hide non-head parts
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
      } else if (child.isMesh) {

        // Find head mesh with morph targets (adjust name/condition based on your model)
        if (child.morphTargetDictionary && child.name.includes('Head')) {  // e.g., if mesh is 'HeadMesh'
          headMesh.current = child
          console.log('Morph targets found:', Object.keys(child.morphTargetDictionary))  // Log to identify mouth target
        }
      }
    })
  }, [scene])

  // New function to simulate talking: Oscillates mouth morph target (assumes target named 'mouthOpen'; replace with actual from logs)
  const simulateTalking = () => {
    if (headMesh.current && headMesh.current.morphTargetInfluences) {
      const mouthIndex = headMesh.current.morphTargetDictionary['mouthOpen']  // Replace 'mouthOpen' with actual target name
      if (mouthIndex !== undefined) {
        // Simple oscillation for talking simulation (0 to 1 influence)
        headMesh.current.morphTargetInfluences[mouthIndex] = Math.abs(Math.sin(Date.now() * 0.005))  // Adjust speed with multiplier
      }
    }
  }

  useFrame(() => {
    // Call the talking simulation every frame (remove if you want to trigger conditionally)
    // simulateTalking()

    // Existing head rotation
    if (headBone.current) {
      headBone.current.rotation.y = mouse.x * Math.PI / 4
      // Optional: headBone.current.rotation.x = -mouse.y * Math.PI / 6
    }

    // Existing eye rotations
    if (leftEyeBone.current) {
      leftEyeBone.current.rotation.y = mouse.x * Math.PI / 6
      leftEyeBone.current.rotation.x = -mouse.y * Math.PI / 8
    }
    if (rightEyeBone.current) {
      rightEyeBone.current.rotation.y = mouse.x * Math.PI / 6
      rightEyeBone.current.rotation.x = -mouse.y * Math.PI / 8
    }
  })

  return <primitive object={scene} {...props} />
}

// ... existing code ...