"use client";
import React, { useState, useEffect } from "react";
import Loader from "@/app/componnets/ui/loader";
import LoginForm from "@/app/componnets/login/LoginForm";
import ContactSupport from "../componnets/contact-support/page";

function Page() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ⏳ Simulate loading (e.g., fetching user/auth state)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // 1.5 sec loader, adjust as needed
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    //  Show same loader here
    return (
      <Loader/>
    );
  }

  return <ContactSupport />;
}

export default Page;
