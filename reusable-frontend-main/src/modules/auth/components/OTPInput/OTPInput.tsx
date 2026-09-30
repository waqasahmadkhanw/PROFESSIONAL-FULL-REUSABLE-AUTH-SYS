"use client";

import { useRef } from "react";

interface OTPInputProps {
  length?: number;
  value?: string;
  error?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
}

export default function OTPInput({
  length = 6,
  value = "",
  error,
  disabled = false,
  onChange,
}: OTPInputProps) {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const otp = value.padEnd(length, "").split("");

  const handleChange = (index: number, inputValue: string) => {
    if (!/^\d?$/.test(inputValue)) return;

    const updated = [...otp];
    updated[index] = inputValue;

    onChange(updated.join("").trimEnd());

    if (inputValue && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (
      event.key === "Backspace" &&
      !otp[index] &&
      index > 0
    ) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-center gap-3">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(element) => {
              inputsRef.current[index] = element;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            disabled={disabled}
            onChange={(event) =>
              handleChange(index, event.target.value)
            }
            onKeyDown={(event) =>
              handleKeyDown(index, event)
            }
            className="h-12 w-12 rounded-lg border text-center text-lg font-semibold outline-none focus:ring-2"
          />
        ))}
      </div>

      {error && (
        <p className="text-center text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}