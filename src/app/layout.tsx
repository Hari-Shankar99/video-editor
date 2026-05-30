"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { useState, useEffect, useRef } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const count = 3;

export default function RootLayout() {
  const [stack, setStack] = useState<number[]>([]);
  const [rewind, setRewind] = useState<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (stack.length === count) {
      setRewind(true);
    }
    if (rewind && stack.length > 0) {
      const stackClone = [...stack];
      timeoutRef.current = setTimeout(() => {
        setStack(stackClone.slice(0, -1));
      }, 1000);
    }
    if (stack.length === 0) {
      setRewind(false);
    }
    return ()=>{
      if(!timeoutRef.current){
        return 
      }
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null
    }
  }, [rewind, stack]);

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen w-full bg-gray-100">
        <div className="flex h-screen w-full flex-col items-center justify-center gap-8">
          {[...Array(count).keys()].map((n) => (
            <Square
              key={n.toString()}
              isActive={
                stack.findIndex((item) => {
                  return item === n;
                }) !== -1
              }
              item={n as number}
              onClick={() => {
                if (rewind) {
                  return;
                }
                setStack([...stack, n]);
              }}
            />
          ))}
        </div>
      </body>
    </html>
  );
}

const Square = ({
  item,
  onClick,
  isActive,
}: {
  item: number;
  onClick: () => void;
  isActive: boolean;
}) => {
  // Adjusted: use Tailwind spacing utilities to ensure visibility and spacing.
  // Assign fixed width and height, set background color.
  const marginStyle = item !== 1 ? "ml-48 my-2" : "my-2"; // Tailwind examples: ml-12 = margin-left:3rem, my-2 = margin-y:0.5rem
  const bgColorStyle = isActive ? "bg-blue-500" : "bg-white";
  return (
    <div
      onClick={onClick}
      className={`h-32 w-32 border-2 border-black shadow ${marginStyle} flex items-center justify-center ${bgColorStyle}`}
    >
      <span className="font-mono text-lg text-black">{item + 1}</span>
    </div>
  );
};
