import { useEffect, useLayoutEffect, useState } from 'react'
import './LoadingScreen.css'

// Module memory survives internal navigation, but resets on a full reload.
let introCompleted = false

export default function LoadingScreen({ children }) {
  const [visible, setVisible] = useState(() => !introCompleted)
  const [leaving, setLeaving] = useState(false)

  useLayoutEffect(() => {
    if (visible) window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [visible])

  useEffect(() => {
    if (!visible) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const fadeTimer = window.setTimeout(() => setLeaving(true), 1700)
    const finishTimer = window.setTimeout(() => {
      // Reset while the overlay still covers HOME, before releasing interaction.
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      introCompleted = true
      setVisible(false)
    }, 2000)

    return () => {
      window.clearTimeout(fadeTimer)
      window.clearTimeout(finishTimer)
      document.body.style.overflow = previousOverflow
    }
  }, [visible])

  return (
    <>
      <div inert={visible} aria-hidden={visible ? true : undefined}>
        {children}
      </div>
      {visible && (
        <div className={`brand-intro${leaving ? ' brand-intro--leaving' : ''}`}>
          <div className="brand-intro__content" role="status" aria-live="polite">
            <svg className="brand-intro__hat" viewBox="0 0 160 130" fill="none" aria-hidden="true">
              <g stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
                <path fill="#fffdf9" d="M43 89C12 91 12 47 43 48c7-29 47-29 54 0 31-7 39 39 7 41v24H43V89Z" />
                <path d="M44 96q30-8 59 0M130 48l12-2M123 32l10-10M110 20l5-13" />
              </g>
              <path fill="currentColor" d="M73 66c-13-17-25 4 0 19 25-15 13-36 0-19Z" />
            </svg>
            <div className="brand-intro__title">
              <span className="brand-intro__heart brand-intro__heart--left" aria-hidden="true">♡</span>
              <h1 className="brand-intro__logo">MELLOW BAKE</h1>
              <span className="brand-intro__heart brand-intro__heart--right" aria-hidden="true">♡</span>
            </div>
            <p className="brand-intro__message">달콤한 순간을 준비하고 있어요...</p>
            <div className="brand-intro__track" aria-hidden="true">
              <div className="brand-intro__fill"><div className="brand-intro__stripes" /></div>
            </div>
            <p className="brand-intro__label" aria-hidden="true">
              LOADING<span className="brand-intro__dots"><i>.</i><i>.</i><i>.</i></span>
            </p>
          </div>
        </div>
      )}
    </>
  )
}

