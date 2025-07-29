export const fadeIn = (direction = "up", delay = 0.3) => {
  return {
    hidden: {
      y: direction === "up" ? 40 : 0,
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        delay,
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };
};
