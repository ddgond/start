import { useUser } from "@/hooks/useUser";
import { MainLayout } from "@/layouts/mainLayout";
import { PageLoading } from "@/components/PageLoading";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { NotFoundComponent } from "@/components/NotFoundComponent";
import { getPageTitle } from "@/lib/config";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: getPageTitle("Admin") }],
  }),
  component: AdminPage,
});

function AdminContent() {
  const user = useUser();

  if (!user || !user.isAdmin) {
    return <NotFoundComponent />;
  }

  return (
    <div className="flex flex-col w-full items-center">
      <div className="text-2xl font-bold">Admin</div>
      <div className="text-sm text-muted-foreground">
        Logged in as <span className="font-bold">{user.email}</span> with admin
        privileges
      </div>
    </div>
  );
}

function AdminPage() {
  return (
    <MainLayout>
      <Suspense fallback={<PageLoading />}>
        <AdminContent />
      </Suspense>
    </MainLayout>
  );
}
