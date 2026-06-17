import { motion } from "framer-motion";

interface DiceRollProps {
  rolling: boolean;
  onRoll: () => void;
  disabled?: boolean;
}

export function DiceRoll({ rolling, onRoll, disabled }: DiceRollProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <motion.button
        type="button"
        onClick={onRoll}
        disabled={disabled || rolling}
        className="retro-btn w-full disabled:opacity-50"
        whileTap={{ scale: 0.97 }}
      >
        {rolling ? "Rolling..." : "Roll 🎲"}
      </motion.button>

      <motion.div
        animate={
          rolling
            ? {
                rotate: [0, 90, 180, 270, 360, 450, 540],
                scale: [1, 1.15, 1, 1.15, 1],
              }
            : { rotate: 0, scale: 1 }
        }
        transition={
          rolling
            ? { duration: 0.9, ease: "easeInOut" }
            : { type: "spring", stiffness: 300 }
        }
        className="flex h-14 w-14 items-center justify-center rounded-lg border-2 border-ink bg-white text-2xl shadow-retro-sm"
      >
        🎲
      </motion.div>
    </div>
  );
}
