import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const Slider = ({ min = 0, max = 100, step = 1, defaultValue = 50, onChange }) => {
  const [value, setValue] = useState(defaultValue);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef(null);

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    document.addEventListener('mouseup', handleMouseUp);
    return () => document.removeEventListener('mouseup', handleMouseUp);
  }, []);

  useEffect(() => {
    if (isDragging) {
      const handleMouseMove = (e) => {
        const sliderRect = sliderRef.current.getBoundingClientRect();
        const newValue = Math.round(((e.clientX - sliderRect.left) / sliderRect.width) * (max - min) + min);
        const clampedValue = Math.max(min, Math.min(max, newValue));
        const steppedValue = Math.round(clampedValue / step) * step;
        setValue(steppedValue);
        onChange && onChange(steppedValue);
      };
      document.addEventListener('mousemove', handleMouseMove);
      return () => document.removeEventListener('mousemove', handleMouseMove);
    }
  }, [isDragging, min, max, step, onChange]);

  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="relative w-full h-6 flex items-center">
      <div
        ref={sliderRef}
        className="w-full h-2 bg-gray-200 rounded-full overflow-hidden cursor-pointer"
        onMouseDown={() => setIsDragging(true)}
      >
        <motion.div
          className="h-full bg-blue-500"
          style={{ width: `${percentage}%` }}
          initial={false}
          animate={{ width: `${percentage}%` }}
        />
      </div>
      <motion.div
        className="absolute w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center cursor-grab"
        style={{ left: `calc(${percentage}% - 12px)` }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        drag="x"
        dragConstraints={sliderRef}
        dragElastic={0}
        dragMomentum={false}
        onDrag={(_, info) => {
          const sliderRect = sliderRef.current.getBoundingClientRect();
          const newValue = Math.round(((info.point.x - sliderRect.left) / sliderRect.width) * (max - min) + min);
          const clampedValue = Math.max(min, Math.min(max, newValue));
          const steppedValue = Math.round(clampedValue / step) * step;
          setValue(steppedValue);
          onChange && onChange(steppedValue);
        }}
      >
        <span className="text-xs font-semibold text-blue-500">{value}</span>
      </motion.div>
    </div>
  );
};

export { Slider };