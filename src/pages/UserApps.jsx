// import { NavBar } from "./Base";
import { useLoaderData, useParams, useRouteLoaderData } from "react-router-dom";
import useFetch from "../hooks/useFetch";
// import { AppBoxes } from "./AppBoxes";
import React, { useEffect, useRef, useState } from "react";
import { getUserApps } from "./loaders/appLoaders";
import axios from "axios";
import { AppBoxes } from "../components/AppBoxes";
import NavBar from "../components/NavBar";
import { Button, PageHeaderLink } from "../components/Elements";

export async function loader({ params }) {
    const userApps = await getUserApps(params.id);
    return { userApps };
}

const UserApps = () => {
    const { id } = useParams();
    // const { rawToken, isLoggedIn, tokenData } = useTokenData();
    // const [data] = useFetch(`${process.env.REACT_APP_BASE_URL}/user/${id}/apps/`);
    const { userApps } = useLoaderData();
    const { me } = useRouteLoaderData("root");
    const scrollContainerRef = useRef(null);
    const userAppsContainerRef = useRef(null);
    const [fetchMoreData, setFetchMoreData] = useState(false);
    const [nextPageData, setNextPageData] = useState(userApps?.nextPageData);
    const [moreUserApps, setMoreUserApps] = useState(null)

    useEffect(() => {
        const fetchConfig = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                // 'Origin': '*',
            },
            modes: 'cors',  // options: cors, no-cors, same-origin
            cache: 'default',   // options: default, no-store, reload, no-cache, force-cache, only-if-cached
        }
        if (userApps?.data.next)
            axios(userApps?.data.next, fetchConfig)
                // .then((res) => res.json())
                .then((res) => res.data)
                .then((data) => {
                    setMoreUserApps(data.results);
                    if (data.next) {
                        setNextPageData({ hasNextPage: true, next: data.next });
                    } else {
                        setNextPageData({ hasNextPage: false, next: data.next })
                    }
                });
        // alert("Done fetching more data")
        return () => { }
    }, [fetchMoreData]);

    useEffect(() => {
        // handle Scroll check
        const scrollContainerElem = scrollContainerRef.current;
        const handleScroll = () => {
            // Get the last container height as on offset for the scroll calculation.
            // if (document.getElementById('id-latest-apps-container') !== null) {
            if (userAppsContainerRef.current.lastElementChild !== null) {
                // const lastElement = document.getElementById('id-latest-apps-container').lastElementChild;
                const lastElement = userAppsContainerRef.current.lastElementChild;
                const lastElementHeight = lastElement.clientHeight;
                if (scrollContainerElem.scrollHeight - scrollContainerElem.scrollTop - lastElementHeight <= scrollContainerElem.clientHeight) {
                    // we've reached the bottom of the scrollContainerElem
                    // console.log("Reached the bottom of the page.");
                    setFetchMoreData(true);
                }
            }
        };

        scrollContainerElem.addEventListener("scroll", handleScroll);
        return () => { scrollContainerElem.removeEventListener("scroll", handleScroll) }
    }, []);

    const triggerFetchMoreUserApps = () => {
        setFetchMoreData(true);
    }

    return (
        <section className={"h-dvh vh:h-100 overflow-y-auto"} ref={scrollContainerRef}>
            {/* <NavBar showProfile={false} /> */}
            <PageHeaderLink headerTitle={id === me?.data?.id ? "Your Apps" : `${userApps?.data.results[0]?.owner?.firstname} Apps`} />
            <section className={"w-full lg:w-[80%] pct:w-100 mx-auto lg:pct:w-80"}>
                <header
                    className={"relative w-full text-xl pct:w-100 font-15 px-4 py-4 font-medium radius decoration-none color-initial lg:font-18|pad-y4 dark:color-darkgray"}>
                    {/* {id === me?.data?.id ? "Your Apps" : `${userApps?.data.results[0]?.owner?.firstname} Apps`} */}
                </header>
                <section
                    className={"flex flex-col flex-nowrap justify-start items-start w-full gap-6 lg:flex-row lg:flex-wrap pct:w-100 px-4 overflow-x-auto"}>
                    {
                        userApps?.data.results?.length > 0
                            ? userApps?.data.results.map((eachUserApps) => {
                                return (
                                    <section key={eachUserApps?.id} className={"flex flex-col items-center w-full lg:w-[30%] pct:w-100 lg:pct:w-33"} ref={userAppsContainerRef}>
                                        {
                                            id === me?.data?.id
                                                ? <AppBoxes key={eachUserApps.id} {...eachUserApps} hideUser={true} />
                                                : <AppBoxes key={eachUserApps.id} {...eachUserApps} />
                                        }
                                        {moreUserApps}
                                    </section>
                                )
                            })
                            : <div>You have no Apps created yet.</div>
                    }
                    {
                        nextPageData?.hasNextPage
                            // ? <button type={"button"} className={"d-block mg-x-auto h-5 lh-5 font-9 font-bold border-0 bg-green-inverse color-green-dark pad-x2 radius"} onClick={() => triggerFetchMoreUserApps}>
                            //     Load more Apps
                            // </button>
                            ? <Button
                                classes={"block mx-auto font-bold my-4"}
                                onClick={() => triggerFetchMoreUserApps}
                            >
                                Load more
                            </Button>
                            : null
                    }
                </section>
            </section>
        </section>
    )
}

export default UserApps;