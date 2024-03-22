"use client";
import React, { useRef, useEffect, useState } from "react";

function getRandomRGBColor(limit = 256) {
  //十六进制颜色随机
  const r = Math.floor(Math.random() * limit);
  const g = Math.floor(Math.random() * limit);
  const b = Math.floor(Math.random() * limit);

  const color = `rgb(${r},${g},${b})`;
  return color;
}

const GroupBoard = ({ rows, cols, size, gap }) =>
  // : {
  //   rows: number,
  //   cols: number,
  //   size: number,
  //   gap: number,
  // }
  {
    const canvasRef = useRef(null);
    const [context, setContext] = useState(null);
    const [seatStatus, setSeatStatus] = useState(
      new Array(rows)
        .fill(null)
        .map(() =>
          new Array(cols).fill({ isSet: false, color: "#ccc", price: 0 })
        )
    );
    const [elements, setElements] = useState([]);
    const [drawing, setDrawing] = useState(false);
    const [color, setColor] = useState("#f00");
    const [price, setPrice] = useState(0);

    const draw = (context) => {
      context.clearRect(0, 0, context.canvas.width, context.canvas.height);

      seatStatus.map((cols, row) => {
        cols.map((item, col) => {
          const x = col * (gap + size) + gap;
          const y = row * (gap + size) + gap;
          context.fillStyle = item.isSet ? item.color : "#ccc";
          context.fillRect(x, y, size, size);
          if (item.isSet) {
            console.log("row,col,item :>>", row, col, item);
          }
        });
      });
    };

    const drag = (context, element) => {
      draw(context);
      context.beginPath();
      const { startX, startY, endX, endY } = element;
      context.moveTo(startX, startY);
      context.lineTo(endX, startY);
      context.lineTo(endX, endY);
      context.lineTo(startX, endY);
      context.lineTo(startX, startY);
      context.strokeStyle = "#000";
      context.stroke();
    };

    useEffect(() => {
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        canvas.width = cols * (gap + size) + gap;
        canvas.height = rows * (gap + size) + gap;
        const context = canvas.getContext("2d");
        setContext(context);
        draw(context);
      }
    }, []);

    useEffect(() => {
      if (context) {
        draw(context);
      }
    }, [seatStatus]);

    useEffect(() => {
      if (context) {
        elements.forEach((element) => drag(context, element));
      }
    }, [elements]);

    const handleMouseDown = (event) => {
      setDrawing(true);

      const clientX = event.nativeEvent.offsetX;
      const clientY = event.nativeEvent.offsetY;

      // const element = createElement(clientX, clientY, clientX, clientY);

      setElements((prev) => [
        ...prev,
        { startX: clientX, startY: clientY, endX: clientX, endY: clientY },
      ]);
    };

    const handleMouseMove = (event) => {
      if (!drawing) return;

      const clientX = event.nativeEvent.offsetX;
      const clientY = event.nativeEvent.offsetY;

      const index = elements.length - 1;

      // const { startX, start } = elements[index] ?? {};

      // const updateElement = createElement(x1, y1, clientX, clientY);

      const elementsCopy = [...elements];
      elementsCopy[index] = {
        ...elementsCopy[index],
        endX: clientX,
        endY: clientY,
      };
      setElements(elementsCopy);
    };

    const handleMouseUp = () => {
      setDrawing(false);

      const index = elements.length - 1;

      const { startX, startY, endX, endY } = elements[index] ?? {};

      const startCol = Math.min(
        Math.floor(startX / (gap + size)),
        Math.floor(endX / (gap + size))
      );
      const startRow = Math.min(
        Math.floor(startY / (gap + size)),
        Math.floor(endY / (gap + size))
      );
      const endCol = Math.max(
        Math.floor(startX / (gap + size)),
        Math.floor(endX / (gap + size))
      );
      const endRow = Math.max(
        Math.floor(startY / (gap + size)),
        Math.floor(endY / (gap + size))
      );

      for (let row = startRow; row <= endRow; row++) {
        for (let col = startCol; col <= endCol; col++) {
          updateSeat(row, col);
        }
      }

      setElements([]);
    };

    const updateSeat = (row, col) => {
      const newSeatStatus = [...seatStatus];
      newSeatStatus[row][col] = {
        ...newSeatStatus[row][col],
        color: color,
        isSet: !newSeatStatus[row][col].isSet,
      };
      setSeatStatus(newSeatStatus);
    };

    const handleSubmit = () => {
      event.preventDefault();
      seatStatus.map((cols, row) => {
        cols.map((item, col) => {
          if (item.isSet && item.color === color) {
            const newSeatStatus = [...seatStatus];
            newSeatStatus[row][col] = {
              ...newSeatStatus[row][col],
              price: price,
            };
            setSeatStatus(newSeatStatus);
          }
        });
      });

      setColor(getRandomRGBColor());
    };

    return (
      <div>
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseOut={handleMouseUp}
          className="border border-gray-400"
        />
        {/* <div className="flex justify-center my-4">
        <input type="number" className="" />
        <button
          className="bg-blue-400 text-white px-4 py-2 mr-2"
          onClick={handleButtonClick}
        >
          OK
        </button>
      </div> */}
        {/* <form className="flex justify-center my-4" onSubmit={handleSubmit}>
        <input
          type="text"
          name="price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className=" px-4 py-2"
        />
        <input
          type="submit"
          value="Submit"
          className="bg-blue-400 text-white px-4 py-2 mr-2"
        />
      </form> */}
        <form className="flex justify-center" onSubmit={handleSubmit}>
          <div className="mt-2 flex rounded-md shadow-sm">
            <div className="relative flex flex-grow items-stretch focus-within:z-10">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="text"
                name="price"
                id="price"
                className="block w-full rounded-none rounded-l-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                value={price === 0 ? "" : price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
              />
            </div>
            <button
              type="submit"
              className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              OK
            </button>
          </div>
        </form>
      </div>
    );
  };

export default GroupBoard;
