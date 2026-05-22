"use client";

import { paragraphs } from "@/lib/paragraph";
import { useEffect, useState } from "react";

export default function Home() {
  const [text, setText] = useState<string>("");
  const [input, setInput] = useState<string>("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [running, setRunning] = useState<boolean>(false);
  const [wpm, setWpm] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number>(100);

  // Fetch text from free API
const fetchText = (): void => {
  const random = paragraphs[Math.floor(Math.random() * paragraphs.length)];

  setText(random);
};
  useEffect(() => {
    fetchText();
  }, []);

  // Timer logic
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;

    if (running && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((t) => t - 1);
      }, 1000);
    }

    if (timeLeft === 0) {
      setRunning(false);
      calculateStats(input);
    }

    return () => clearInterval(timer);
  }, [running, timeLeft]);

  // Handle typing
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;

    if (!running) {
      setRunning(true);
      setStartTime(Date.now());
    }

    setInput(value);
    calculateStats(value);
  };

  // Calculate WPM + Accuracy
  const calculateStats = (value: string): void => {
    if (!startTime) return;

    const timeMinutes = (Date.now() - startTime) / 1000 / 60;

    const words = value.length / 5;
    const currentWpm = timeMinutes > 0 ? Math.round(words / timeMinutes) : 0;

    let correct = 0;

    for (let i = 0; i < value.length; i++) {
      if (value[i] === text[i]) correct++;
    }

    const acc =
      value.length > 0 ? Math.round((correct / value.length) * 100) : 100;

    setWpm(currentWpm);
    setAccuracy(acc);
  };

  // Restart test
  const restart = (): void => {
    setInput("");
    setTimeLeft(60);
    setRunning(false);
    setWpm(0);
    setAccuracy(100);
    setStartTime(null);
    fetchText();
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center px-6 py-10">
      {/* Title */}
      <h1 className="text-4xl font-bold mb-8 tracking-wide">Typing Test</h1>

      {/* Stats */}
      <div className="flex gap-8 mb-8 text-lg bg-[#1e293b] px-6 py-3 rounded-xl shadow-md">
        <p className="text-green-400 font-semibold">WPM: {wpm}</p>
        <p className="text-yellow-400 font-semibold">Accuracy: {accuracy}%</p>
        <p className="text-blue-400 font-semibold">Time: {timeLeft}s</p>
      </div>

      {/* Text Box */}
      <div className="bg-[#111827] border border-gray-700 p-6 rounded-2xl w-full max-w-3xl mb-6 text-lg leading-relaxed shadow-lg">
        <p className="text-gray-300 select-none">{text}</p>
      </div>

      {/* Input Box */}
      <textarea
        className="w-full max-w-3xl p-4 text-white bg-[#1f2937] border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
        rows={5}
        value={input}
        onChange={handleChange}
        placeholder="Start typing here..."
      />

      {/* Restart Button */}
      <button
        onClick={restart}
        className="mt-6 bg-blue-600 hover:bg-blue-500 transition px-8 py-3 rounded-xl font-semibold shadow-md"
      >
        Restart Test
      </button>
    </div>
  );
}
