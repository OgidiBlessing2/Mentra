import { SignIn } from "@clerk/clerk-react";
import AuthLayout from "../../auth/AuthLayout";

export default function SignInPage() {
  return (
    <AuthLayout>
    <SignIn
    routing="path"
    path="/sign-in"
    signUpUrl="/sign-up"
    afterSignInUrl="/dashboard"
/>
    </AuthLayout>
  );
}