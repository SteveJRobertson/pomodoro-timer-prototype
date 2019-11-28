import React, { useState, useEffect, useRef, useCallback } from "react";
import ReactDOM from "react-dom";
import { Button, ButtonGroup, Intent } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "./styles.css";

const INTERVAL_DELAY = 1000;
const MAX_WORK_INTERVAL_COUNT = 4;
const WORK_INTERVAL_MINS = 25;
const LONG_INTERVAL_MINS = 15;
const SHORT_INTERVAL_MINS = 5;

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
  const [displayMins, setDisplayMins] = useState(WORK_INTERVAL_MINS);
  const [displaySecs, setDisplaySecs] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionLengthMins, setSessionLengthMins] = useState(
    WORK_INTERVAL_MINS
  );
  const [secondsRemaining, setSecondsRemaining] = useState(
    sessionLengthMins * 60
  );
  const [workIntervalCount, setWorkIntervalCount] = useState(0);

  const getDisplayValue = num => (`${num}`.length === 1 ? `0${num}` : `${num}`);

  const getSessionType = () => {
    switch (sessionLengthMins) {
      case WORK_INTERVAL_MINS:
        return "Work Session";
      case LONG_INTERVAL_MINS:
        return "Long Break";
      case SHORT_INTERVAL_MINS:
        return "Short Break";
      default:
        return;
    }
  };

  const getDisplayNumberOfSessions = () => {
    if (workIntervalCount === 3) {
      return "Big break up next";
    } else if (workIntervalCount === 4) {
      return `${MAX_WORK_INTERVAL_COUNT} sessions remaining until your big break`;
    }

    return `${MAX_WORK_INTERVAL_COUNT -
      workIntervalCount} sessions remaining until your big break`;
  };

  const timer = () => {
    setSecondsRemaining(secondsRemaining - 1);
  };

  const pauseInterval = () => {
    setIsRunning(false);
    setIntervalDelay(null);
  };

  const resetCounter = mins => {
    setSecondsRemaining(mins * 60);
    setDisplayMins(mins);
    setDisplaySecs(0);
  };

  const updateCurrentIntervalLength = useCallback(() => {
    if (sessionLengthMins === WORK_INTERVAL_MINS) {
      let breakInterval = SHORT_INTERVAL_MINS;

      if (workIntervalCount === 3) {
        breakInterval = LONG_INTERVAL_MINS;
        setWorkIntervalCount(0);
      } else {
        setWorkIntervalCount(workIntervalCount + 1);
      }

      setSessionLengthMins(breakInterval);
      resetCounter(breakInterval);
    } else {
      setSessionLengthMins(WORK_INTERVAL_MINS);
      resetCounter(WORK_INTERVAL_MINS);
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
    resetCounter(WORK_INTERVAL_MINS);
  };

  useInterval(timer, intervalDelay);

  useEffect(() => {
    if (isRunning) {
      if (secondsRemaining === 0) {
        pauseInterval();
        resetCounter(sessionLengthMins);
        updateCurrentIntervalLength();
      } else if (secondsRemaining < 60) {
        setDisplayMins(0);
        setDisplaySecs(secondsRemaining);
      } else {
        const newSecs = secondsRemaining % 60;
        const newMins = (secondsRemaining - newSecs) / 60;

        setDisplayMins(newMins);
        setDisplaySecs(newSecs);
      }
    } else if (secondsRemaining === 0) {
      setSecondsRemaining(sessionLengthMins * 60);
    }
  }, [
    isRunning,
    secondsRemaining,
    sessionLengthMins,
    updateCurrentIntervalLength
  ]);

  const handlePlayButtonClick = () => {
    play();
  };

  const handlePauseButtonClick = () => {
    pause();
  };

  const handleStopButtonClick = () => {
    setWorkIntervalCount(0);
    stop();
  };

  return (
    <div className="App">
      <h1>Pomodoro Timer</h1>

      <div className="timer">
        <div className="timer-digits">{getDisplayValue(displayMins)}</div>
        <div className="timer-digit-separator">:</div>
        <div className="timer-digits">{getDisplayValue(displaySecs)}</div>
      </div>

      <h2>{getSessionType()}</h2>

      <p>{getDisplayNumberOfSessions()}</p>

      <ButtonGroup>
        {!isRunning && (
          <Button
            icon={IconNames.PLAY}
            intent={Intent.SUCCESS}
            large={true}
            onClick={handlePlayButtonClick}
          >
            Play
          </Button>
        )}
        {isRunning && (
          <Button
            icon={IconNames.PAUSE}
            intent={Intent.SUCCESS}
            large={true}
            onClick={handlePauseButtonClick}
          >
            Pause
          </Button>
        )}
        <Button
          icon={IconNames.STOP}
          intent={Intent.DANGER}
          large={true}
          onClick={handleStopButtonClick}
        >
          Stop
        </Button>
        {/* <Button large={true}>
          <Icon icon={IconNames.STEP_FORWARD} iconSize={Icon.SIZE_LARGE} />
        </Button> */}
      </ButtonGroup>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
