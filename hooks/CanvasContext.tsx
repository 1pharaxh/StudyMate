// @ts-nocheck
"use client";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { getLatex, getStrokesToken } from "./mathPixApi";
const API_REQUEST_TIMEOUT = 5000;
const CanvasContext = React.createContext();
var currentStroke = null;

export const CanvasProvider = ({ children }) => {
  const [mathpixContext, setMathpixContext] = useState(null);
  const [tokenRequestFlag, setTokenRequestFlag] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokes, setStrokes] = useState([]);
  const [undoHistory, setUndoHistory] = useState([]);
  const [redoHistory, setRedoHistory] = useState([]);
  const [redrawFlag, setRedrawFlag] = useState(false);
  const [redoFlag, setRedoFlag] = useState(false);
  const [undoFlag, setUndoFlag] = useState(false);
  const [checkStrikeThroughFlag, setCheckStrikeThroughFlag] = useState(false);
  const [renderLatexTimeout, setRenderLatexTimeout] = useState(null);
  const [tokenRefreshTimeout, setTokenRefreshTimeout] = useState(null);
  const [renderLatexFlag, setRenderLatexFlag] = useState(false);
  const [latex, setLatex] = useState({ code: "", isPlaceholder: true });
  const [pattern, setPattern] = useState(null);
  const [canvasPrepared, setCanvasPrepared] = useState(false);
  const [isAway, setIsAway] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [initialTokenReceived, setInitialTokenReceived] = useState(false);
  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  const prepareCanvas = () => {
    const canvas = canvasRef.current;
    var w = document.documentElement.clientWidth - 20;
    var h = document.documentElement.clientHeight;

    canvas.width = w * 2;
    canvas.height = h * 10;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h * 5}px`;

    const context = canvas.getContext("2d");
    context.scale(2, 2);
    context.lineCap = "round";
    context.strokeStyle = "black";
    context.lineWidth = 6;
    contextRef.current = context;

    const bgImage = new Image();
    bgImage.onload = () => {
      const bgpattern = context.createPattern(bgImage, "repeat");
      context.fillStyle = bgpattern;
      context.fillRect(0, 0, canvas.width, canvas.height);
      setPattern(bgpattern);
    };

    setCanvasPrepared(true);
  };

  const startDrawing = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.offsetX !== undefined && e.offsetY !== undefined) {
      var { offsetX, offsetY } = e;
    } else {
      var bcr = e.target.getBoundingClientRect();
      var offsetX = e.targetTouches[0].clientX - bcr.x;
      var offsetY = e.targetTouches[0].clientY - bcr.y;
    }
    contextRef.current.lineJoin = "round";
    contextRef.current.lineCap = "round";
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);

    currentStroke = {
      points: [{ x: offsetX, y: offsetY }],
      minX: offsetX,
      minY: offsetY,
      maxX: offsetX,
      maxY: offsetY,
      timestamp: Date.now(),
    };
    setIsDrawing(true);
  };

  const draw = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDrawing) {
      return;
    }
    if (e.offsetX !== undefined && e.offsetY !== undefined) {
      var { offsetX, offsetY } = e;
    } else {
      var bcr = e.target.getBoundingClientRect();
      var offsetX = e.targetTouches[0].clientX - bcr.x;
      var offsetY = e.targetTouches[0].clientY - bcr.y;
    }

    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
    const minX = Math.min(offsetX, currentStroke.minX);
    const minY = Math.min(offsetY, currentStroke.minY);
    const maxX = Math.max(offsetX, currentStroke.maxX);
    const maxY = Math.max(offsetY, currentStroke.maxY);

    currentStroke = {
      points: [...currentStroke.points, { x: offsetX, y: offsetY }],
      minX: minX,
      minY: minY,
      maxX: maxX,
      maxY: maxY,
      timestamp: Date.now(),
    };
  };

  const finishDrawing = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setStrokes([...strokes, currentStroke]);
    contextRef.current.closePath();
    setIsDrawing(false);
    setIsActive(true);
    setCheckStrikeThroughFlag(!checkStrikeThroughFlag);
  };

  const leaveCanvas = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isDrawing) {
      finishDrawing(e);
    }
  };

  const windowResize = () => {
    const canvas = canvasRef.current;
    var w = document.documentElement.clientWidth - 20;
    var h = document.documentElement.clientHeight;

    canvas.width = w * 2;
    canvas.height = h * 1.5;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h * 0.75}px`;

    const context = canvas.getContext("2d");
    context.scale(2, 2);
    context.lineCap = "round";
    context.strokeStyle = "black";
    context.lineWidth = 6;
    setRedrawFlag(!redrawFlag);
  };

  useEffect(() => {
    setRenderLatexFlag(!renderLatexFlag);
  }, [mathpixContext]);

  const refreshToken = () => {
    if (!document.hidden && mathpixContext === null && (isAway || isActive)) {
      setTokenRequestFlag(!tokenRequestFlag);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", windowResize);
    document.addEventListener("visibilitychange", refreshToken);
    return () => {
      window.removeEventListener("resize", windowResize);
      document.removeEventListener("visibilitychange", refreshToken);
    };
  }, [redrawFlag, mathpixContext, isAway]);

  useEffect(() => {
    if (initialTokenReceived && mathpixContext === null) {
      refreshToken();
    }
  }, [isActive]);

  useEffect(() => {
    if (canvasRef.current !== null) {
      const canvas = canvasRef.current;

      canvas.addEventListener("mousedown", startDrawing);
      canvas.addEventListener("mousemove", draw);
      canvas.addEventListener("mouseup", finishDrawing);
      canvas.addEventListener("mouseleave", leaveCanvas);

      canvas.addEventListener("touchstart", startDrawing);
      canvas.addEventListener("touchmove", draw);
      canvas.addEventListener("touchend", finishDrawing);
      canvas.addEventListener("touchleave", leaveCanvas);
    }
    return () => {
      if (canvasRef.current !== null) {
        const canvas = canvasRef.current;
        canvas.removeEventListener("mousedown", startDrawing);
        canvas.removeEventListener("mousemove", draw);
        canvas.removeEventListener("mouseup", finishDrawing);
        canvas.removeEventListener("mouseleave", leaveCanvas);

        canvas.removeEventListener("touchstart", startDrawing);
        canvas.removeEventListener("touchmove", draw);
        canvas.removeEventListener("touchend", finishDrawing);
        canvas.removeEventListener("touchcancel", leaveCanvas);
      }
    };
  }, [isDrawing, strokes, checkStrikeThroughFlag, canvasPrepared]);

  const fetchToken = async () => {
    return await getStrokesToken();
  };

  useEffect(() => {
    const f = async () => {
      if (!document.hidden && isActive) {
        const tokenContext = await fetchToken();
        if (tokenContext !== null) {
          setMathpixContext(tokenContext);
          setInitialTokenReceived(true);
          setIsAway(false);
          setIsActive(false);
          setTokenRefreshTimeout(
            setTimeout(() => {
              setTokenRequestFlag(!tokenRequestFlag);
            }, tokenContext.app_token_expires_at - Date.now() - 3000)
          );
        } else {
          setMathpixContext(null);
          setTimeout(() => {
            setTokenRequestFlag(!tokenRequestFlag);
          }, 2000);
        }
      } else {
        setMathpixContext(null);
        if (document.hidden) setIsAway(true);
      }
    };
    f();
  }, [tokenRequestFlag]);

  useEffect(() => {
    redraw();
    setRenderLatexFlag(!renderLatexFlag);
  }, [redrawFlag]);

  useEffect(() => {
    const redoStrokes = undoHistory[undoHistory.length - 1];
    if (redoStrokes) {
      if (redoStrokes.action === "Add") {
        setStrokes([...strokes, ...redoStrokes.strokes]);
      } else if (redoStrokes.action === "Remove") {
        setStrokes(
          strokes.filter((stroke) => !redoStrokes.strokes.includes(stroke))
        );
      }
      setRedrawFlag(!redrawFlag);
    }
  }, [redoFlag]);

  useEffect(() => {
    const undoStrokes = redoHistory[redoHistory.length - 1];
    if (undoStrokes) {
      if (undoStrokes.action === "Add") {
        setStrokes(
          strokes.filter((stroke) => !undoStrokes.strokes.includes(stroke))
        );
      } else if (undoStrokes.action === "Remove") {
        setStrokes([...strokes, ...undoStrokes.strokes]);
      }
      setRedrawFlag(!redrawFlag);
    }
  }, [undoFlag]);

  useEffect(() => {
    var removeStrokes = [];
    strokes.slice(0, -1).forEach((stroke) => {
      if (
        isAfterStrikeThroughCooldown(currentStroke, stroke) &&
        isOverIntersectingThreshold(currentStroke, stroke) &&
        isStraightLine(currentStroke)
      ) {
        removeStrokes.push(stroke);
      } else if (
        isAfterStrikeThroughCooldown(currentStroke, stroke) &&
        isOverIntersectingThreshold(currentStroke, stroke) &&
        isSribble(currentStroke)
      ) {
        removeStrokes.push(stroke);
      }
    });
    if (removeStrokes.length > 0) {
      removeStrokes.push(currentStroke);
      setStrokes(strokes.filter((stroke) => !removeStrokes.includes(stroke)));
      setUndoHistory([
        ...undoHistory,
        { action: "Remove", strokes: removeStrokes.slice(0, -1) },
      ]);
      setRedoHistory([]);
      setRedrawFlag(!redrawFlag);
    } else {
      if (currentStroke !== null) {
        setUndoHistory([
          ...undoHistory,
          { action: "Add", strokes: [currentStroke] },
        ]);
      }
      setRedoHistory([]);
    }
    setRenderLatexFlag(!renderLatexFlag);
  }, [checkStrikeThroughFlag]);

  const isAfterStrikeThroughCooldown = (newStroke, oldStroke) => {
    return newStroke.timestamp - oldStroke.timestamp > 2000;
  };

  const isOverIntersectingThreshold = (newStroke, oldStroke) => {
    return (
      intersectionOverOld(newStroke, oldStroke) > 0.85 ||
      IOU(newStroke, oldStroke) > 0.3
    );
  };

  const isStraightLine = (newStroke) => {
    return getDistanceRatio(newStroke) > 0.9;
  };

  const isSribble = (newStroke) => {
    return getDistanceRatio(newStroke) * 0.6 < 0.3;
  };

  const getDistanceRatio = (newStroke) => {
    var totalLength = 0;
    newStroke.points.forEach((point, index) => {
      if (index > 0) {
        const previousPoint = newStroke.points[index - 1];
        totalLength += Math.sqrt(
          Math.pow(point.x - previousPoint.x, 2) +
            Math.pow(point.y - previousPoint.y, 2)
        );
      }
    });
    const endpointLength = Math.sqrt(
      Math.pow(
        newStroke.points[0].x - newStroke.points[newStroke.points.length - 1].x,
        2
      ) +
        Math.pow(
          newStroke.points[0].y -
            newStroke.points[newStroke.points.length - 1].y,
          2
        )
    );
    return endpointLength / totalLength;
  };

  const IOU = (newStroke, oldStroke) => {
    const xA = Math.max(newStroke.minX, oldStroke.minX);
    const yA = Math.max(newStroke.minY, oldStroke.minY);
    const xB = Math.min(newStroke.maxX, oldStroke.maxX);
    const yB = Math.min(newStroke.maxY, oldStroke.maxY);

    const intersectionArea =
      Math.max(0, xB - xA + 1) * Math.max(0, yB - yA + 1);

    const box1area =
      (newStroke.maxX - newStroke.minX + 1) *
      (newStroke.maxY - newStroke.minY + 1);
    const box2area =
      (oldStroke.maxX - oldStroke.minX + 1) *
      (oldStroke.maxY - oldStroke.minY + 1);

    const iou = intersectionArea / (box1area + box2area - intersectionArea);

    return iou;
  };

  const intersectionOverOld = (newStroke, oldStroke) => {
    const xA = Math.max(newStroke.minX, oldStroke.minX);
    const yA = Math.max(newStroke.minY, oldStroke.minY);
    const xB = Math.min(newStroke.maxX, oldStroke.maxX);
    const yB = Math.min(newStroke.maxY, oldStroke.maxY);

    const intersectionArea =
      Math.max(0, xB - xA + 1) * Math.max(0, yB - yA + 1);

    const box2area =
      (oldStroke.maxX - oldStroke.minX + 1) *
      (oldStroke.maxY - oldStroke.minY + 1);

    const ioo = intersectionArea / box2area;

    return ioo;
  };

  const undo = () => {
    if (undoHistory.length === 0) {
      return;
    }
    const undoStrokes = undoHistory[undoHistory.length - 1];
    setUndoHistory(undoHistory.slice(0, -1));
    setRedoHistory([...redoHistory, undoStrokes]);
    setUndoFlag(!undoFlag);
  };

  const redo = () => {
    if (redoHistory.length === 0) {
      return;
    }
    const redoStrokes = redoHistory[redoHistory.length - 1];
    setUndoHistory([...undoHistory, redoStrokes]);
    setRedoHistory(redoHistory.slice(0, -1));
    setRedoFlag(!redoFlag);
  };

  const redraw = () => {
    clearCanvas();
    strokes.forEach((stroke) => {
      stroke.points.forEach((point, index) => {
        if (index === 0) {
          contextRef.current.beginPath();
          contextRef.current.moveTo(point.x, point.y);
        } else {
          contextRef.current.lineTo(point.x, point.y);
        }
      });
      contextRef.current.stroke();
      contextRef.current.closePath();
    });
  };

  const clearCanvas = (redraw = true) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = pattern;
    context.fillRect(0, 0, canvas.width, canvas.height);

    if (!redraw) {
      setUndoHistory([
        ...undoHistory,
        { action: "Remove", strokes: [...strokes] },
      ]);
      setRedoHistory([]);
      setStrokes([]);
      setIsActive(true);
      clearTimeout(tokenRefreshTimeout);
      setTokenRequestFlag(!tokenRequestFlag);
    }
    setRenderLatexFlag(!renderLatexFlag);
  };

  useEffect(() => {
    if (mathpixContext !== null) {
      if (strokes.length > 0) {
        getLatexTimedOut(API_REQUEST_TIMEOUT);
      } else {
        clearTimeout(renderLatexTimeout);
        setLatex({
          code: "Draw your math below",
          isPlaceholder: true,
        });
      }
    } else if (!isActive) {
      setLatex({
        code: "Session expired due to inactivity. Draw to start new session.",
        isPlaceholder: true,
      });
    } else {
      setLatex({
        code: "Connecting to Mathpix...",
        isPlaceholder: true,
      });
    }
  }, [renderLatexFlag]);

  const getLatexTimedOut = (time) => {
    clearTimeout(renderLatexTimeout);
    setRenderLatexTimeout(
      setTimeout(async () => {
        const response = await getLatex(mathpixContext, strokes);
        if (!response?.data?.error) {
          if (response?.data?.latex_styled) {
            setLatex({
              code: response.data.latex_styled,
              isPlaceholder: false,
            });
          } else {
            setLatex({
              code: response?.data?.text,
              isPlaceholder: false,
            });
            console.log("API TEXT: ", response);
          }
        } else {
          console.log("API Error: ", response.data.error);
        }
      }, time)
    );
  };

  return (
    <CanvasContext.Provider
      value={{
        canvasRef,
        contextRef,
        strokes,
        undoHistory,
        redoHistory,
        mathpixContext,
        latex,
        prepareCanvas,
        startDrawing,
        finishDrawing,
        leaveCanvas,
        clearCanvas,
        draw,
        undo,
        redo,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};

export const useCanvas = () => useContext(CanvasContext);
