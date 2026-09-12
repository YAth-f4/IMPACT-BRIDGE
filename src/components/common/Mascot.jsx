import React from 'react';

/**
 * BRIDGIE — Official Mascot of IMPACT BRIDGE
 * 
 * Represents community, helping, connection, hope, and positive impact.
 * Clean, modern Neo-Brutalist vector character with 3px black stroke,
 * integrated bridge arch, and expressive states.
 * 
 * Variants:
 * - 'logo': Compact icon badge for header, branding, and favicons
 * - 'waving': Friendly greeting wave for homepage hero and dashboard
 * - 'builder': Connecting bridge pieces for loading animation
 * - 'celebrating': Both hands raised with heart for donations and achievements
 * - 'curious': Holding compass/magnifying glass for 404 and empty states
 */
export default function Mascot({
  variant = 'waving',
  size = 64,
  className = '',
  style = {},
  animate = true
}) {
  const isMini = size <= 40;

  return (
    <div
      className={`mascot-container ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: `${size}px`,
        height: `${size}px`,
        position: 'relative',
        userSelect: 'none',
        flexShrink: 0,
        ...style
      }}
      role="img"
      aria-label="Impact Bridge Mascot — Bridgie"
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          width: '100%',
          height: '100%',
          overflow: 'visible'
        }}
      >
        <defs>
          <filter id="mascot-shadow" x="-10%" y="-10%" width="130%" height="130%">
            <feDropShadow dx="3" dy="3" stdDeviation="0" floodColor="#000000" />
          </filter>
        </defs>

        {/* 1. FOUNDATION PILLARS (The 2 shores of the bridge) */}
        <g id="pillars">
          {/* Left Pillar */}
          <rect
            x="8"
            y="70"
            width="14"
            height="22"
            rx="2"
            fill="#2E7D5B"
            stroke="#000000"
            strokeWidth="3"
          />
          <line x1="12" y1="77" x2="18" y2="77" stroke="#000000" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="12" y1="84" x2="18" y2="84" stroke="#000000" strokeWidth="2.5" strokeLinecap="round" />

          {/* Right Pillar */}
          <rect
            x="78"
            y="70"
            width="14"
            height="22"
            rx="2"
            fill="#2E7D5B"
            stroke="#000000"
            strokeWidth="3"
          />
          <line x1="82" y1="77" x2="88" y2="77" stroke="#000000" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="82" y1="84" x2="88" y2="84" stroke="#000000" strokeWidth="2.5" strokeLinecap="round" />
        </g>

        {/* 2. THE BRIDGE DECK & ARCH */}
        <g id="bridge-arch">
          {/* Bridge Roadway Deck */}
          <rect
            x="6"
            y="66"
            width="88"
            height="8"
            rx="3"
            fill="#F4B942"
            stroke="#000000"
            strokeWidth="3"
          />
          {/* Deck stripes */}
          <line x1="18" y1="70" x2="26" y2="70" stroke="#000000" strokeWidth="2" strokeLinecap="round" />
          <line x1="74" y1="70" x2="82" y2="70" stroke="#000000" strokeWidth="2" strokeLinecap="round" />

          {/* Suspension Arch Under Deck */}
          <path
            d="M 12 74 Q 50 48 88 74"
            stroke="#2E7D5B"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
          {/* Vertical Support Cables */}
          <line x1="30" y1="67" x2="30" y2="60" stroke="#000000" strokeWidth="2" />
          <line x1="70" y1="67" x2="70" y2="60" stroke="#000000" strokeWidth="2" />
        </g>

        {/* 3. BRIDGIE'S BODY (Friendly, curved, bouncy creature) */}
        <g id="bridgie-body" className={animate ? 'bridgie-bob' : ''}>
          {/* Feet */}
          <ellipse cx="40" cy="67" rx="6" ry="4" fill="#2E7D5B" stroke="#000000" strokeWidth="2.5" />
          <ellipse cx="60" cy="67" rx="6" ry="4" fill="#2E7D5B" stroke="#000000" strokeWidth="2.5" />

          {/* Main Body (Warm Off-white & Yellow combo) */}
          <rect
            x="30"
            y="24"
            width="40"
            height="42"
            rx="18"
            fill="#F7FAF8"
            stroke="#000000"
            strokeWidth="3.5"
          />

          {/* Belly Badge Patch */}
          <path
            d="M 36 38 Q 50 34 64 38 C 64 52 58 58 50 58 C 42 58 36 52 36 38 Z"
            fill="#A8D5BA"
            stroke="#000000"
            strokeWidth="2"
          />

          {/* Golden Heart on Chest (Represents Care & Impact) */}
          <path
            d="M 50 49 C 48 45 44 45 44 48 C 44 51 50 54 50 55 C 50 54 56 51 56 48 C 56 45 52 45 50 49 Z"
            fill="#E63946"
            stroke="#000000"
            strokeWidth="1.5"
          />

          {/* Builder / Volunteer Cap with Bridge Arch Symbol */}
          <path
            d="M 32 26 C 32 18 40 14 50 14 C 60 14 68 18 68 26 Z"
            fill="#2E7D5B"
            stroke="#000000"
            strokeWidth="3"
          />
          {/* Cap Visor */}
          <path
            d="M 28 26 C 36 24 64 24 72 26 C 70 29 30 29 28 26 Z"
            fill="#F4B942"
            stroke="#000000"
            strokeWidth="2.5"
          />
          {/* Cap Badge: Mini Bridge */}
          <circle cx="50" cy="20" r="3" fill="#F4B942" stroke="#000000" strokeWidth="1.5" />

          {/* Cute Face: Rosy Cheeks */}
          <circle cx="36" cy="38" r="3" fill="#F4B942" opacity="0.8" />
          <circle cx="64" cy="38" r="3" fill="#F4B942" opacity="0.8" />

          {/* Eyes */}
          <g id="eyes" className={animate ? 'bridgie-blink' : ''}>
            {/* Left Eye */}
            <circle cx="42" cy="33" r="3.5" fill="#000000" />
            <circle cx="43" cy="32" r="1.2" fill="#FFFFFF" />
            {/* Right Eye */}
            <circle cx="58" cy="33" r="3.5" fill="#000000" />
            <circle cx="59" cy="32" r="1.2" fill="#FFFFFF" />
          </g>

          {/* Mouth (Big warm smile) */}
          <path
            d="M 46 39 Q 50 43 54 39"
            stroke="#000000"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* 4. HANDS & GESTURES ACCORDING TO VARIANT */}
          {variant === 'waving' && (
            <>
              {/* Left Hand: resting happily */}
              <ellipse cx="26" cy="44" rx="4" ry="4" fill="#F4B942" stroke="#000000" strokeWidth="2.5" />
              {/* Right Hand: Waving High */}
              <g className={animate ? 'bridgie-wave' : ''} style={{ transformOrigin: '70px 42px' }}>
                <path
                  d="M 69 40 Q 77 34 78 27"
                  stroke="#000000"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <circle cx="78" cy="25" r="4.5" fill="#F4B942" stroke="#000000" strokeWidth="2.5" />
                {/* Wave sparkles */}
                <path d="M 83 20 L 86 17" stroke="#2E7D5B" strokeWidth="2" strokeLinecap="round" />
                <path d="M 86 24 L 90 24" stroke="#2E7D5B" strokeWidth="2" strokeLinecap="round" />
              </g>
            </>
          )}

          {variant === 'celebrating' && (
            <>
              {/* Both Hands Up High */}
              <g className={animate ? 'bridgie-cheer' : ''}>
                <path d="M 31 38 Q 22 30 21 21" stroke="#000000" strokeWidth="3.5" strokeLinecap="round" />
                <circle cx="20" cy="19" r="4.5" fill="#F4B942" stroke="#000000" strokeWidth="2.5" />
                <path d="M 69 38 Q 78 30 79 21" stroke="#000000" strokeWidth="3.5" strokeLinecap="round" />
                <circle cx="80" cy="19" r="4.5" fill="#F4B942" stroke="#000000" strokeWidth="2.5" />
                {/* Celebration confetti stars */}
                <circle cx="15" cy="12" r="2" fill="#F4B942" />
                <circle cx="85" cy="12" r="2" fill="#2E7D5B" />
                <circle cx="50" cy="6" r="2.5" fill="#E63946" />
              </g>
            </>
          )}

          {variant === 'builder' && (
            <>
              {/* Holding a glowing yellow bridge connector beam */}
              <rect
                x="20"
                y="42"
                width="60"
                height="6"
                rx="3"
                fill="#F4B942"
                stroke="#000000"
                strokeWidth="2.5"
                className={animate ? 'bridgie-pulse' : ''}
              />
              <circle cx="28" cy="44" r="4.5" fill="#2E7D5B" stroke="#000000" strokeWidth="2.5" />
              <circle cx="72" cy="44" r="4.5" fill="#2E7D5B" stroke="#000000" strokeWidth="2.5" />
            </>
          )}

          {variant === 'curious' && (
            <>
              {/* Left hand on hip */}
              <ellipse cx="26" cy="45" rx="4" ry="4" fill="#F4B942" stroke="#000000" strokeWidth="2.5" />
              {/* Right hand holding a compass / magnifying glass */}
              <path d="M 69 42 L 78 40" stroke="#000000" strokeWidth="3.5" strokeLinecap="round" />
              <line x1="77" y1="41" x2="84" y2="48" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
              <circle cx="83" cy="35" r="7" fill="#A8D5BA" stroke="#000000" strokeWidth="2.5" />
              <circle cx="83" cy="35" r="4" fill="#FFFFFF" stroke="#000000" strokeWidth="1.5" />
            </>
          )}

          {variant === 'logo' && (
            <>
              {/* Compact hands placed on bridge rail */}
              <ellipse cx="28" cy="45" rx="4" ry="3.5" fill="#F4B942" stroke="#000000" strokeWidth="2" />
              <ellipse cx="72" cy="45" rx="4" ry="3.5" fill="#F4B942" stroke="#000000" strokeWidth="2" />
            </>
          )}
        </g>
      </svg>
    </div>
  );
}
