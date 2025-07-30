import { Link, useCanGoBack, useRouter } from "@tanstack/react-router";

export function NotFoundComponent() {
  const router = useRouter();
  const canGoBack = useCanGoBack();

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 p-4 text-center">
      <div className="text-[8rem] md:text-[12rem] leading-none font-extrabold tracking-tighter">
        404
      </div>

      <div className="flex flex-col gap-2 max-w-prose">
        <h1 className="text-3xl md:text-4xl font-semibold">Page not found</h1>
        <p className="text-muted-foreground text-lg md:text-xl">
          Oops! The page you're looking for doesn't exist.
        </p>
      </div>

      <div className="flex flex-row gap-4 mt-2">
        <Link
          to="/"
          className="border border-gray-300 rounded-md p-2 hover:bg-gray-100"
        >
          Take me home
        </Link>
        {canGoBack && (
          <div
            onClick={() => router.history.back()}
            className="cursor-pointer border border-gray-300 rounded-md p-2 hover:bg-gray-100"
          >
            Go back
          </div>
        )}
      </div>
    </div>
  );
}
