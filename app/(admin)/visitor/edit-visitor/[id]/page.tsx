"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Loader from '@/app/componnets/ui/loader';
import AddVisitorForm from '@/app/componnets/visitor/AddVisitorForm';

const Page = () => {
  const [loading, setLoading] = useState(true);
  const params = useParams();
  // Ensure visitorId is string or undefined
  const visitorId =
    typeof params?.id === "string"
      ? params.id
      : Array.isArray(params?.id)
      ? params.id[0]
      : undefined;

  useEffect(() => {
    // Simulate loading (e.g., fetching visitor data by ID)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loader />;
  }

  // Pass visitorId as prop if needed in AddVisitorForm
  return <AddVisitorForm mode="edit" visitorId={visitorId} />;
};

export default Page;
