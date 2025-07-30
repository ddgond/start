import type { User } from "@/domain/User";
import { useUser } from "@/hooks/useUser";
import { MainLayout } from "@/layouts/mainLayout";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function LandingComponent() {
  return (
    <div className="flex flex-col w-full items-center">
      <div className="text-2xl font-bold">Home</div>
      <div className="text-sm text-muted-foreground">Not logged in</div>
    </div>
  );
}

function FallbackDashboard() {
  return (
    <div className="flex flex-col w-full items-center">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  );
}

function Dashboard({ user }: { user: User }) {
  return (
    <div className="flex flex-col w-full items-center">
      <div className="text-2xl font-bold">Home</div>
      <div className="text-sm text-muted-foreground">
        Logged in as <span className="font-bold">{user.email}</span>
      </div>
    </div>
  );
}

function HomePage() {
  const user = useUser();
  const isLoggedIn = !!user;

  return (
    <MainLayout>
      {isLoggedIn ? (
        <Suspense fallback={<FallbackDashboard />}>
          <Dashboard user={user} />
        </Suspense>
      ) : (
        <LandingComponent />
      )}
    </MainLayout>
  );
}
