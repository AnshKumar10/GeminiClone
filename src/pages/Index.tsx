import React from "react";
import { useStore } from "../store/useStore";
import Layout from "../components/Layout";
import AuthForm from "../components/auth/AuthForm";
import MainContent from "../components/dashboard/MainContent";
import AppSidebar from "../components/sidebar/AppSidebar";
import { SidebarProvider } from "../components/ui/sidebar";

const Index: React.FC = () => {
  const { isAuthenticated } = useStore();

  return (
    <Layout>
      {!isAuthenticated ? (
        <div className="min-h-screen flex items-center justify-center p-4">
          <AuthForm />
        </div>
      ) : (
        <SidebarProvider>
          <div className="min-h-screen flex w-full">
            <AppSidebar />
            <MainContent />
          </div>
        </SidebarProvider>
      )}
    </Layout>
  );
};

export default Index;
