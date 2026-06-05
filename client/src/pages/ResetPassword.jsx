import { useState } from "react";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function getStrength(password) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"];
const strengthColors = ["", "bg-red-400", "bg-yellow-400", "bg-blue-400", "bg-green-500"];
const strengthTextColors = ["", "text-red-500", "text-yellow-500", "text-blue-500", "text-green-600"];

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("••••••••••");
  const [confirmPassword, setConfirmPassword] = useState("••••••••••");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const strength = getStrength(newPassword === "••••••••••" ? "" : newPassword);
  const passwordsMatch = newPassword === confirmPassword;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!passwordsMatch) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center py-12">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Password Reset!</h2>
          <p className="text-sm text-gray-500 mb-6">Your password has been changed successfully.</p>
          <Button
            onClick={() => window.location.href = "/signin"}
            className="bg-gray-900 hover:bg-gray-700 text-white px-8 h-11 rounded-lg text-sm"
          >
            Back to Sign In
          </Button>
        </div>
      </div>
    );
  }

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
          Reset Password
        </h1>
        <p className="text-gray-500 text-sm mb-8 leading-relaxed">
          Your new password must be different from previously used passwords.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* New Password */}
          <div className="space-y-1.5">
            <Label
              htmlFor="new-password"
              className="text-sm font-medium text-gray-700"
            >
              New Password
            </Label>
            <div className="relative">
              <Input
                id="new-password"
                type={showNew ? "text" : "password"}
                value={newPassword}
                onFocus={() => newPassword === "••••••••••" && setNewPassword("")}
                onChange={(e) => setNewPassword(e.target.value)}
                className="pr-10 h-11 border-gray-200 focus-visible:ring-gray-900 focus-visible:ring-1 focus-visible:ring-offset-0 rounded-lg text-sm"
                placeholder="Enter new password"
                required
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Strength meter */}
            {newPassword && newPassword !== "••••••••••" && (
              <div className="space-y-1.5 pt-1">
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                        strength >= level
                          ? strengthColors[strength]
                          : "bg-gray-100"
                      }`}
                    />
                  ))}
                </div>
                <p className={`text-xs font-medium ${strengthTextColors[strength]}`}>
                  {strengthLabels[strength]}
                </p>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <Label
              htmlFor="confirm-password"
              className="text-sm font-medium text-gray-700"
            >
              Confirm New Password
            </Label>
            <div className="relative">
              <Input
                id="confirm-password"
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onFocus={() => confirmPassword === "••••••••••" && setConfirmPassword("")}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`pr-10 h-11 border-gray-200 focus-visible:ring-1 focus-visible:ring-offset-0 rounded-lg text-sm ${
                  confirmPassword && !passwordsMatch
                    ? "border-red-300 focus-visible:ring-red-400"
                    : "focus-visible:ring-gray-900"
                }`}
                placeholder="Confirm new password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {confirmPassword && !passwordsMatch && (
              <p className="text-xs text-red-500">Passwords do not match.</p>
            )}
          </div>

          <div className="pt-1">
            <Button
              type="submit"
              className="w-full h-11 bg-gray-900 hover:bg-gray-700 text-white font-medium rounded-lg text-sm transition-colors"
              disabled={!newPassword || !confirmPassword || !passwordsMatch}
            >
              Reset Password
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
