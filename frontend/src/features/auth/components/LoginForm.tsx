import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { useLogin } from "../hooks/useLogin";
import { useState } from "react";

function LoginForm() {
  const navigate = useNavigate();
  const mutation = useLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    mutation.mutate(
      {
        email,
        password,
      },
      {
        onSuccess: () => {
          navigate("/dashboard", { replace: true });
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Link
              to="#"
              className="ml-auto hidden text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
        </Field>

        <Field>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Logging in..." : "Login"}
          </Button>

          <FieldDescription className="text-center">
            Don&apos;t have an account? <Link to="/signup">Sign up</Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}

export default LoginForm;
