import { useEffect, useRef } from 'react'
import type { OceanProfile } from '@/data/mockData'

interface OceanRadarProps {
  profile: OceanProfile
  size?: number
  color?: string
  className?: string
  showLabels?: boolean
  animated?: boolean
}

export default function OceanRadar({
  profile,
  size = 200,
  color = '#00d4aa',
  className = '',
  showLabels = true,
  animated = true,
}: OceanRadarProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  const traits: { key: keyof OceanProfile; label: string }[] = [
    { key: 'openness', label: 'O' },
    { key: 'conscientiousness', label: 'C' },
    { key: 'extraversion', label: 'E' },
    { key: 'agreeableness', label: 'A' },
    { key: 'neuroticism', label: 'N' },
  ]

  const center = size / 2
  const radius = size * 0.38
  const angleStep = (Math.PI * 2) / traits.length

  const getPoint = (value: number, index: number) => {
    const angle = index * angleStep - Math.PI / 2
    const r = (value / 100) * radius
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    }
  }

  const points = traits.map((t, i) => getPoint(profile[t.key], i))
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z'

  // Grid circles
  const gridCircles = [20, 40, 60, 80, 100]

  // Axis lines
  const axisLines = traits.map((_, i) => {
    const angle = i * angleStep - Math.PI / 2
    return {
      x2: center + radius * Math.cos(angle),
      y2: center + radius * Math.sin(angle),
    }
  })

  useEffect(() => {
    if (!animated || !svgRef.current) return
    const path = svgRef.current.querySelector('.radar-fill') as SVGPathElement
    if (path) {
      path.style.strokeDasharray = '1000'
      path.style.strokeDashoffset = '1000'
      path.style.transition = 'stroke-dashoffset 1.5s ease-out'
      requestAnimationFrame(() => {
        path.style.strokeDashoffset = '0'
      })
    }
  }, [animated, profile])

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <svg ref={svgRef} width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
        {/* Grid circles */}
        {gridCircles.map((val) => (
          <circle
            key={val}
            cx={center}
            cy={center}
            r={(val / 100) * radius}
            fill="none"
            stroke="#374151"
            strokeWidth={0.5}
            strokeDasharray={val === 100 ? 'none' : '3 3'}
          />
        ))}

        {/* Axis lines */}
        {axisLines.map((line, i) => (
          <line
            key={i}
            x1={center}
            y1={center}
            x2={line.x2}
            y2={line.y2}
            stroke="#374151"
            strokeWidth={0.5}
          />
        ))}

        {/* Data area */}
        <path
          d={pathD}
          fill={color}
          fillOpacity={0.25}
          stroke={color}
          strokeWidth={2}
          className="radar-fill"
        />

        {/* Data points */}
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={3} fill={color} stroke="#0a0e17" strokeWidth={1} />
        ))}
      </svg>

      {/* Labels */}
      {showLabels && (
        <div className="absolute inset-0 pointer-events-none">
          {traits.map((t, i) => {
            const angle = i * angleStep - Math.PI / 2
            const labelR = radius + 18
            const x = center + labelR * Math.cos(angle)
            const y = center + labelR * Math.sin(angle)
            return (
              <span
                key={t.key}
                className="absolute text-xs font-bold text-syndi-text-muted"
                style={{
                  left: x,
                  top: y,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                {t.label}
              </span>
            )
          })}
        </div>
      )}
    </div>
  )
}
