import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useCountries } from "../../hooks/useCountry";
import { useStore } from "../../store/useStore";
import { FormField } from "./FormField";
import { SelectField } from "./SelectField";
import { InputField } from "./InputField";
import { Button } from "../Button";

const phoneSchema = z.object({
  countryCode: z.string().min(1, "Please select a country"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be less than 15 digits")
    .regex(/^\d+$/, "Phone number must contain only digits"),
});

const otpSchema = z.object({
  otp: z
    .string()
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d+$/, "OTP must contain only digits"),
});

type PhoneFormData = z.infer<typeof phoneSchema>;
type OtpFormData = z.infer<typeof otpSchema>;

interface FormHeaderProps {
  title: string;
  subtitle: string;
}

const FormHeader: React.FC<FormHeaderProps> = ({ title, subtitle }) => (
  <div className="text-center space-y-2 mb-6">
    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
      {title}
    </h1>
    <p className="text-base text-slate-600 dark:text-slate-400">{subtitle}</p>
  </div>
);

const AuthenticationForm: React.FC = () => {
  const [isOtpStage, setIsOtpStage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useStore();
  const { countries, isLoading: countriesLoading } = useCountries();
  const [phoneData, setPhoneData] = useState<PhoneFormData>({
    countryCode: "",
    phone: "",
  });

  const phoneForm = useForm<PhoneFormData>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { countryCode: "", phone: "" },
  });

  const otpForm = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  useEffect(() => {
    if (phoneForm.formState.isSubmitSuccessful) {
      setPhoneData(phoneForm.getValues());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phoneForm.formState.isSubmitSuccessful]);

  const handleSendOtp = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setIsOtpStage(true);
      toast.success("OTP sent successfully!");
    } catch {
      toast.error("Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (data: OtpFormData) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
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
    } catch {
      toast.error("Verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("OTP resent successfully!");
    } catch {
      toast.error("Failed to resend OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6 md:p-8 transition-colors">
        <FormHeader
          title="Welcome to Gemini Chat"
          subtitle={
            isOtpStage
              ? "Enter the OTP sent to your phone"
              : "Enter your phone number to get started"
          }
        />

        {!isOtpStage ? (
          <form className="space-y-6 mt-6">
            {/* Country Selection */}
            <FormField
              label="Country"
              id="country"
              error={phoneForm.formState.errors.countryCode?.message}
            >
              <SelectField
                id="country"
                register={phoneForm.register("countryCode")}
                error={phoneForm.formState.errors.countryCode?.message}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm !text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              </SelectField>
            </FormField>

            {/* Phone Input */}
            <FormField
              label="Phone Number"
              id="phone"
              error={phoneForm.formState.errors.phone?.message}
            >
              <InputField
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                register={phoneForm.register("phone")}
                error={phoneForm.formState.errors.phone?.message}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm !text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </FormField>

            {/* Send OTP Button */}
            <Button
              type="button"
              variant="primary"
              size="lg"
              disabled={isLoading || countriesLoading}
              loading={isLoading}
              className="w-full mt-2"
              onClick={phoneForm.handleSubmit(handleSendOtp)}
            >
              {isLoading ? "Sending OTP..." : "Send OTP"}
            </Button>
          </form>
        ) : (
          <form className="space-y-6 mt-6">
            {/* OTP Field */}
            <FormField
              label="Enter OTP"
              id="otp"
              error={otpForm.formState.errors.otp?.message}
            >
              <InputField
                id="otp"
                type="text"
                placeholder="123456"
                maxLength={6}
                className="text-center text-xl tracking-[0.4em] font-mono bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-3 !text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                register={otpForm.register("otp")}
                error={otpForm.formState.errors.otp?.message}
              />
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 text-center">
                For demo purposes, use:{" "}
                <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">
                  123456
                </span>
              </p>
            </FormField>

            {/* OTP Buttons */}
            <div className="space-y-3">
              <Button
                type="button"
                variant="primary"
                size="lg"
                disabled={isLoading}
                loading={isLoading}
                className="w-full"
                onClick={otpForm.handleSubmit(handleVerifyOtp)}
              >
                {isLoading ? "Verifying..." : "Verify OTP"}
              </Button>

              <Button
                type="button"
                variant="secondary"
                size="lg"
                disabled={isLoading}
                onClick={handleResendOtp}
                className="w-full"
              >
                Resend OTP
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthenticationForm;
