"use client";

import { useEffect, useState } from "react";
import { Button } from "@/shared/components/ui/Button";

interface ResendOTPButtonProps {
  onResend: () => void | Promise<void>;
  initialCountdown?: number;
  disabled?: boolean;
  className?: string;
}

export default function ResendOTPButton({
  onResend,
  initialCountdown = 60,
  disabled = false,
  className = "",
}: ResendOTPButtonProps) {
  const [countdown, setCountdown] = useState(initialCountdown);

  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  const handleClick = async () => {
    if (countdown > 0 || disabled) return;

    await onResend();
    setCountdown(initialCountdown);
  };

  return (
    <Button
      type="button"
      variant="ghost"
      disabled={disabled || countdown > 0}
      onClick={handleClick}
      className={className}
    >
      {countdown > 0
        ? `Resend OTP in ${countdown}s`
        : "Resend OTP"}
    </Button>
  );
}