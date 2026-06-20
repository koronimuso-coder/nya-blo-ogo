import { useCallback, useRef } from 'react'

export function useAudioFX() {
    const audioCtxRef = useRef<AudioContext | null>(null)

    const getAudioContext = (): AudioContext => {
        if (!audioCtxRef.current) {
            audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
        }
        // Resume if suspended (browser security autoplay policies)
        if (audioCtxRef.current.state === 'suspended') {
            audioCtxRef.current.resume()
        }
        return audioCtxRef.current
    }

    const getVolume = (): number => {
        const savedVol = localStorage.getItem('nya-audio-volume')
        if (savedVol) {
            return parseInt(savedVol) / 100
        }
        return 0.8
    }

    const playClick = useCallback(() => {
        try {
            const ctx = getAudioContext()
            const vol = getVolume()
            const now = ctx.currentTime

            const osc = ctx.createOscillator()
            const gain = ctx.createGain()

            osc.type = 'triangle'
            osc.frequency.setValueAtTime(1200, now)
            osc.frequency.exponentialRampToValueAtTime(150, now + 0.08)

            gain.gain.setValueAtTime(vol * 0.15, now)
            gain.gain.linearRampToValueAtTime(0, now + 0.08)

            osc.connect(gain)
            gain.connect(ctx.destination)

            osc.start(now)
            osc.stop(now + 0.09)
        } catch (e) {
            // Audio context failed or not supported
        }
    }, [])

    const playCoin = useCallback(() => {
        try {
            const ctx = getAudioContext()
            const vol = getVolume()
            const now = ctx.currentTime

            // Play a metallic bell chime (similar to two overlapping high sine waves)
            const playTone = (freq: number, delay: number, volumeCoeff: number) => {
                const osc = ctx.createOscillator()
                const gain = ctx.createGain()

                osc.type = 'sine'
                osc.frequency.setValueAtTime(freq, now + delay)

                gain.gain.setValueAtTime(0, now + delay)
                gain.gain.linearRampToValueAtTime(vol * 0.25 * volumeCoeff, now + delay + 0.02)
                gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.3)

                osc.connect(gain)
                gain.connect(ctx.destination)

                osc.start(now + delay)
                osc.stop(now + delay + 0.35)
            }

            // High double tone
            playTone(987.77, 0, 1.0) // B5
            playTone(1318.51, 0.06, 0.8) // E6
        } catch (e) {
            // Silence
        }
    }, [])

    const playChime = useCallback(() => {
        try {
            const ctx = getAudioContext()
            const vol = getVolume()
            const now = ctx.currentTime

            // Play a rising pentatonic arpeggio (C5 - D5 - E5 - G5 - A5) representing an initiation chord
            const notes = [523.25, 587.33, 659.25, 783.99, 880.00]
            notes.forEach((freq, idx) => {
                const osc = ctx.createOscillator()
                const gain = ctx.createGain()

                osc.type = 'sine'
                osc.frequency.setValueAtTime(freq, now + idx * 0.08)

                gain.gain.setValueAtTime(0, now + idx * 0.08)
                gain.gain.linearRampToValueAtTime(vol * 0.15, now + idx * 0.08 + 0.02)
                gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.4)

                osc.connect(gain)
                gain.connect(ctx.destination)

                osc.start(now + idx * 0.08)
                osc.stop(now + idx * 0.08 + 0.45)
            })
        } catch (e) {
            // Silence
        }
    }, [])

    const playRipple = useCallback(() => {
        try {
            const ctx = getAudioContext()
            const vol = getVolume()
            const now = ctx.currentTime

            const osc = ctx.createOscillator()
            const gain = ctx.createGain()
            const lpFilter = ctx.createBiquadFilter()

            osc.type = 'sine'
            // Water drop pitch sweep: fast rise then fall
            osc.frequency.setValueAtTime(150, now)
            osc.frequency.exponentialRampToValueAtTime(450, now + 0.1)
            osc.frequency.exponentialRampToValueAtTime(100, now + 0.4)

            lpFilter.type = 'lowpass'
            lpFilter.frequency.setValueAtTime(800, now)

            gain.gain.setValueAtTime(vol * 0.25, now)
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5)

            osc.connect(lpFilter)
            lpFilter.connect(gain)
            gain.connect(ctx.destination)

            osc.start(now)
            osc.stop(now + 0.55)
        } catch (e) {
            // Silence
        }
    }, [])

    const playEngine = useCallback(() => {
        try {
            const ctx = getAudioContext()
            const vol = getVolume()
            const now = ctx.currentTime

            // Short blast of bandpassed noise for space engine / rocket thrust
            const bufferSize = ctx.sampleRate * 0.15
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
            const data = buffer.getChannelData(0)
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1
            }

            const noiseNode = ctx.createBufferSource()
            noiseNode.buffer = buffer

            const filter = ctx.createBiquadFilter()
            filter.type = 'bandpass'
            filter.frequency.setValueAtTime(180, now)
            filter.frequency.exponentialRampToValueAtTime(100, now + 0.15)
            filter.Q.value = 8.0

            const gain = ctx.createGain()
            gain.gain.setValueAtTime(vol * 0.12, now)
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15)

            noiseNode.connect(filter)
            filter.connect(gain)
            gain.connect(ctx.destination)

            noiseNode.start(now)
            noiseNode.stop(now + 0.16)
        } catch (e) {
            // Silence
        }
    }, [])

    return { playClick, playCoin, playChime, playRipple, playEngine }
}
