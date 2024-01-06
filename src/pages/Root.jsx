import { Outlet, ScrollRestoration, useNavigation } from "react-router-dom";
import { getProfile } from "../pages/loaders/appLoaders";
import { PageLoader } from "../components/Elements";
import React from "react";

export async function loader() {
    const me = await getProfile();
    return { me };
}

export default function Root() {
    const navigation = useNavigation();
    return (
        // <ErrorBoundary fallbackComponent={ErrorFallback}>
        <>
            {navigation.state === "loading" && <PageLoader />}
            <ScrollRestoration
                getKey={(location, matches) => {
                    return location.pathname;
                }}
            />
            <Outlet />
        </>
        // </ErrorBoundary>
    )
}