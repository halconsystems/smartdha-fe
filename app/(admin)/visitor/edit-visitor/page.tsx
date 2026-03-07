"use client";

import React, { useState, useEffect } from "react";
import AddVisitorQuickForm from "../../../componnets/visitor/AddVisitorQuickForm";
import Loader from "../../../componnets/ui/loader";

const Page = () => {
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => {
			setLoading(false);
		}, 1000);
		return () => clearTimeout(timer);
	}, []);

	if (loading) {
		return <Loader />;
	}

	return <AddVisitorQuickForm mode="edit" />;
};

export default Page;
