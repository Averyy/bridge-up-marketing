// Framer Motion animation variants
// Spring animations (damping: 30, stiffness: 400)

export const springTransition = {
  type: "spring" as const,
  damping: 30,
  stiffness: 400,
};

export const fadeInUp = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: springTransition,
  },
};

export const fadeIn = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: { duration: 0.5 },
  },
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const scaleIn = {
  initial: {
    opacity: 0,
    scale: 0.95,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: springTransition,
  },
};

export const slideInFromLeft = {
  initial: {
    opacity: 0,
    x: -30,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: springTransition,
  },
};

export const slideInFromRight = {
  initial: {
    opacity: 0,
    x: 30,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: springTransition,
  },
};

// For use with whileInView
export const viewportConfig = {
  once: true,
  margin: "-100px",
};
