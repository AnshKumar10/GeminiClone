import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useCountries } from "../../hooks/useCountry";
import { useStore } from "../../store/useStore";

const phoneSchema = z.object({
  countryCode: z.string().min(1, "Please select a country"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be less than 15 digits")
    .regex(/^\d+$/, "Phone number must contain only digits"),
});

type PhoneFormData = z.infer<typeof phoneSchema>;

const otpSchema = z.object({
  otp: z
    .string()
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d+$/, "OTP must contain only digits"),
});

type OtpFormData = z.infer<typeof otpSchema>;

const AuthForm: React.FC = () => {
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useStore();
  const { countries, isLoading: countriesLoading } = useCountries();
  const [phoneData, setPhoneData] = useState<PhoneFormData>({
    countryCode: "",
    phone: "",
  });

  const phoneForm = useForm<PhoneFormData>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      countryCode: "",
      phone: "",
    },
  });

  const otpForm = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  useEffect(() => {
    setPhoneData(phoneForm.getValues());
  }, [phoneForm.formState.isSubmitSuccessful]);

  const sendOtp = async () => {
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setOtpSent(true);
    setIsLoading(false);
    toast.success("OTP sent successfully!");
  };

  const verifyOtp = async (data: OtpFormData) => {
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Simple OTP validation (in real app, this would be server-side)
    if (data.otp === "123456") {
      const userData = {
        id: Date.now().toString(),
        phone: `${phoneData.countryCode}${phoneData.phone}`,
        countryCode: phoneData.countryCode,
      };

      setUser(userData);
      toast.success("Login successful!");
    } else {
      toast.error("Invalid OTP. Please try again.");
    }

    setIsLoading(false);
  };

  const resendOtp = async () => {
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsLoading(false);
    toast.success("OTP resent successfully!");
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Welcome to Gemini Chat
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {otpSent
            ? "Enter the OTP sent to your phone"
            : "Enter your phone number to get started"}
        </p>
      </div>

      {!otpSent ? (
        <form onSubmit={phoneForm.handleSubmit(sendOtp)} className="space-y-4">
          <div>
            <label
              htmlFor="country"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Country
            </label>
            <select
              id="country"
              {...phoneForm.register("countryCode")}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              aria-describedby="country-error"
            >
              <option value="">Select Country</option>
              {countries.map((country) => (
                <option
                  key={country.cca2}
                  value={country.idd.root + (country.idd.suffixes?.[0] || "")}
                >
                  {country.flag} {country.name.common} ({country.idd.root}
                  {country.idd.suffixes?.[0] || ""})
                </option>
              ))}
            </select>
            {phoneForm.formState.errors.countryCode && (
              <p
                id="country-error"
                className="mt-1 text-sm text-red-600 dark:text-red-400"
                role="alert"
              >
                {phoneForm.formState.errors.countryCode.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              {...phoneForm.register("phone")}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Enter your phone number"
              aria-describedby="phone-error"
            />
            {phoneForm.formState.errors.phone && (
              <p
                id="phone-error"
                className="mt-1 text-sm text-red-600 dark:text-red-400"
                role="alert"
              >
                {phoneForm.formState.errors.phone.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || countriesLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>
      ) : (
        <form onSubmit={otpForm.handleSubmit(verifyOtp)} className="space-y-4">
          <div>
            <label
              htmlFor="otp"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Enter OTP
            </label>
            <input
              id="otp"
              type="text"
              {...otpForm.register("otp")}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-center text-lg tracking-widest"
              placeholder="123456"
              maxLength={6}
              aria-describedby="otp-error otp-hint"
            />
            <p
              id="otp-hint"
              className="mt-1 text-xs text-gray-500 dark:text-gray-400"
            >
              For demo purposes, use: 123456
            </p>
            {otpForm.formState.errors.otp && (
              <p
                id="otp-error"
                className="mt-1 text-sm text-red-600 dark:text-red-400"
                role="alert"
              >
                {otpForm.formState.errors.otp.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? "Verifying..." : "Verify OTP"}
          </button>

          <button
            type="button"
            onClick={resendOtp}
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Resend OTP
          </button>

          <button
            type="button"
            onClick={() => {
              setOtpSent(false);
              otpForm.reset();
            }}
            className="w-full text-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 focus:outline-none focus:underline"
          >
            Change phone number
          </button>
        </form>
      )}
    </div>
  );
};

export default AuthForm;
