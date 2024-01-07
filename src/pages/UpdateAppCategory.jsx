import { FormFields } from "./CreateForm";
import React, { useEffect, useRef, useState } from "react";
import { useLoaderData, useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
// import { useAtomValue } from "jotai";
// import { tokenState } from "./Home";
import { Button, LoadingButton, NotifError, NotifSuccess, PageHeaderLink } from "../components/Elements";
import { StyleProcessor } from "../helpers/StyleProcessor";
import { AppDetailLeftNav } from "./UpdateAppDetail";
// import { useDeviceWidth } from "./useDeviceWidth";
import axios from "axios";
import { useDeviceSize } from "../hooks/useDeviceSize";
import { deviceWidthEnum } from "../helpers/utils";
import useTokenData from "../hooks/useTokenData";
import { maxCategoryCount } from "../helpers/constants";

const UpdateAppCategory = () => {
    const { appId } = useParams();
    const { app } = useLoaderData();
    const appData = app?.data;
    // const { windowWidth, screenWidth, deviceWidthEnum } = useDeviceWidth();
    const size = useDeviceSize();
    // const [appData] = useFetch(`${process.env.REACT_APP_BASE_URL}/app/${appId}/`);
    const [defaultAppsCategory] = useFetch(`${process.env.REACT_APP_BASE_URL}/app/category_list/`);
    // const { rawToken, isLoggedIn, tokenData } = useAtomValue(tokenState);
    const { rawToken, isLoggedIn, tokenData } = useTokenData();
    const [isSubmit, setIsSubmit] = useState(false);
    const [updateAppCategoryData, setUpdateAppCategoryData] = useState([]);
    const [updateAppCategoryResponseData, setUpdateAppCategoryResponseData] = useState({});
    const [selectedCategoryCount, setSelectedCategoryCount] = useState(0);
    const [selectedCategoryData, setSelectedCategoryData] = useState('');
    const selectedCategoryContainer = useRef(null);
    const categoryInputField = useRef(null);
    const categoryItemsContainer = useRef(null);

    useEffect(() => {
        const appCategory = appData?.category.length > 0 ? appData?.category.split(",") : [];
        setUpdateAppCategoryData(appCategory);
        setSelectedCategoryCount(appCategory?.length);
    }, [appData]);

    useEffect(() => {
        console.log(selectedCategoryCount);
        console.log(updateAppCategoryData);
        setSelectedCategoryCount(updateAppCategoryData?.length);
    }, [updateAppCategoryData]);

    function addToSelectedCategory(event) {
        const category_value_elem = document.querySelector('#id-new-app-category-value')
        const this_elem = event.currentTarget
        const category_name = this_elem.getAttribute('data-category_name')

        // if (categorySplit.length <= 4) {
        if (this_elem.getAttribute('data-category_item_selected') === 'false') {
            let categorySplit = category_value_elem.value.split(',');
            category_value_elem.value += `${category_name},`.trim();
            setSelectedCategoryData(category_value_elem.value);
            new StyleProcessor(this_elem).removeClass('bg-transparent').addManyClass('bg-green color-FFFFFF pct:w-96 mg-x-auto mg-y-2');
            this_elem.setAttribute('data-category_item_selected', true);
            selectedCategoryContainer.current.innerHTML += `<span id="id-category-${categorySplit.length}" class="d-inline-block h-5 lh-5 pad-x2 mg-x1 mg-y1 radius-round bg-lighter border:1px_solid_BBB font-bold">${category_name}</span>`;
            setSelectedCategoryCount(selectedCategoryCount + 1);
            if (selectedCategoryCount === 4 - 1) {
                categoryItemsContainer.current.childNodes.forEach((obj) => {
                    if (obj.getAttribute('data-category_item_selected') === "false") {
                        obj.setAttribute('disabled', 'true');
                    }
                }, this_elem);
            }
        } else if (this_elem.getAttribute('data-category_item_selected') === 'true') {
            const removeItemFromList = (arr, itemToRemove, countToRemove = 1) => {
                let index = arr.indexOf(itemToRemove);
                if (index !== -1) {
                    // If the item is found in the array
                    arr.splice(index, countToRemove); // remove the item from the array
                }
                return arr;
            }
            // this element has already been selected,
            // reverse the selection.
            // category_value_elem.value -= `${category_name}, `;
            category_value_elem.value = category_value_elem.value.replace(`${category_name},`.trim(), '');
            setSelectedCategoryData(category_value_elem.value);
            new StyleProcessor(this_elem).addClass('bg-transparent').removeManyClass('bg-green color-FFFFFF pct:w-96 mg-x-auto mg-y-2');
            this_elem.setAttribute('data-category_item_selected', false);
            selectedCategoryContainer.current.querySelector(`#id-category-${selectedCategoryCount}`).remove();
            setSelectedCategoryCount(selectedCategoryCount - 1);
            if (selectedCategoryCount < 4 + 1) {
                categoryItemsContainer.current.childNodes.forEach((obj) => {
                    if (obj.getAttribute('data-category_item_selected') === "false") {
                        obj.removeAttribute('disabled');
                    }
                }, this_elem);
            }
        }
        //  } else if (categorySplit.length === 4) {
        //   console.log("Max number of category reached")
        //   categoryItemsContainer.current.childNodes.forEach((obj) => {
        //     if (obj.getAttribute('data-category_item_selected') === "false") {
        //       obj.setAttribute('disabled');
        //     }
        //   }, this_elem);
        // } else {
        //   alert('Only four categories allowed.')
        //   // new Notification().addNotification("You can only select four categories.");
        // }
    }

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setUpdateAppCategoryData(values => {
            if (values.includes(value)) {
                return values.filter((item) => item !== value);
            } else {
                return [...values, value]
            }
        });
    }

    const showLoadingState = (e) => {
        setIsSubmit(true);
    };

    const updateCategoryForm = (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append("category", updateAppCategoryData);

        const updateAppURL = `${process.env.REACT_APP_BASE_URL}/app/${appId}/`;
        const headers = {
            'Accept': '*/*',
            // 'Origin': '*',
            'Authorization': `Bearer ${window.localStorage.getItem('nine_login')}`
        };
        const fetchInit = {
            method: 'PATCH',
            headers: headers,
            mode: 'cors',
            // body: formData,
            data: formData,
            cache: 'default',
        };
        // fetch(updateAppURL, fetchInit)
        axios(updateAppURL, fetchInit)
            .then(response => {
                if (response.status !== 200) throw response;
                // return response.json()
                return response.data;
            })
            .then(data => {
                setIsSubmit(false);
                setUpdateAppCategoryResponseData({
                    message: "App category update successful",
                    successful: true,
                    error: false
                });
            })
            .catch((error) => {
                let errorMessage = error.response?.data.error || "Unable to process request";
                // if (error.status === 401) {
                //     errorMessage = "Kindly login to update your Profile"
                // } else if (error.status === 400) {
                //     errorMessage = "Unable to perform update. Kindly fix any form errors and re-submit"
                // } else if (error.status === 500) {
                //     errorMessage = "Check your internet connection"
                // } else {
                //     // There is no network connection or the Server is not up.
                //     errorMessage = "Network Error"
                // }
                setUpdateAppCategoryResponseData({
                    message: errorMessage,
                    successful: false,
                    error: true
                });
                // reset the isSubmit loader
                setIsSubmit(false);
            });
    };

    return (
        <section className={"flex flex-row flex-nowrap justify-start w-full pct:w-100 dark:bg-111314"}>
            {/* {
                size.windowWidth >= deviceWidthEnum.laptop
                    ? <AppDetailLeftNav appName={appData?.name} pageName={"Category"} />
                    : null
            } */}
            <form action={""} method={"PATCH"} onSubmit={updateCategoryForm} className={"w-full l:w-[56%] lg:mr-auto pct:w-100 lg:pct:w-56|mg-r-auto|mg-t8"}>
                {
                    size.windowWidth < deviceWidthEnum.laptop
                        ? <PageHeaderLink headerTitle={"Update Category"}>
                            <div className="flex-shrink-0 space-x-2 w-auto block font-bold text-xl px-4">
                                {
                                    selectedCategoryCount === maxCategoryCount
                                    && <span className={"badge badge-success badge-lg"}>Maximum</span>
                                }
                                <span className={`${selectedCategoryCount === maxCategoryCount ? "badge badge-success badge-lg" : ""}`}>{selectedCategoryCount} of {maxCategoryCount}</span>
                            </div>
                        </PageHeaderLink>
                        : <PageHeaderLink headerTitle={"Category"}>
                            <div className="flex-shrink-0 space-x-2 w-auto block font-bold text-xl px-6">
                                {
                                    selectedCategoryCount === maxCategoryCount
                                    && <span className={"badge badge-success badge-lg"}>Maximum</span>
                                }
                                <span className={`${selectedCategoryCount === maxCategoryCount ? "badge badge-success badge-lg" : ""}`}>{selectedCategoryCount} of {maxCategoryCount}</span>
                            </div>
                        </PageHeaderLink>
                }
                <section id="id-new-app-category-fragment" className={"new-app-category-fragment space-y-2 dark:color-whitesmoke"}>
                    <div
                        className={"sticky top-[80px] block w-full bg-white/60 backdrop-blur px:top-80 d-block pct:w-100 bg-white bg-mica z-10 dark:bg-111314 dark:bg-base-200/60"}
                        ref={selectedCategoryContainer}>
                        {
                            updateAppCategoryData?.map((eachCategory, index) => (
                                <span key={index} id={`id-category-${index}`}
                                    className="inline-block h-10 leading-10 px-4 mx-2 my-2 rounded-full bg-base-100 text-base-content radius-round bg-lighter border:1px_solid_BBB font-bold dark:bg-222425|color-whitesmoke|border:1px_solid_darkgray">
                                    {eachCategory}
                                </span>
                            ))
                        }
                    </div>
                    {
                        updateAppCategoryResponseData?.successful
                            // ? <div
                            //     className="sticky top-[80px] mx-auto w-[64%] py-4 rounded px:top-80 mg-x-auto text-center pct:w-64 pad-y2 radius-sm bg-green-inverse color-green">
                            //     {updateAppCategoryResponseData.message}
                            // </div>
                            ? <NotifSuccess message={updateAppCategoryResponseData.message} />
                            : null
                    }
                    {
                        updateAppCategoryResponseData?.error
                            // ? <div
                            //     className="sticky top-[80px] mx-auto w-[64%] py-4 rounded px:top-80 mg-x-auto text-center pct:w-64 pad-y2 radius-sm bg-red-inverse color-red">
                            //     {updateAppCategoryResponseData.message}
                            // </div>
                            ? <NotifError message={updateAppCategoryResponseData.message} />
                            : null
                    }
                    {/* <div className="block fixed top-[8px] h-16 leading-[64px] px:top-8 right-4 lh-8 px-2 text-center font-bold z-[100]">
                        <span className={`${selectedCategoryCount === maxCategoryCount ? "badge badge-warning badge-lg" : ""}`}>{selectedCategoryCount} of {maxCategoryCount}</span>
                        {
                            selectedCategoryCount === maxCategoryCount
                            && <span className={"badge badge-warning badge-lg"}>Maximum of 4</span>
                        }
                    </div> */}
                    <section className={"space-y-4 px-4"} ref={categoryItemsContainer}>
                        {
                            defaultAppsCategory?.map((eachAppsCategory, index) => {
                                return (
                                    <div key={eachAppsCategory} className={"relative"}>
                                        <label
                                            htmlFor={`id-category-${eachAppsCategory}`}
                                            className="flex flex-row items-center h-16 leading-[64px] px-4 rounded-2xl cursor-pointer hover:bg-base-200 has-[:disabled]:cursor-not-allowed has-[:disabled]:text-base-content/50 has-[:checked]:bg-primary has-[:checked]:text-primary-content has-[:checked]:font-bold has-[:checked]:ring-primary transition-all"
                                            data-category_name={eachAppsCategory}
                                            data-category_item_selected={false}
                                        // onClick={(event) => addToSelectedCategory(event)}
                                        >
                                            <span className={"flex-1 w-full"}>{eachAppsCategory}</span>
                                            <input
                                                key={index}
                                                type="checkbox"
                                                name={"category"}
                                                id={`id-category-${eachAppsCategory}`}
                                                // className={"sibling-categoryname appearance-none block w-[96%] h-16 leading-[64px] rounded-2xl pct:w-96 lh-8 px-6 py-3 border-0 radius2 text-left lg:hover:w-full lg:mx-auto disabled:text-base-100 checked:bg-success checked:w-full checked:mx-auto checked:my-4 lg:hover:pct:w-100|mg-x-auto|bg-green-inverse|cursor-pointer disabled:color-light checked:bg-green|color-FFFFFF|pct:w-100|mg-x-auto|mg-y-2 transition:all_200ms_ease"}
                                                className="appearance-none checked:checkbox checked:checkbox-sm checked:bg-success"
                                                defaultChecked={appData?.category.split(",").includes(eachAppsCategory)}
                                                defaultValue={eachAppsCategory}
                                                onChange={handleChange}
                                                disabled={!updateAppCategoryData?.includes(eachAppsCategory) && updateAppCategoryData?.length === maxCategoryCount}
                                            />
                                        </label>
                                        {/* <input
                                            key={index}
                                            type="checkbox"
                                            name={"category"}
                                            id={`id-category-${index}`}
                                            className={"peer sibling-categoryname appearance-none block w-[96%] h-16 leading-[64px] rounded-2xl pct:w-96 lh-8 px-6 py-3 border-0 radius2 text-left lg:hover:w-full lg:mx-auto disabled:text-base-100 checked:bg-primary checked:w-full checked:mx-auto checked:my-4 lg:hover:pct:w-100|mg-x-auto|bg-green-inverse|cursor-pointer disabled:color-light checked:bg-green|color-FFFFFF|pct:w-100|mg-x-auto|mg-y-2 transition:all_200ms_ease"}
                                            defaultChecked={appData?.category.split(",").includes(eachAppsCategory)}
                                            defaultValue={eachAppsCategory}
                                            onChange={handleChange}
                                            disabled={!updateAppCategoryData?.includes(eachAppsCategory) && updateAppCategoryData?.length === 4}
                                        />
                                        <label
                                            htmlFor={`id-category-${index}`}
                                            className="block absolute top-0 left-0 w-full h-16 leading-[64px] lh-8 px-6 border-0 rounded-2xl radius2 text-left cursor-pointer hover:bg-base-100 peer-disabled:text-base-content/50 peer-disabled:cursor-not-allowed peer-disabled:hover:bg-base-200 transition-colors peer-checked:hover:bg-inherit peer-checked:text-primary-content peer-checked:font-bold checked:sibling-categoryname:color-white"
                                            data-category_name={eachAppsCategory}
                                            data-category_item_selected={false}
                                        // onClick={(event) => addToSelectedCategory(event)}
                                        >
                                            {eachAppsCategory}
                                        </label> */}
                                    </div>
                                )
                            })
                        }
                    </section>
                </section>

                <div className={"mt-4 mb-4 bg-white-solid dark:bg-111314 dark:bg-base-300"}>
                    {/* <button
                        type={"submit"}
                        className={"d-block pct:w-64 max-w-480 h-7 lh-7 mg-x-auto pad-x2 border-0 bg-green color-white radius decoration-none disabled:bg-green-inverse"}
                        onClick={showLoadingState}
                        disabled={updateAppCategoryData?.length < 1}
                    >
                        {isSubmit ? <span className='fa fa-spinner fa-spin'></span> : "Save"}
                    </button> */}
                    <Button
                        type={"submit"}
                        classes={"btn-wide block max-w-[480px] mx-auto"}
                        disabled={updateAppCategoryData?.length < 1}
                        onClick={showLoadingState}
                    >
                        {isSubmit ? <LoadingButton /> : "Save"}
                    </Button>
                </div>
            </form>
        </section>
    );
}
export default UpdateAppCategory;