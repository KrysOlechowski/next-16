/**
 * Email verification page
 * Shows after sign up, tells user to check email
 */

import Link from "next/link";

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md mx-auto space-y-6 text-center">
        <div className="inline-block p-3 bg-green-100 rounded-full">
          <svg
            className="w-6 h-6 text-green-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        <div>
          <h1 className="text-2xl font-bold">Check your email</h1>
          <p className="text-gray-600 mt-2">
            We've sent a verification link to your email address. Click the link
            to verify your account and complete sign up.
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
          <p className="text-sm text-blue-800">
            <strong>Didn't receive an email?</strong> Check your spam folder or
            try signing up again with the correct email address.
          </p>
        </div>

        <div className="pt-4">
          <Link
            href="/auth/sign-in"
            className="inline-block text-blue-600 hover:underline"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
