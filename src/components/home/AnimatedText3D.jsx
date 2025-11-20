import { motion } from 'framer-motion'

export default function AnimatedText3D({ text, className = '', gradient = true }) {
    const words = text.split(' ')

    const container = {
        hidden: { opacity: 0 },
        visible: (i = 1) => ({
            opacity: 1,
            transition: { staggerChildren: 0.12, delayChildren: 0.04 * i },
        }),
    }

    const child = {
        visible: {
            opacity: 1,
            y: 0,
            rotateX: 0,
            transition: {
                type: 'spring',
                damping: 12,
                stiffness: 100,
            },
        },
        hidden: {
            opacity: 0,
            y: 20,
            rotateX: -90,
            transition: {
                type: 'spring',
                damping: 12,
                stiffness: 100,
            },
        },
    }

    return (
        <motion.div
            style={{ perspective: '1000px', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}
            variants={container}
            initial="hidden"
            animate="visible"
            className={className}
        >
            {words.map((word, index) => (
                <motion.span
                    key={index}
                    variants={child}
                    style={{
                        transformStyle: 'preserve-3d',
                        display: 'inline-block',
                    }}
                    className={gradient ? 'gradient-text' : ''}
                >
                    {word}
                </motion.span>
            ))}
        </motion.div>
    )
}
