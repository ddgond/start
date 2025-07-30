import { createRootRoute, HeadContent, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Toaster } from "@/components/ui/sonner";
import { NotFoundComponent } from "@/components/NotFoundComponent";
import { MainLayout } from "@/layouts/mainLayout";
import { SITE_NAME } from "@/lib/config";

export const Route = createRootRoute({
  head: () => ({
    meta: [{ title: SITE_NAME }],
  }),

  component: () => (
    <>
      <HeadContent />
      <Outlet />
      <TanStackRouterDevtools />
      <Toaster />
    </>
  ),
  notFoundComponent: () => (
    <MainLayout>
      <NotFoundComponent />
    </MainLayout>
  ),
});
