"use client";
import dynamic from "next/dynamic";

const AppsNavbar = dynamic(
  () => import("../layout/AppsNavbar").then((mod) => mod.default),
  {
    ssr: false,
  }
);
const AppsFooter = dynamic(
  () => import("../layout/AppsFooter").then((mod) => mod.default),
  {
    ssr: false,
  }
);
const Providers = dynamic(
  () => import("../providers").then((mod) => mod.default),
  {
    ssr: false,
  }
);
const AccountProvider = dynamic(
  () => import("../../providers/AccountProvider").then((mod) => mod.AccountProvider),
  {
    ssr: false,
  }
);
const RegistrationModal = dynamic(
  () => import("../modals/RegistrationModal").then((mod) => ({ default: mod.RegistrationModal })),
  {
    ssr: false,
  }
);

export default function AppsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <AccountProvider>
        <div className="min-h-screen w-screen flex flex-col justify-start antialiased mx-auto">
          <AppsNavbar />
          <div className="flex flex-col flex-grow w-full h-full text-white">
            {children}
            <AppsFooter />
          </div>
          <RegistrationModalWrapper />
        </div>
      </AccountProvider>
    </Providers>
  );
}

// Wrapper component to access AccountProvider context
function RegistrationModalWrapper() {
  const { useAccountContext, useWallet } = require("../../providers/AccountProvider");
  const { state, hideRegistrationModal, createAccount } = useAccountContext();
  const { address } = useWallet();

  return (
    <RegistrationModal
      isOpen={state.showRegistrationModal}
      onClose={hideRegistrationModal}
      onCreateWallet={createAccount}
      walletAddress={address}
    />
  );
}
