'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Head from 'next/head';

const Timer = () => {
  const [time, setTime] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('pomodoro');
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [showCelebration, setShowCelebration] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedTasks = localStorage.getItem('tasks');
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }, [tasks]);

  const modeColors = {
    pomodoro: { bg: 'bg-rose-400', text: 'text-rose-400', hex: '#FB7185' },
    shortBreak: { bg: 'bg-sky-400', text: 'text-sky-400', hex: '#38BDF8' },
    longBreak: { bg: 'bg-violet-400', text: 'text-violet-400', hex: '#A78BFA' },
  };

  const getModeTime = useCallback(() => {
    switch (mode) {
      case 'pomodoro':
        return 25 * 60;
      case 'shortBreak':
        return 5 * 60;
      case 'longBreak':
        return 15 * 60;
      default:
        return 25 * 60;
    }
  }, [mode]);

  useEffect(() => {
    setTime(getModeTime());
  }, [mode, getModeTime]);

  useEffect(() => {
    let interval = null;

    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      setIsActive(false);
      playAlarm();
      sendNotification();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, time]);

  useEffect(() => {
    updateTabTitle(time);
    updateFaviconColor(modeColors[mode].hex);
    updateStatusBarColor(modeColors[mode].hex);
    updateBodyBackgroundColor(modeColors[mode].hex);
  }, [time, mode]);

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setTime(getModeTime());
    setIsActive(false);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const playAlarm = () => {
    const audio = new Audio('/alarm.mp3');
    audio.play();
  };

  const updateTabTitle = (seconds) => {
    document.title = `${formatTime(seconds)} - Pomodoro Timer`;
  };

  const updateFaviconColor = (color) => {
    const favicon = document.querySelector('link[rel="icon"]');

    if (favicon) {
      const svgIcon = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="${color}" />
          <text x="50" y="50" font-family="Arial, sans-serif" font-size="60" text-anchor="middle" dy=".3em" fill="white">⏲️</text>
        </svg>
      `;
      const blob = new Blob([svgIcon], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);

      favicon.href = url;
    }
  };

  const updateStatusBarColor = (color) => {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    const appleMetaThemeColor = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', color);
    }
    if (appleMetaThemeColor) {
      appleMetaThemeColor.setAttribute('content', color);
    }
  };

  const updateBodyBackgroundColor = (color) => {
    document.body.style.backgroundColor = color;
  };

  const requestNotificationPermission = async () => {
    if (Notification.permission !== 'granted') {
      await Notification.requestPermission();
    }
  };

  const sendNotification = () => {
    if (Notification.permission === 'granted') {
      new Notification('Pomodoro Timer', {
        body: `${mode === 'pomodoro' ? 'Time for a break!' : 'Time to focus!'}`,
        icon: '/favicon.svg'
      });
    }
  };

  const setTimerMode = (newMode) => {
    setMode(newMode);
    setTime(getModeTime());
    setIsActive(false);
  };

  const addTask = (e) => {
    e.preventDefault();
    if (newTask.trim()) {
      setTasks([...tasks, { id: Date.now(), text: newTask, completed: false, estimatedPomodoros: 1 }]);
      setNewTask('');
    }
  };

  const toggleTask = (id) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);

    if (updatedTasks.every(task => task.completed)) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
  };

  const removeTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const updateTaskEstimate = (id, change) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, estimatedPomodoros: Math.max(1, task.estimatedPomodoros + change) } : task
    ));
  };

  const toggleAboutModal = () => {
    setShowAboutModal(!showAboutModal);
  };

  const openPerplexitySearch = () => {
    window.open('https://www.perplexity.ai/search?q=What+is+the+Pomodoro+Technique&utm_source=PomodoroTimer', '_blank');
  };

  return (
    <>
      <Head>
        <meta name="theme-color" content={modeColors[mode].hex} />
        <meta name="apple-mobile-web-app-status-bar-style" content={modeColors[mode].hex} />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </Head>
      <div className={`min-h-screen ${modeColors[mode].bg} p-6 sm:p-8 lg:p-12`}>
        <nav className="flex justify-between items-center mb-4">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">Pomodoro Timer</h1>
          <button
            className={`px-3 py-1 sm:px-4 sm:py-2 lg:px-5 lg:py-3 bg-white ${modeColors[mode].text} rounded-full text-base sm:text-lg lg:text-xl`}
            onClick={toggleAboutModal}
          >
            About
          </button>
        </nav>
        <div className="max-w-sm sm:max-w-md lg:max-w-lg mx-auto bg-white bg-opacity-20 backdrop-blur-md p-4 sm:p-8 lg:p-10 rounded-lg shadow-lg">
          <div className="flex justify-center space-x-2 sm:space-x-4 lg:space-x-6 mb-4 sm:mb-8">
            {['pomodoro', 'shortBreak', 'longBreak'].map((timerMode) => (
              <button
                key={timerMode}
                className={`px-3 py-1 sm:px-4 sm:py-2 lg:px-5 lg:py-3 rounded-full text-base sm:text-lg lg:text-xl ${
                  mode === timerMode ? `${modeColors[timerMode].bg} text-white` : `${modeColors[timerMode].text} bg-white bg-opacity-80`                }`}
                onClick={() => setTimerMode(timerMode)}
              >
                {timerMode === 'pomodoro' ? 'Pomodoro' : timerMode === 'shortBreak' ? 'Short Break' : 'Long Break'}
              </button>
            ))}
          </div>
          <motion.div
            className="text-7xl sm:text-9xl lg:text-10xl font-bold text-white text-center mb-4 sm:mb-8 lg:mb-10"
            initial={{ scale: 1 }}
            animate={{ scale: isActive ? 1.1 : 1 }}
            transition={{ duration: 0.5 }}
          >
            {formatTime(time)}
          </motion.div>
          <div className="flex justify-center mb-4 sm:mb-8 lg:mb-10">
            <button
              className="px-7 py-2 sm:px-10 sm:py-3 lg:px-12 lg:py-4 bg-white text-red-600 rounded-full text-xl sm:text-2xl lg:text-3xl font-semibold"
              onClick={toggleTimer}
            >
              {isActive ? 'PAUSE' : 'START'}
            </button>
          </div>
          <div className="text-white text-center mb-4 sm:mb-8 lg:mb-10 text-base sm:text-lg lg:text-xl">
            {mode === 'pomodoro' ? 'Time to focus!' : 'Time for a break!'}
          </div>
          <div className="bg-white bg-opacity-80 p-4 sm:p-6 lg:p-8 rounded-lg mb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-800 mb-2 sm:mb-4 lg:mb-6">Tasks</h2>
            <ul className="space-y-4">
              {tasks.map(task => (
                <li key={task.id} className="flex items-center justify-between text-lg sm:text-xl lg:text-2xl">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
                      className="mr-3 w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10"
                    />
                    <span className={`text-gray-800 ${task.completed ? 'line-through' : ''}`}>
                      {task.text}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <button
                      onClick={() => updateTaskEstimate(task.id, -1)}
                      className="text-gray-600 px-2 sm:px-3 lg:px-4 text-lg sm:text-xl lg:text-2xl"
                    >
                      -
                    </button>
                    <span className="text-gray-800 mx-2 sm:mx-3 lg:mx-4 text-lg sm:text-xl lg:text-2xl">
                      {task.estimatedPomodoros} ⏲️
                    </span>
                    <button
                      onClick={() => updateTaskEstimate(task.id, 1)}
                      className="text-gray-600 px-2 sm:px-3 lg:px-4 text-lg sm:text-xl lg:text-2xl"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeTask(task.id)}
                      className="text-gray-600 ml-3 sm:ml-4 lg:ml-5 text-lg sm:text-xl lg:text-2xl"
                    >
                      ×
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <form onSubmit={addTask} className="mt-4 sm:mt-6 lg:mt-8 flex">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Add a new task"
                className="flex-grow px-4 py-2 sm:px-5 sm:py-3 lg:px-6 lg:py-4 rounded-l-lg border-2 border-r-0 border-gray-300 focus:outline-none focus:border-gray-500 text-gray-800 text-lg sm:text-xl lg:text-2xl"
              />
              <button
                type="submit"
                className={`${modeColors[mode].bg} text-white px-4 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-4 rounded-r-lg text-lg sm:text-xl lg:text-2xl`}
              >
                Add
              </button>
            </form>
          </div>
        </div>
        <div className="text-center mt-6 sm:mt-8 lg:mt-10">
          <a
            href="https://renedeanda.com?utm_source=pomodoro_timer&utm_medium=referral"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:underline text-lg sm:text-xl lg:text-2xl"
          >
            Made with 💛 + 🤖 by René DeAnda
          </a>
        </div>
        <AnimatePresence>
          {showCelebration && (
            <motion.div
              className="fixed inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="text-6xl">🎉</div>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {showAboutModal && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white p-4 sm:p-8 lg:p-10 rounded-lg max-w-xs sm:max-w-md lg:max-w-lg w-full"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -50, opacity: 0 }}
              >
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 sm:mb-4 lg:mb-6 text-gray-800">About the Pomodoro Technique</h2>
                <p className="mb-2 sm:mb-4 lg:mb-6 text-gray-700 text-base sm:text-lg lg:text-xl">
                  The Pomodoro Technique is a time management method that uses a timer to break work into focused intervals, typically 25 minutes long, separated by short breaks. This approach aims to improve productivity and maintain mental agility.
                </p>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-1 sm:mb-2 lg:mb-4 text-gray-800">How to use this Pomodoro Timer:</h3>
                <ol className="list-decimal list-inside mb-2 sm:mb-4 lg:mb-6 text-gray-700 text-base sm:text-lg lg:text-xl">
                  <li>Add tasks you want to work on</li>
                  <li>Estimate the number of Pomodoro sessions for each task</li>
                  <li>Start the timer and focus on your chosen task</li>
                  <li>Take a short break when the timer rings</li>
                  <li>After four Pomodoros, take a longer break</li>
                  <li>Repeat this cycle until you complete your tasks</li>
                </ol>
                <div className="flex justify-between">
                  <button
                    className="px-3 py-1 sm:px-4 sm:py-2 lg:px-5 lg:py-3 bg-blue-500 text-white rounded-full text-base sm:text-lg lg:text-xl"
                    onClick={openPerplexitySearch}
                  >
                    Learn More
                  </button>
                  <button
                    className="px-3 py-1 sm:px-4 sm:py-2 lg:px-5 lg:py-3 bg-red-500 text-white rounded-full text-base sm:text-lg lg:text-xl"
                    onClick={toggleAboutModal}
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Timer;
               