import { Outlet } from "react-router";
import AuthenticatedHeader from "@/components/shared/AuthenticatedHeader";
import Footer from "@/components/shared/Footer";

function PrivateLayout() {
  return (
    <div className="bg-background flex min-h-screen w-full flex-col">
      <AuthenticatedHeader />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-4 lg:px-0">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default PrivateLayout;
