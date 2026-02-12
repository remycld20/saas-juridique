"use client"

import { motion } from "framer-motion"

interface AIOrbProps {
  isActive?: boolean
}

export function AIOrb({ isActive = false }: AIOrbProps) {
  return (
    <div className="relative w-44 h-44">
      <motion.div
        className="absolute inset-0 rounded-full bg-primary/20 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.4, 0.6, 0.4],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute inset-0 rounded-full bg-primary/15 blur-2xl"
        animate={{
          scale: isActive ? [1, 1.25, 1] : [1, 1.15, 1],
          opacity: isActive ? [0.35, 0.55, 0.35] : [0.3, 0.45, 0.3],
        }}
        transition={{
          duration: isActive ? 2.5 : 4.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute inset-6 rounded-full border-2 border-primary/25"
        animate={{
          scale: [1, 1.03, 1],
          opacity: [0.35, 0.5, 0.35],
        }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute inset-10 rounded-full bg-gradient-to-br from-primary to-primary/70 shadow-2xl shadow-primary/40"
        animate={{
          scale: [1, 1.02, 1],
          boxShadow: [
            "0 0 50px rgba(31, 106, 225, 0.4)",
            "0 0 70px rgba(31, 106, 225, 0.5)",
            "0 0 50px rgba(31, 106, 225, 0.4)",
          ],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute inset-14 rounded-full bg-white/25"
        animate={{
          opacity: [0.2, 0.35, 0.2],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  )
}
