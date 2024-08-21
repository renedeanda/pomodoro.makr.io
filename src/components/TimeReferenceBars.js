// components/TimeReferenceBars.js

import React, { useState, useEffect } from 'react';

const TimeReferenceBar = ({ label, percentage, timeLeft, bgColor, barColor }) => (
  <div className="mb-4" role="group" aria-labelledby={`${label.replace(/\s+/g, '-').toLowerCase()}-label`}>
    <div className="flex justify-between text-sm text-white mb-1 font-semibold">
      <span id={`${label.replace(/\s+/g, '-').toLowerCase()}-label`}>{label}</span>
      <span aria-live="polite">{timeLeft}</span>
    </div>
    <div 
      className="h-3 bg-white bg-opacity-30 rounded-full overflow-hidden" 
      role="progressbar" 
      aria-valuenow={Math.round(percentage)} 
      aria-valuemin="0" 
      aria-valuemax="100"
    >
      <div 
        className="h-full rounded-full transition-all duration-1000 ease-in-out"
        style={{ width: `${percentage}%`, backgroundColor: barColor }}
      ></div>
    </div>
  </div>
);

const TimeReferenceBars = ({ mode, modeColors }) => {
  const [dayProgress, setDayProgress] = useState(0);
  const [yearProgress, setYearProgress] = useState(0);
  const [timeLeftInDay, setTimeLeftInDay] = useState('');
  const [daysLeftInYear, setDaysLeftInYear] = useState('');

  useEffect(() => {
    const updateProgress = () => {
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);
      const dayPercentage = ((now - startOfDay) / (endOfDay - startOfDay)) * 100;

      const startOfYear = new Date(now.getFullYear(), 0, 1);
      const endOfYear = new Date(now.getFullYear() + 1, 0, 1);
      const yearPercentage = ((now - startOfYear) / (endOfYear - startOfYear)) * 100;

      setDayProgress(dayPercentage);
      setYearProgress(yearPercentage);

      // Calculate time left in day
      const msLeft = endOfDay - now;
      const hoursLeft = Math.floor(msLeft / (1000 * 60 * 60));
      const minutesLeft = Math.floor((msLeft % (1000 * 60 * 60)) / (1000 * 60));
      setTimeLeftInDay(`${hoursLeft}h ${minutesLeft}m`);

      // Calculate days left in year
      const daysLeft = Math.ceil((endOfYear - now) / (1000 * 60 * 60 * 24));
      setDaysLeftInYear(`${daysLeft} days`);
    };

    updateProgress();
    const interval = setInterval(updateProgress, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const getContrastBarColor = (bgColor) => {
    // This function should return a color that contrasts well with the background
    // For simplicity, we're using white, but you might want to use a more sophisticated method
    return '#FFFFFF';
  };

  const bgColor = modeColors[mode].hex;
  const barColor = getContrastBarColor(bgColor);

  return (
    <div className="space-y-4 bg-white bg-opacity-10 p-4 rounded-lg">
      <TimeReferenceBar 
        label="Time left in day" 
        percentage={100 - dayProgress} 
        timeLeft={timeLeftInDay}
        bgColor={bgColor}
        barColor={barColor}
      />
      <TimeReferenceBar 
        label="Days left in year" 
        percentage={100 - yearProgress} 
        timeLeft={daysLeftInYear}
        bgColor={bgColor}
        barColor={barColor}
      />
    </div>
  );
};

export default TimeReferenceBars;