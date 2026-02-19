"use client";

import React, { useState, useEffect } from "react";
import AddLuggagePass from "../../../componnets/luggage/AddLuggagePass";
import Loader from "../../../componnets/ui/loader";

const Page = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ⏳ Simulate loading (e.g., fetching user/auth state)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // 1 sec loader, adjust as needed
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    //  Show same loader here
    return (
      <Loader />
    );
  }

  return <AddLuggagePass />;
};

export default Page;
