import { useState, useRef, useEffect } from "react";
import { Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const OTP_LENGTH = 6;

export default function VerifyOTP() {
  const [otp, setOtp] = useState(["2", "4", "8", "7", "1", "3"]);
  const [timer, setTimer] = useState(45);
  const [canResend, setCanResend] = useState(false);
  const inputsRef = useRef([]);

  useEffect(() => {
    if (timer <= 0) {
      setCanResend(true);
      return;
    }
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").slice(0, OTP_LENGTH);
    if (/^\d+$/.test(pasted)) {
      setOtp(pasted.split("").concat(Array(OTP_LENGTH).fill("")).slice(0, OTP_LENGTH));
    }
    e.preventDefault();
  };

  const handleResend = () => {
    setTimer(45);
    setCanResend(false);
    setOtp(Array(OTP_LENGTH).fill(""));
    inputsRef.current[0]?.focus();
  };

  const formatTime = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const handleVerify = (e) => {
    e.preventDefault();
    alert("OTP Verified: " + otp.join(""));
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Back link */}
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-8 transition-colors"
        >
          <ArrowLeft size={15} />
          Back to Sign In
        </button>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Verify Your OTP
        </h1>
        <p className="text-gray-500 text-sm mb-6 leading-relaxed">
          We've sent a 6-digit verification code to your email address.
        </p>

        {/* Email badge */}
        <div className="flex items-center gap-2 mb-8">
          <Mail size={15} className="text-gray-400" />
          <span className="text-sm text-gray-700 font-medium">
            johndoe@email.com
          </span>
          <button className="text-sm text-red-500 hover:text-red-600 font-medium transition-colors ml-1">
            Change
          </button>
        </div>

        <form onSubmit={handleVerify} className="space-y-6">
          {/* OTP label */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">
              Enter 6-digit code
            </p>

            {/* OTP inputs */}
            <div className="flex gap-3" onPaste={handlePaste}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => (inputsRef.current[i] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className="w-12 h-12 text-center text-lg font-semibold border border-gray-200 rounded-lg focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all bg-white text-gray-900 caret-gray-900"
                />
              ))}
            </div>
          </div>

          {/* Resend */}
          <p className="text-sm text-gray-500">
            Didn't receive the code?{" "}
            {canResend ? (
              <button
                type="button"
                onClick={handleResend}
                className="text-red-500 hover:text-red-600 font-medium transition-colors"
              >
                Resend
              </button>
            ) : (
              <>
                <span className="text-red-400 font-medium">Resend</span>
                <span> in {formatTime(timer)}</span>
              </>
            )}
          </p>

          <Button
            type="submit"
            className="w-full h-11 bg-gray-900 hover:bg-gray-700 text-white font-medium rounded-lg text-sm transition-colors"
            disabled={otp.some((d) => !d)}
          >
            Verify OTP
          </Button>
        </form>
      </div>
    </div>
  );
}
