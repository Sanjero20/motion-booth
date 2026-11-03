import { Logo } from "@/components/shared/Logo";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SignupForm from "@/features/auth/components/SignupForm";

function SignupPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 p-4">
      <Logo />

      <Card className="w-full sm:w-125">
        <CardHeader className="text-center">
          <CardTitle>Create your account</CardTitle>
          <CardDescription>
            Enter your email to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignupForm />
        </CardContent>
      </Card>
    </div>
  );
}

export default SignupPage;
