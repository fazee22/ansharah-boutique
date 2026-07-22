"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const messages = [
  "Complimentary express shipping on orders over PKR 15,000",
  "New Season Arrivals — shop the latest edit",
  "Sign up for early access to limited releases",
];

const ROTATE_INTERVAL_MS = 5000;

/**
 * Slim rotating message bar above the header. Auto-rotates on a
 * timer and pauses when the tab isn't visible so it never burns
 * cycles (or looks broken mid-transition) in a background tab.
 */
function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (messages.length <= 1) return;

    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        setIndex((current) => (current + 1) % messages.length);
      }
    }, ROTATE_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex h-9 items-center justify-center overflow-hidden bg-ink px-gutter text-porcelain">
      <AnimatePresence mode="wait">
        <motion.p
          key={index}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="font-mono text-[0.6875rem] uppercase tracking-widest text-porcelain/90"
        >
          {messages[index]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

export { AnnouncementBar };
