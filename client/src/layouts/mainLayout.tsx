import { SITE_NAME } from "@/lib/config";
import { Link, useRouter } from "@tanstack/react-router";
import { useUser } from "@/hooks/useUser";
import { useLogout } from "@/hooks/useLogout";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

function LeftNavbar() {
  return <HomeLink />;
}

function RightNavbar() {
  const user = useUser();
  const isLoggedIn = !!user;
  const { mutate: logout } = useLogout();
  const router = useRouter();
  const currentPath = router.state.location.pathname;

  return (
    <NavigationMenu>
      <NavigationMenuList>
        {isLoggedIn && user.isAdmin && (
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link
                to="/admin"
                className={cn(
                  "transition-colors",
                  currentPath === "/admin"
                    ? "text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Admin
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        )}
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            {isLoggedIn ? (
              <button
                onClick={() => logout()}
                className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                search={{ redirect: currentPath }}
                className={cn(
                  "transition-colors",
                  currentPath === "/login"
                    ? "text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Login
              </Link>
            )}
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function HomeLink({ className, ...props }: React.ComponentProps<typeof Link>) {
  return (
    <Link
      to="/"
      className={cn("flex items-center gap-2", className)}
      {...props}
    >
      <Logo className="h-5 w-5" />
      <div className="font-semibold">{SITE_NAME}</div>
    </Link>
  );
}

export function MainLayout({
  children,
  fullscreen,
}: {
  children: React.ReactNode;
  fullscreen?: boolean;
}) {
  if (fullscreen) {
    return (
      <div className="flex flex-col min-h-screen">
        <Button
          variant="outline"
          size="lg"
          asChild
          className="absolute top-4 left-4"
        >
          <HomeLink />
        </Button>
        {children}
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <nav className="flex justify-between items-center px-4 py-2 border-b border-border">
        <LeftNavbar />
        <Suspense fallback={<Skeleton className="h-8 w-20" />}>
          <RightNavbar />
        </Suspense>
      </nav>
      <div className="flex-1 flex flex-col p-4">{children}</div>
    </div>
  );
}
