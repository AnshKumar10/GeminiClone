import React from "react";
import { useStore } from "../store/useStore";
import Layout from "../components/Layout";
import AuthForm from "../components/auth/AuthForm";

const Index: React.FC = () => {
  const { isAuthenticated } = useStore();

  return (
    <Layout>
      {!isAuthenticated ? (
        <div className="min-h-screen flex items-center justify-center p-4">
          <AuthForm />
        </div>
      ) : (
        <div>TODO : CHAT INTERFACE </div>
      )}
    </Layout>
  );
};

export default Index;
