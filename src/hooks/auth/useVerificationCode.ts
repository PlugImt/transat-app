import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/apiRequest";

interface VerifyCodeParams {
  email: string;
  verification_code: string;
}

export const useVerificationCode = () => {
  const verifyMutation = useMutation({
    mutationFn: async ({ email, verification_code }: VerifyCodeParams) => {
      return await apiRequest<{ token: string }>(
        "/auth/verify-account",
        "POST",
        { email, verification_code },
        true,
      );
    },
  });

  const resendCodeMutation = useMutation({
    mutationFn: async (email: string) => {
      return await apiRequest(
        "/auth/verification-code",
        "POST",
        { email },
        true,
      );
    },
  });

  return {
    verifyCode: verifyMutation.mutateAsync,
    resendCode: resendCodeMutation.mutate,
    isVerifying: verifyMutation.isPending,
    isResending: resendCodeMutation.isPending,
    verifyError: verifyMutation.error,
    resendError: resendCodeMutation.error,
  };
};
