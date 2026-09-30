import { Suspense } from "react";
import { ResetPasswordPage } from "@/modules/auth";

// ResetPasswordPage reads the ?token= query param via
// useSearchParams(), which Next.js requires to be wrapped in a
// Suspense boundary.
export default function Page() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordPage />
    </Suspense>
  );
}
