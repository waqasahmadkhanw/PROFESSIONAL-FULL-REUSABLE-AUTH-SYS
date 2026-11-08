import { Suspense } from "react";
import { VerifyEmailPage } from "@/modules/auth/pages";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailPage />
    </Suspense>
  );
}
