import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function Stars({ count = 2000 }: { count?: number }) {
    const mesh = useRef<THREE.Points>(null)
    const mouseRef = useRef({ x: 0, y: 0 })

    const [positions, sizes] = useMemo(() => {
        const pos = new Float32Array(count * 3)
        const sz = new Float32Array(count)
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 50
            pos[i * 3 + 1] = (Math.random() - 0.5) * 50
            pos[i * 3 + 2] = (Math.random() - 0.5) * 50
            sz[i] = Math.random() * 2 + 0.5
        }
        return [pos, sz]
    }, [count])

    useFrame((state) => {
        if (!mesh.current) return
        mesh.current.rotation.x += 0.0002
        mesh.current.rotation.y += 0.0003
        const t = state.clock.getElapsedTime()
        mesh.current.rotation.z = Math.sin(t * 0.1) * 0.02

        // Mouse interaction
        const { pointer } = state
        mouseRef.current.x += (pointer.x * 0.3 - mouseRef.current.x) * 0.02
        mouseRef.current.y += (pointer.y * 0.3 - mouseRef.current.y) * 0.02
        mesh.current.position.x = mouseRef.current.x
        mesh.current.position.y = mouseRef.current.y
    })

    return (
        <points ref={mesh}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[positions, 3]}
                />
                <bufferAttribute
                    attach="attributes-size"
                    args={[sizes, 1]}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.08}
                color="#E8F4FF"
                transparent
                opacity={0.8}
                sizeAttenuation
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </points>
    )
}

function SiriusSystem() {
    const groupRef = useRef<THREE.Group>(null)
    const siriusA = useRef<THREE.Mesh>(null)
    const siriusB = useRef<THREE.Mesh>(null)

    useFrame((state) => {
        const t = state.clock.getElapsedTime()
        if (groupRef.current) {
            groupRef.current.rotation.y = t * 0.1
        }
        if (siriusA.current) {
            siriusA.current.position.x = Math.cos(t * 0.3) * 2
            siriusA.current.position.z = Math.sin(t * 0.3) * 2
        }
        if (siriusB.current) {
            siriusB.current.position.x = Math.cos(t * 0.3 + Math.PI) * 1.2
            siriusB.current.position.z = Math.sin(t * 0.3 + Math.PI) * 1.2
        }
    })

    return (
        <group ref={groupRef}>
            <mesh ref={siriusA}>
                <sphereGeometry args={[0.15, 16, 16]} />
                <meshBasicMaterial color="#4A9EFF" />
            </mesh>
            <pointLight position={[0, 0, 0]} color="#4A9EFF" intensity={2} distance={10} />
            <mesh ref={siriusB}>
                <sphereGeometry args={[0.06, 16, 16]} />
                <meshBasicMaterial color="#FFD700" />
            </mesh>
            <pointLight position={[0, 0, 0]} color="#FFD700" intensity={1} distance={5} />
        </group>
    )
}

export default function ParticleBackground() {
    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 0,
                pointerEvents: 'none',
            }}
        >
            <Canvas
                camera={{ position: [0, 0, 15], fov: 60 }}
                style={{ background: 'transparent' }}
                dpr={[1, 1.5]}
                gl={{ antialias: false, alpha: true }}
            >
                <Stars count={2000} />
                <SiriusSystem />
                <ambientLight intensity={0.1} />
            </Canvas>
        </div>
    )
}
