import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import { FaBook, FaHeart, FaUtensils, FaStar, FaArrowRight, FaUsers, FaClock } from 'react-icons/fa'
import ParticleBackground from '../components/home/ParticleBackground'
import FloatingCard3D from '../components/home/FloatingCard3D'
import AnimatedText3D from '../components/home/AnimatedText3D'
import { useAuth } from '../context/AuthContext'
import '../styles/home.css'

export default function Home() {
    const { user } = useAuth()
    const { scrollYProgress } = useScroll()
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
    const magneticRef = useRef(null)

    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
    const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8])

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY })
        }
        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

    // Magnetic button effect
    const handleMagneticMove = (e) => {
        if (!magneticRef.current) return
        const rect = magneticRef.current.getBoundingClientRect()
        const x = e.clientX - rect.left - rect.width / 2
        const y = e.clientY - rect.top - rect.height / 2
        magneticRef.current.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`
    }

    const handleMagneticLeave = () => {
        if (magneticRef.current) {
            magneticRef.current.style.transform = 'translate(0, 0)'
        }
    }

    return (
        <div className="home-container">
            <ParticleBackground />

            {/* Hero Section */}
            <motion.section
                className="hero-section"
                style={{ opacity, scale }}
            >
                <div className="hero-content">
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                    >
                        <AnimatedText3D
                            text="Your Culinary Journey Starts Here"
                            className="hero-title"
                            gradient={true}
                        />
                    </motion.div>

                    <motion.p
                        className="hero-subtitle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 1 }}
                    >
                        Discover, Create, and Share Amazing Recipes in Stunning 3D
                    </motion.p>

                    <motion.div
                        className="hero-cta"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1, duration: 0.8 }}
                        onMouseMove={handleMagneticMove}
                        onMouseLeave={handleMagneticLeave}
                    >
                        <Link
                            to={user ? '/cookbook' : '/signup'}
                            ref={magneticRef}
                            className="magnetic-button"
                        >
                            <span>Start Cooking</span>
                            <FaArrowRight className="ml-2" />
                        </Link>
                    </motion.div>

                    <motion.div
                        className="scroll-indicator"
                        animate={{ y: [0, 10, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                    >
                        <div className="scroll-line" />
                    </motion.div>
                </div>
            </motion.section>

            {/* Featured Recipes Section */}
            <section className="featured-section">
                <motion.h2
                    className="section-title"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    Featured Recipes
                </motion.h2>

                <div className="recipes-grid">
                    {[
                        { title: 'Butter Chicken', emoji: '🍛', time: '45 min', rating: 4.8 },
                        { title: 'Margherita Pizza', emoji: '🍕', time: '30 min', rating: 4.9 },
                        { title: 'Tacos al Pastor', emoji: '🌮', time: '40 min', rating: 4.7 },
                        { title: 'Spaghetti Carbonara', emoji: '🍝', time: '25 min', rating: 4.6 },
                    ].map((recipe, index) => (
                        <FloatingCard3D key={index} delay={index * 0.1}>
                            <div className="recipe-card">
                                <div className="recipe-emoji">{recipe.emoji}</div>
                                <h3 className="recipe-title">{recipe.title}</h3>
                                <div className="recipe-info">
                                    <span><FaClock /> {recipe.time}</span>
                                    <span><FaStar className="text-yellow-400" /> {recipe.rating}</span>
                                </div>
                                <div className="recipe-glow-effect" />
                            </div>
                        </FloatingCard3D>
                    ))}
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <motion.h2
                    className="section-title"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                >
                    Everything You Need
                </motion.h2>

                <div className="features-grid">
                    {[
                        { icon: FaBook, title: 'Digital Cookbook', desc: 'Store unlimited recipes in your personal cookbook' },
                        { icon: FaHeart, title: 'Save Favorites', desc: 'Quickly access your most loved recipes' },
                        { icon: FaUtensils, title: 'Easy Creation', desc: 'Add your own recipes with simple steps' },
                        { icon: FaStar, title: 'Rate & Review', desc: 'Share your cooking experiences' },
                    ].map((feature, index) => (
                        <motion.div
                            key={index}
                            className="feature-card"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.6 }}
                            whileHover={{ scale: 1.05, rotateY: 5 }}
                        >
                            <motion.div
                                className="feature-icon"
                                whileHover={{ scale: 1.2, rotate: 360 }}
                                transition={{ duration: 0.5 }}
                            >
                                <feature.icon />
                            </motion.div>
                            <h3>{feature.title}</h3>
                            <p>{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Stats Section */}
            <section className="stats-section">
                <div className="stats-container">
                    {[
                        { number: '10K+', label: 'Recipes', icon: FaUtensils },
                        { number: '5K+', label: 'Users', icon: FaUsers },
                        { number: '50K+', label: 'Favorites', icon: FaHeart },
                    ].map((stat, index) => (
                        <motion.div
                            key={index}
                            className="stat-card"
                            initial={{ opacity: 0, scale: 0.5 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2, type: 'spring' }}
                        >
                            <stat.icon className="stat-icon" />
                            <motion.h3
                                className="stat-number"
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                            >
                                {stat.number}
                            </motion.h3>
                            <p className="stat-label">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <motion.div
                    className="cta-content"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="cta-title">Ready to Start Your Culinary Adventure?</h2>
                    <p className="cta-subtitle">
                        Join thousands of food lovers creating and sharing amazing recipes
                    </p>
                    <Link
                        to={user ? '/cookbook' : '/signup'}
                        className="cta-button"
                    >
                        Get Started Free
                    </Link>
                </motion.div>
            </section>
        </div>
    )
}
