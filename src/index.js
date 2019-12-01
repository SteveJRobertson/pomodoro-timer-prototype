import React, { useState, useEffect, useRef, useCallback } from "react";
import ReactDOM from "react-dom";
import { sessionIntervals, INTERVAL_DELAY } from "./constants";
import TimerDigits from "./components/TimerDigits/TimerDigits";
import SessionTypeDisplay from "./components/SessionTypeDisplay/SessionTypeDisplay";
import NumberOfSessionsDisplay from "./components/NumberOfSessionsDisplay/NumberOfSessionsDisplay";
import TimerControls from "./components/TimerControls/TimerControls";

import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "./styles.css";

const useInterval = (callback, delay) => {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};

function App() {
  const [intervalDelay, setIntervalDelay] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionLengthMins, setSessionLengthMins] = useState(
    sessionIntervals.WORK
  );
  const [secondsRemaining, setSecondsRemaining] = useState(
    sessionLengthMins * 60
  );
  const [workIntervalCount, setWorkIntervalCount] = useState(0);

  const timer = () => {
    setSecondsRemaining(secondsRemaining - 1);
  };

  const pauseInterval = () => {
    setIsRunning(false);
    setIntervalDelay(null);
  };

  const resetCounter = mins => {
    setSecondsRemaining(mins * 60);
  };

  const updateCurrentIntervalLength = useCallback(() => {
    if (sessionLengthMins === sessionIntervals.WORK) {
      let breakInterval = sessionIntervals.SHORT;

      if (workIntervalCount === 3) {
        breakInterval = sessionIntervals.LONG;
        setWorkIntervalCount(0);
      } else {
        setWorkIntervalCount(workIntervalCount + 1);
      }

      setSessionLengthMins(breakInterval);
      resetCounter(breakInterval);
    } else {
      setSessionLengthMins(sessionIntervals.WORK);
      resetCounter(sessionIntervals.WORK);
    }
  }, [sessionLengthMins, workIntervalCount]);

  const play = () => {
    setIntervalDelay(INTERVAL_DELAY);
    setIsRunning(true);
  };

  const pause = useCallback(() => {
    pauseInterval();
  }, []);

  const stop = () => {
    pauseInterval();
    resetCounter(sessionIntervals.WORK);
  };

  useInterval(timer, intervalDelay);

  useEffect(() => {
    if (isRunning && secondsRemaining === 0) {
      pauseInterval();
      resetCounter(sessionLengthMins);
      updateCurrentIntervalLength();
    } else if (secondsRemaining === 0) {
      setSecondsRemaining(sessionLengthMins * 60);
    }
  }, [
    isRunning,
    secondsRemaining,
    sessionLengthMins,
    updateCurrentIntervalLength
  ]);

  useEffect(() => {}, []);

  const handlePlayButtonClick = () => {
    play();
  };

  const handlePauseButtonClick = () => {
    pause();
  };

  const handleStopButtonClick = () => {
    setWorkIntervalCount(0);
    setSessionLengthMins(sessionIntervals.WORK);
    stop();
  };

  return (
    <div className="App">
      <h1>Pomodoro Timer</h1>

      <TimerDigits
        secondsRemaining={secondsRemaining}
        sessionLengthMins={sessionLengthMins}
      />

      <SessionTypeDisplay sessionLengthMins={sessionLengthMins} />

      <NumberOfSessionsDisplay workIntervalCount={workIntervalCount} />

      <TimerControls
        isRunning={isRunning}
        onPlay={handlePlayButtonClick}
        onPause={handlePauseButtonClick}
        onStop={handleStopButtonClick}
      />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
