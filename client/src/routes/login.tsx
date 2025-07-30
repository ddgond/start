import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import { useUser } from "@/hooks/useUser";
import { Link, useNavigate } from "@tanstack/react-router";
import { MainLayout } from "@/layouts/mainLayout";
import { createFileRoute } from "@tanstack/react-router";
import { useLogin } from "@/hooks/useLogin";
import { getPageTitle } from "@/lib/config";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [{ title: getPageTitle("Login") }],
  }),
  component: LoginPage,
  validateSearch: z.object({
    redirect: z.string().optional(),
  }),
});

const formSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

function LoginForm() {
  const { mutate: login } = useLogin();
  const user = useUser();
  const navigate = useNavigate();
  const { redirect } = Route.useSearch();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(formSchema),
  });

  if (user) {
    navigate({ to: redirect ?? "/", replace: true });
  }

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    login(data, {
      onSuccess: () => {
        navigate({ to: redirect ?? "/", replace: true });
      },
    });
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 gap-4 w-96">
      <div className="text-2xl font-bold">Welcome back!</div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 w-full"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input id="email" placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    id="password"
                    placeholder="Password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="">
            Login
          </Button>
        </form>
      </Form>
      <div className="text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Link
          to="/register"
          search={{ redirect }}
          className="text-primary font-semibold"
        >
          Register
        </Link>
      </div>
    </div>
  );
}

function LoginPage() {
  return (
    <MainLayout fullscreen>
      <div className="flex flex-col items-center justify-center flex-1 bg-muted">
        <div className="border border-border rounded-xl p-4 bg-background">
          <LoginForm />
        </div>
      </div>
    </MainLayout>
  );
}
