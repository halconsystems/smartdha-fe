"use client";
import React, { useState, useEffect } from "react";
import Loader from "@/app/componnets/ui/loader";

function Page() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); 
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <Loader/>
    );
  }

  return <LoginForm />;
}

export default Page;
