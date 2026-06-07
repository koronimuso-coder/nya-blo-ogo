import { Component } from 'react'
import type { ReactNode, ErrorInfo } from 'react'

interface Props {
    children: ReactNode
}

interface State {
    hasError: boolean
    error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = { hasError: false, error: null }
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('[NYA BLO] Erreur capturée:', error, errorInfo)
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                    textAlign: 'center',
                    padding: '40px 24px',
                    fontFamily: 'var(--font-body)',
                }}>
                    <div style={{
                        fontSize: '4rem',
                        marginBottom: 24,
                        animation: 'pulse 2s ease-in-out infinite',
                    }}>✦</div>
                    <h2 style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                        fontWeight: 900,
                        marginBottom: 16,
                        letterSpacing: '-0.02em',
                    }}>
                        PERTURBATION DU NEXUS
                    </h2>
                    <p style={{
                        color: 'var(--text-muted)',
                        fontSize: '1rem',
                        maxWidth: 480,
                        lineHeight: 1.6,
                        marginBottom: 32,
                    }}>
                        Une anomalie a été détectée dans la matrice Sirius. Nos scribes travaillent à la résolution.
                    </p>
                    <p style={{
                        color: 'var(--nya-ochre)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        letterSpacing: '0.15em',
                        marginBottom: 32,
                        opacity: 0.6,
                    }}>
                        {this.state.error?.message || 'ERREUR INCONNUE'}
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            padding: '16px 40px',
                            borderRadius: 'var(--radius-pill, 50px)',
                            background: 'linear-gradient(135deg, #B85C2E, #8B4522)',
                            color: '#FFFFFF',
                            border: 'none',
                            fontFamily: 'var(--font-body)',
                            fontSize: '0.8rem',
                            fontWeight: 800,
                            letterSpacing: '0.12em',
                            cursor: 'pointer',
                            boxShadow: '0 8px 30px rgba(184,92,46,0.3)',
                        }}
                    >
                        RÉINITIALISER LE NEXUS
                    </button>
                </div>
            )
        }

        return this.props.children
    }
}
