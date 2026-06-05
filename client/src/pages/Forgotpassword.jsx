import { useState } from "react";
import { Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPassword() {
  const [email, setEmail] = useState("johndoe@email.com");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
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
          Forgot Password?
        </h1>
        <p className="text-gray-500 text-sm mb-8 leading-relaxed">
          No worries! Enter your email address and we'll send you a link to
          reset your password.
        </p>

        {/* Form */}
        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email Address
              </Label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 h-11 border-gray-200 focus-visible:ring-gray-900 focus-visible:ring-1 focus-visible:ring-offset-0 rounded-lg text-sm"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-gray-900 hover:bg-gray-700 text-white font-medium rounded-lg text-sm transition-colors"
            >
              Send Reset Link
            </Button>
          </form>
        ) : (
          <div className="text-center py-8">
            <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail size={24} className="text-green-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Check your email
            </h2>
            <p className="text-sm text-gray-500">
              We've sent a reset link to{" "}
              <span className="font-medium text-gray-800">{email}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
