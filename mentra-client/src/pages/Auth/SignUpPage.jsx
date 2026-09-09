import { SignUp } from "@clerk/clerk-react";
import AuthLayout from "../../auth/AuthLayout";

export default function SignUpPage() {
  return (
    <AuthLayout>
    <SignUp
    routing="path"
    path="/sign-up"
    signInUrl="/sign-in"
/>
    </AuthLayout>
  );
}