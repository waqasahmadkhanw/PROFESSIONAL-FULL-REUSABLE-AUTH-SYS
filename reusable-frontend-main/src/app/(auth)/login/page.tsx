import { Suspense } from "react";
import { LoginPage } from "@/modules/auth";

// LoginPage reads the ?callbackUrl= query param via useSearchParams(),
// which Next.js requires to be wrapped in a Suspense boundary or the
// route loses static optimization / can fail the production build.
export default function Page() {
  return (
    <Suspense fallback={null}>
      <LoginPage />
    </Suspense>
  );
}
