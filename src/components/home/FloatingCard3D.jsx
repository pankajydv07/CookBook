import { useRef, useState } from 'react'
import { motion } from 'framer-motion'

export default function FloatingCard3D({ children, className = '', delay = 0 }) {
    const cardRef = useRef(null)
    const [rotateX, setRotateX] = useState(0)
    const [rotateY, setRotateY] = useState(0)

    const handleMouseMove = (e) => {
        if (!cardRef.current) return

        const card = cardRef.current
        const rect = card.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const centerX = rect.width / 2
        const centerY = rect.height / 2

        const rotateXValue = ((y - centerY) / centerY) * -10
        const rotateYValue = ((x - centerX) / centerX) * 10

        setRotateX(rotateXValue)
        setRotateY(rotateYValue)
    }

    const handleMouseLeave = () => {
        setRotateX(0)
        setRotateY(0)
    }

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay }}
            animate={{
                y: [0, -15, 0],
                rotateX,
                rotateY,
            }}
            whileHover={{ scale: 1.05, z: 50 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={`floating-card-3d ${className}`}
            style={{
                transformStyle: 'preserve-3d',
                perspective: '1000px',
                transition: 'transform 0.1s ease-out',
            }}
        >
            <div className="card-content" style={{ transform: 'translateZ(20px)' }}>
                {children}
            </div>
            <div className="card-glow" />
        </motion.div>
    )
}
