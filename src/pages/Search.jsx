import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SearchAppBoxes } from "../components/AppBoxes";
import { FormField, LabelField } from "../components/Forms";
import { Button, TextInput } from "../components/Elements";

const Search = () => {
    const navigate = useNavigate();
    const scrollContainerRef = useRef(null);
    const searchItemsContainerRef = useRef(null);
    const [searchResult, setSearchResult] = useState(null);
    const [searchEmptyResponseText, setSearchEmptyResponseText] = useState('');
    const [fetchMoreData, setFetchMoreData] = useState(false);
    const [moreSearchResult, setMoreSearchResult] = useState(null)

    let appNameSearchString;

    const handleSearchKeyDown = (event) => {
        // alert(event.keyCode)
        if (event.keyCode === 32) {
            event.preventDefault();
        }
        if (event.isComposing || event.keyCode === 229) {
            let ss = event.target.selectionStart - 1;
            let ss_value = ss || 0;
            let char = event.target.value.substr(ss_value, 1);
            const charCode = char.charCodeAt(0);
        }
    }

    const handleSearchKeyUp = (event) => {
        // console.log(event.currentTarget.value);
        // console.log(event.currentTarget.form)
        appNameSearchString = event.currentTarget.value;
        const accepted_alphanumerics = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_";
        const accepted_alphanumerics_list = accepted_alphanumerics.split("");
        if (event.key.toLowerCase() !== "unidentified") {
            if (!accepted_alphanumerics_list.includes(event.key)) {
                console.log(event.key + " not accepted")
                event.preventDefault();
                event.stopPropagation();
                return
            }
        }
        console.log("Should not print if input not between a-z")
        const searchApiUrl = `${process.env.REACT_APP_BASE_URL}/app/?search=${event.target.value}`;
        const searchFetchInit = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                // 'Origin': '*',
            },
            // body: new FormData(event.currentTarget.form),	// Blob, BufferSource, FormData, URLSearchParams, USVString, ReadableStream
            modes: 'cors',  // options: cors, no-cors, same-origin
            // credentials: "same-origin",	// omit, same-origin, include,
            // cache: "default",   // options: default, no-store, reload, no-cache, force-cache, only-if-cached
            // redirect: "",	// follow, error (error if redirect occur from response), manual
            // referrer: "",	// e.g., "", about:client (- A USVString)
            // referrerPolicy: "",	// no-referrer, no-referrer-when-downgrade, same-origin, origin, strict-origin, origin-when-cross-origin, strict-origin-when-cross-origin or unsafe-url
            // Integrity: ""	// e.g., sha256-BpfBw7ivV8q2jLiT13fxDYAe2tJllusRSZ273h2nFSE=
            // keepalive: ""	//	A replacement for Navigator.sendBeacon() API
            // signal: ""	//	An AbortSignal object instance
        }
        // fetch(searchApiUrl, searchFetchInit)
        axios(searchApiUrl, searchFetchInit)
            .then(response => {
                if (response.status >= 400) {
                    return null
                }
                // return response.json()
                return response.data;
            })
            .then(data => {
                setSearchResult(data)
            }).catch(error => {
                console.log(`Error occurred performing search: ${error}`)
            })
    }

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
        if (searchResult?.data?.next)
            axios(searchResult?.data?.next, fetchConfig)
                // .then((res) => res.json())
                .then((res) => res.data)
                .then((data) => {
                    setMoreSearchResult(data.results);
                    // if (data.next) {
                    //   setNextPageData({ hasNextPage: true, next: data.next });
                    // } else {
                    //   setNextPageData({ hasNextPage: false, next: data.next })
                    // }
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
            if (searchItemsContainerRef.current.lastElementChild !== null) {
                // const lastElement = document.getElementById('id-latest-apps-container').lastElementChild;
                const lastElement = searchItemsContainerRef.current.lastElementChild;
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

    const triggerFetchMoreSearchResult = () => {
        setFetchMoreData(true);
    }

    return (
        // {/* SEARCH TEMPLATE - JUNE 13, 2022 */}
        <section id="id-search-page-fragment" className="search-page-fragment flex flex-col h-dvh vh:h-100 overflow-y-auto dark:bg-inherit" ref={scrollContainerRef}>
            <section id="id-search-panel-page-navigation-container" className="modes-navigation-container modes-navigation-container-nobg">
                {/* <span id="id-modes-navigation-close-trigger" className="fa fa-times fa-2x modes-navigation-close-trigger-right bg-green" onClick={new NEH().closeSearchTemplate}></span> */}
                {/* <span className="modes-navigation-title">
						<span className="fa fa-search fa-lg modes-navigation-icon"></span>
						Search
					</span> */}
                <form action={"get"} id="id-napps-search-form" className="napps-search-form flex flex-col justify-center items-center bg-white-solid z-100 focus-within:bg-base-200 dark:bg-000304 dark:focus-within:bg-base-200">
                    {/* <div
                        id="id-napps-search-form-input-container"
                        className="self-center flex flex-row items-center w-[96%] w-safe-12 bg-inherit"
                    >
                        <button
                            type={"button"}
                            id="id-modes-navigation-close-trigger"
                            className="fa fa-arrow-left block text-xl font-16 size-16 leading-[64px] square-8 lh-8 relative text-center radius-circle decoration-none bg-unset border-0 color-initial cursor-pointer hover:bg-whitesmoke dark:color-whitesmoke dark:hover:bg-222425"
                            onClick={() => navigate(-1)}
                        ></button>
                        <label className={"flex flex-row items-center w-full pct:w-100 bg-inherit"}>
                            <span className={"fa fa-search font-16 pad-x1"}></span>
                            <input
                                type="search"
                                name="app_name"
                                id="id-napps-search-form-input"
                                className="w-full pct:w-100 h-20 self-center pl-4 pr-3 text-left outline-0 outline-none border-0 bg-inherit dark:color-whitesmoke lg:focus:bg-light lg:placeholder:font-semibold dark:lg:focus:bg-111314"
                                placeholder="Search Apps..."
                                onKeyUp={handleSearchKeyUp}
                                onKeyDown={handleSearchKeyDown} />
                        </label>
                    </div> */}
                    <FormField classes={"flex flex-row align-start items-center gap-x-2 space-y-0 px-4 w-full mx-auto"}>
                        <Button
                            type={"button"}
                            id="id-modes-navigation-close-trigger"
                            classes={"btn-ghost hover:bg-base-300 dark:bg-transparent dark:hover:bg-base-100 fa fa-arrow-left size-16 leading-[64px] rounded-xl text-xl"}
                            onClick={() => navigate(-1)}
                        ></Button>
                        {/* <LabelField classes={"space-y-0 p-0 w-full"}>
                        </LabelField> */}
                        {/* <span className={"fa fa-search font-16 pad-x1"}></span> */}
                        <TextInput
                            type="search"
                            name="app_name"
                            id="id-napps-search-form-input"
                            classes={"w-full px-8 ring-0 focus:outline-0 border-0"}
                            placeholder="Search Apps..."
                            onKeyUp={handleSearchKeyUp}
                            onKeyDown={handleSearchKeyDown}
                        />
                    </FormField>
                </form>
            </section>
            <section className="modes-body-container h-full">
                {/* This is where the search items will appear. */}
                <section id="id-napps-search" className="h-full pct:h-100">

                    <section className="modes-inner-cover modes-inner-cover-ful h-full overflow-y-auto">
                        {/*{searchResult?.results?.length}*/}
                        <section className="search-result-container flex flex-col flex-wrap justify-start items-start h-full px-4 lg:px-4 dark:pad-x-unset">
                            {/* Locate the search bar. */}
                            {
                                searchResult?.results?.length > 0
                                    ? searchResult.results.map((each_search_result) => {
                                        return (
                                            <div key={each_search_result.id} className="w-full pct:w-100 my-4 radius dark:my-2" ref={searchItemsContainerRef}>
                                                <SearchAppBoxes truncateDescription={true} {...each_search_result} />
                                                {moreSearchResult}
                                            </div>
                                        )
                                    })
                                    : <div className="flex flex-col justify-center align-center w-full h-full pct:w-100 bg-inherit dark:bg-000304">
                                        {
                                            searchResult?.results?.length === 0
                                                ? <span
                                                    className="block m-auto pct:w-72 lh-normal pad-y8 font-medium sm:font-light font-20 text-center color-gray dark:color-whitesmoke">No app with this name.</span>
                                                : ''
                                        }
                                    </div>
                            }
                            {
                                searchResult?.data?.next
                                    // ? <button type={"button"} className={"d-block mg-x-auto h-5 lh-5 font-9 font-bold border-0 bg-green-inverse color-green-dark pad-x2 radius"} onClick={() => triggerFetchMoreSearchResult}>
                                    //     Load more result
                                    // </button>
                                    ? <Button
                                        classes={"btn-wide mx-auto"}
                                        onClick={() => triggerFetchMoreSearchResult}
                                    >
                                        Load more result
                                    </Button>
                                    : null
                            }
                            {/*{props.children}*/}
                        </section>
                    </section>
                </section>
            </section>
        </section>
    )
}

export default Search;