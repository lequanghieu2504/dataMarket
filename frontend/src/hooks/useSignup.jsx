import { useMutation, useQueryClient } from "@tanstack/react-query";
import { mockAuthService } from "../services/mockAuthService";
import { useNavigate } from "react-router-dom";

const useSignup = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    mutate: signupMutation,
    isPending,
    error,
  } = useMutation({
    mutationFn: mockAuthService.register,
    onSuccess: (data) => {
      queryClient.setQueryData(["authUser"], data);
      navigate("/dashboard");
    },
    onError: (err) => {
      console.error("Signup error:", err);
    },
  });

  return {
    signupMutation,
    isPending,
    error,
  };
};

export default useSignup;

