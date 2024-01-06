import React, { useCallback, useEffect, useRef, useState } from 'react'
// import NEH from './NappsEventHandlers'
import { StyleProcessor } from "../helpers/StyleProcessor";
import { Link, useLocation, useNavigate } from "react-router-dom";
// import { useAtomValue } from "jotai";
// import { tokenState } from "./Home";
import { Button, NotifError, NotifSuccess, TextArea, TextInput } from "../components/Elements";
import useFetch from "../hooks/useFetch";
// import { useDeviceWidth } from "./useDeviceWidth";
import { deviceWidthEnum, isValidURL, loginToken } from "../helpers/utils";
import axios from 'axios';
import scrollIntoView from 'scroll-into-view-if-needed';
import smoothScrollIntoView from 'smooth-scroll-into-view-if-needed';
import { useDeviceSize } from '../hooks/useDeviceSize';
import useTokenData from '../hooks/useTokenData';
import { FormField, LabelField } from '../components/Forms';

export function FormFields(props) {
  const { children, useDefaultInput, ...propsRest } = props;
  return (
    <div className="form-input-fields flex flex-column align-items-start pad-x2 pad-y2">
      {useDefaultInput ? <FormInput type={props.type} label_value={props.label_value} id={props.id} name={props.name} placeholder={props.placeholder} onChange={props.onChange} defaultValue={props.defaultValue} {...propsRest}></FormInput> : ""}
      {props.children}
    </div>
  )
}

function FormInput(props) {
  // const handleChange = (event) => {
  //   const name = event.target.name;
  //   const value = event.target.value;
  //   setSignupData(values => (
  //       {...values, [name]: value}
  //   ));
  // }

  return (
    <>
      {
        props.hide_label
          ? null
          : <label htmlFor={props.id} className="pad-x1 pad-y1 focus:sibling-appname:color-blue dark:color-whitesmoke">
            {props.label_value}
            {props.required ? <span className={"font-bold color-red pad-x-2"}>*</span> : null}
          </label>
      }
      <input id={props.id}
        className="sibling-appname pct:w-100 h-8 lh-8 pad-x2 mg-y1 outline:1px_solid_transparent border:1px_solid_BBB outline-offset-2 focus:outline:2px_solid_gray transition:outline_80ms_ease radius-sm font-12 dark:bg-222425|border:1px_solid_000304|color-whitesmoke dark:placeholder:color-darkgray dark:focus:outline:3px_solid_444445"
        type={props.type || "text"}
        name={props.name}
        required={props.required}
        defaultValue={props.defaultValue}
        placeholder={props.placeholder}
        onChange={props.onChange}
        {...props}
      />
      <span></span>
    </>
  )
}

const PageSwitchHeader = (props) => {
  return (
    <header
      className="relative top-0 block h-20 leading-[5rem] text-lg font-semibold text-center lg:font-18|font-bold|mg-b2 dark:bg-111314">
      {props.children}
    </header>
  )
}

const PrevPageButton = (props) => {
  return (
    <div>
      <Button
        onClick={props.onClick}
        {...props}
      >
        <span className="fa fa-angle-left"></span>
      </Button>
    </div>
  )
}

const NextPageButton = (props) => {
  return (
    <div id={props.id} className={"bg-base-300 block w-32 ml-auto decoration-none"} tabIndex="-1">
      <Button
        type={"button"}
        classes={"w-full h-14"}
        disabled={props.disabled}
        onClick={props.onClick}
        {...props}
      >
        Next
        <span className="fa fa-angle-right mg-l2"></span>
      </Button>
    </div>
  )
}

const PageSwitchButtonPanel = (props) => {
  return (
    <div className={"form-page-switch-container flex flex-row place-items-center sticky bottom-0 left-0 bg-base-200 bg-mica z-100 w-full px-4 py-2 dark:bg-111314"}>
      {props.children}
    </div>
  )
}

const PageSwitchContentContainer = ({ classes, children }) => {
  return (
    <section className={`space-y-5 w-full h-full bg-base-200 overflow-y-auto lg:w-[56%] dark:bg-111314 ${classes}`}>
      {children}
    </section>
  )
}

const PageSwitchContainer = ({ id, classes, children }) => {
  return (
    <section id={id} className={`app-form-page relative flex flex-col w-full items-center flex-grow flex-shrink-0 overflow-y-hidden dark:bg-111314 ${classes}`}>
      {children}
    </section>
  )
}

function CreateAppsForm() {
  const location = useLocation();
  const [appCreateData, setAppCreateData] = useState({});
  const [isAppCategoryModesOpen, setIsAppCategoryModesOpen] = useState(false);
  const [app_description_textarea_value, setAppDescriptionValue] = useState();
  const selectedCategoryContainer = useRef(null);
  const { rawToken, isLoggedIn, tokenData } = useTokenData();
  // const {rawToken, isLoggedIn, tokenData} = useAtomValue(tokenState);
  // const {rawToken, isLoggedIn, tokenData} = useRecoilValue(tokenState);
  const navigate = useNavigate();
  const [appImage, setAppImage] = useState(null);
  const [appImagePreview, setAppImagePreview] = useState(null);
  const [appScreenshots, setAppScreenshots] = useState([]);
  const [appScreenshotsPreview, setAppScreenshotsPreview] = useState([]);
  const [defaultAppsCategory] = useFetch(`${process.env.REACT_APP_BASE_URL}/app/category_list/`);
  const [selectedCategoryCount, setSelectedCategoryCount] = useState(0);
  const [selectedCategoryData, setSelectedCategoryData] = useState('');
  const [selectedCategoryList, setSelectedCategoryList] = useState([]);
  const categoryItemsContainer = useRef(null);
  const categoryInputField = useRef(null);
  const appFormElement = useRef(null);
  const appFormPagePilesContainer = useRef(null);
  const [appCategoryData, setAppCategoryData] = useState([]);
  const [currentFormPage, setCurrentFormPage] = useState("basic");
  const [appFormPageData, setAppFormPageData] = useState([{
    "basic": { "valid": false, "index": 1 },
    "logo": { "valid": false, "index": 2 },
    "screenshots": { "valid": false, "index": 3 },
    "category": { "valid": false, "index": 4 },
    "links": { "valid": false, "index": 5 }
  }]);
  const [appFormPageSuccessfulList, setAppFormPageSuccessfulList] = useState({
    "basic": false,
    "logo": false,
    "screenshots": false,
    "category": false,
    "links": false
  });
  const [appLinksValid, setAppLinksValid] = useState(false);
  const createAppFormBaseURL = location.pathname;
  const [appCreateResponseData, setAppCreateResponseData] = useState({});
  const [fieldInfo, setFieldInfo] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  // const { windowWidth, screenWidth, deviceWidthEnum } = useDeviceWidth();
  const size = useDeviceSize();
  const [descriptionCount, setDescriptionCount] = useState(0);

  useEffect(() => {
    // scroll the piles into view
    // document.querySelector(`#id-${currentFormPage}-pile`).scrollIntoView({ 'inline': 'center', 'block': 'nearest', 'behavior': 'smooth' });
    smoothScrollIntoView(document.querySelector(`#id-${currentFormPage}-pile`), { 'inline': 'center', 'block': 'nearest', 'behavior': 'smooth', scrollMode: 'if-needed' });
    // const scrollPilesTimeout = setTimeout(
    //   () => document.querySelector(`#id-${currentFormPage}-pile`).scrollIntoView({ 'inline': 'center', 'block': 'nearest', 'behavior': 'smooth' }),
    //   800
    // );
    // return () => { clearTimeout(scrollPilesTimeout) }
  }, [currentFormPage])

  useEffect(() => {
    setSelectedCategoryCount(appCategoryData?.length);
  }, [appCategoryData]);

  useEffect(() => {
    if (appCreateData?.name && appCreateData?.description) {
      setAppFormPageSuccessfulList({ ...appFormPageSuccessfulList, "basic": true })
      // setAppFormPageData(appFormPageData)
    } else {
      setAppFormPageSuccessfulList({ ...appFormPageSuccessfulList, "basic": false })
    }
    /*if (
        appCreateData?.playstore_link
        || appCreateData?.appstore_link
        || appCreateData?.external_link
        || appCreateData?.website
    ) {
      // setAppFormPageSuccessfulList({...appFormPageSuccessfulList, "links": true})
      setAppCreateData(values => (
          {...values, ["links"]: true}
      ));
    } else {
      setAppFormPageSuccessfulList({...appFormPageSuccessfulList, "links": false})
    }*/

    if (
      isValidURL(appCreateData?.website)
      || (
        isValidURL(appCreateData?.external_link)
        || isValidURL(appCreateData?.appstore_link)
        || isValidURL(appCreateData?.playstore_link)
      )
    ) {
      setAppLinksValid(true)
    } else {
      setAppLinksValid(false)
    }
    return () => {
      setAppFormPageSuccessfulList({ ...appFormPageSuccessfulList })
    }
  }, [appCreateData])

  useEffect(() => {
    if (selectedCategoryCount > 0) {
      setAppFormPageSuccessfulList({ ...appFormPageSuccessfulList, "category": true })
    } else {
      setAppFormPageSuccessfulList({ ...appFormPageSuccessfulList, "category": false })
    }
    return () => { }
  }, [selectedCategoryCount])

  useEffect(() => {
    if (appImage) {
      setAppFormPageSuccessfulList({ ...appFormPageSuccessfulList, "logo": true })
    } else {
      setAppFormPageSuccessfulList({ ...appFormPageSuccessfulList, "logo": false })
    }
  }, [appImage])

  useEffect(() => {
    if (appScreenshots.length > 0) {
      setAppFormPageSuccessfulList({ ...appFormPageSuccessfulList, "screenshots": true })
    } else {
      setAppFormPageSuccessfulList({ ...appFormPageSuccessfulList, "screenshots": false })
    }
  }, [appScreenshots])

  const handleAppImageChange = (event) => {
    const selectedImage = event.target.files[0];
    setAppImage(selectedImage);
    setAppImagePreview(URL.createObjectURL(selectedImage));
  };

  const handleAppScreenshotSelect = (event) => {
    const files = Array.from(event.target.files);
    setAppScreenshots(files);
    setAppScreenshotsPreview(
      files.map((file) => URL.createObjectURL(file))
    );
  };

  const showLoadingState = (e) => {
    setIsSubmit(true);
  };

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

  function submitNewAppForm(event) {
    event.preventDefault();
    console.log('Initializing submitting new App Form.');
    const formData = new FormData();
    if (appCreateData?.name && appCreateData?.description) {
      formData.append("name", appCreateData?.name)
      formData.append("description", appCreateData?.description)
    }
    if (appImage) {
      formData.append("logo", appImage);
    }
    appScreenshots.forEach((file, index) => {
      // formData.append(`images[${index}]`, file)
      formData.append(`screenshot`, file)
    });
    if (selectedCategoryCount > 0) {
      formData.append("category", appCategoryData);
    }
    if (appCreateData?.playstore_link) {
      formData.append("playstore_link", appCreateData?.playstore_link)
    }
    if (appCreateData?.appstore_link) {
      formData.append("appstore_link", appCreateData?.appstore_link)
    }
    if (appCreateData?.external_link) {
      formData.append("external_link", appCreateData?.external_link)
    }
    if (appCreateData?.website) {
      formData.append("website", appCreateData?.website)
    }
    const newAppApiUrl = `${process.env.REACT_APP_BASE_URL}/app/`;
    const newAppFetchConfig = {
      method: 'POST',
      headers: {
        // 'Accept': '*',
        // 'Origin': '*',
        'Authorization': `Bearer ${loginToken()}`,
        // 'Content-Type': "multipart/form-data"
      },
      // body: formData,
      data: formData,
      modes: 'cors',
    }
    // fetch(newAppApiUrl, newAppFetchConfig)
    axios(newAppApiUrl, newAppFetchConfig)
      .then(response => {
        console.log("Received response")
        console.log(response)
        console.log(typeof response.status)
        if (response.status !== 201) {
          // let error_message;
          // if (response.status === 401) {
          //   error_message = "Kindly login to register your app"
          // } else if (response.status === 400) {
          //   error_message = "Unable to perform update. Kindly fix any form errors and re-submit"
          // } else if (response.status === 500) {
          //   error_message = "Something went wrong from our end. We are resolving this right now. Please try again in 3 minutes"
          // } else {
          //   // There is no network connection or the Server is not up.
          //   error_message = "Network Error"
          // }
          // setAppCreateResponseData({
          //   message: error_message,
          //   successful: false,
          //   error: true
          // });
          // throw null;
          throw response;
        }
        // new NEH().closeNewAppsFormTemplate()
        // return response.json()
        return response.data;
      })
      .then(data => {
        console.info(`New App instance created successfully. ::`)
        // console.info(data)
        setIsSubmit(false);
        // Show the success alert and redirect to the home page
        setAppCreateResponseData({
          message: "App created successful",
          successful: true,
          error: false
        });
        setTimeout(() => {
          navigate('/');
        }, 800);
      })
      .catch(err => {
        // console.log(err)
        const errorMessage = err.response?.data.error || "Unable to process request";
        console.error(`Error occurred when creating new App. :: ${err}`)
        setAppCreateResponseData({
          message: errorMessage,
          successful: false,
          error: true
        });
        setIsSubmit(false);
      })

    // reset the form data
    setAppScreenshots([]);
    setAppScreenshotsPreview([]);
  }

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setAppCreateData(values => (
      { ...values, [name]: value }
    ));
  }

  const handleAppFormPageSwitchTemplate = (pageType) => {
    const selector = appFormElement.current.querySelector(`#id-${pageType}-form`)
    // if (selector.parentNode.firstElementChild === selector) {
    //   selector.scrollIntoView({'inline': 'end', 'behavior': 'smooth'});
    // } else if (selector.parentNode.lastElementChild === selector) {
    //   selector.scrollIntoView({'inline': 'start', 'behavior': 'smooth'});
    // } else {
    //   selector.scrollIntoView({'inline': 'center', 'behavior': 'smooth'});
    // }
    smoothScrollIntoView(selector, { behavior: 'smooth', scrollMode: 'if-needed' });
    // setTimeout(
    //   () => selector.scrollIntoView({ 'behavior': 'smooth' }),
    //   400
    // );
    const switcherClass = "class-switcher-add:abs|pct:h-100|opacity-100|scale-0.8|overflow-y-hidden|transition:transform_400ms_ease"
    // const pageIndex = appFormPageData[pageType]["index"]
    // new StyleProcessor(selector).removeManyClass("align-items-start align-items-end abs pct:h-100 top-0 neg:left-80 neg:right-80 opacity-100 scale-0.8 overflow-y-hidden z-1 z-2 transition:transform_800ms_ease").addManyClass("relative align-items-center z-3")
    // .addManyClass(`class-reverse-translate-${100*pageIndex-1} transition:transform_800ms_ease`)
    // new StyleProcessor(selector).removeManyClass("lg:align-items-start lg:align-items-end abs pct:h-100 top-0 neg:left-80 neg:right-80 opacity-100 scale-0.8 overflow-y-hidden z-1 z-2 transition:transform_800ms_ease").addManyClass("relative lg:align-items-center z-3")
    // new StyleProcessor(selector.querySelector(".form-page-switch-container")).removeManyClass("opacity-0")
    // if (selector.previousSibling !== null) {
    //   // new StyleProcessor(selector.previousSibling).addManyClass("align-items-end abs pct:h-100 top-0 neg:left-80 opacity-100 scale-0.8 overflow-y-hidden z-1 transform:neg:translate-x-10pct transition:transform_400ms_ease").removeManyClass("relative align-items-center z-2 z-3 lg:pct:flex-basis-60")
    //   // new StyleProcessor(selector.previousSibling).addManyClass(`align-items-end abs pct:h-100 opacity-100 scale-0.8 overflow-y-hidden z-1 transition:transform_400ms_ease class-reverse-translate-${100*appFormPageData[pageType]?.index-1}`).removeManyClass(`align-items-center z-2 z-3 lg:pct:flex-basis-60`)
    //   // new StyleProcessor(selector.previousSibling).addManyClass(`align-items-end class-switcher-add z-1 class-reverse-translate-${100*appFormPageData[pageType]["index"]-1}`).removeManyClass(`align-items-center z-2 z-3 lg:pct:flex-basis-60`)
    //   // new StyleProcessor(selector.previousSibling).addManyClass(`lg:align-items-end abs z-1 transform:translate-x-20`).removeManyClass(`lg:align-items-center relative z-2 z-3 lg:pct:flex-basis-60`)
    //   new StyleProcessor(selector.previousSibling).addManyClass(`class-switcher-add`)
    //   new StyleProcessor(selector.previousSibling.querySelector(".form-page-switch-container")).addManyClass("opacity-0")
    // }
    // if (selector.nextSibling !== null) {
    //   // new StyleProcessor(selector.nextSibling).addManyClass("align-items-start abs pct:h-100 top-0 neg:right-80 opacity-100 scale-0.8 overflow-y-hidden z-2 transform:neg:translate-x-10pct transition:transform_400ms_ease").removeManyClass("relative align-items-center z-1 z-3 lg:pct:flex-basis-60")
    //   // new StyleProcessor(selector.nextSibling).addManyClass(`align-items-start abs pct:h-100 opacity-100 scale-0.8 overflow-y-hidden z-2 transition:transform_400ms_ease class-reverse-translate-${100*appFormPageData[pageType]?.index-1}`).removeManyClass(`align-items-center z-1 z-3 lg:pct:flex-basis-60`)
    //   // new StyleProcessor(selector.nextSibling).addManyClass(`align-items-start class-switcher-add z-2 class-reverse-translate-${100*appFormPageData[pageType]["index"]-1}`).removeManyClass(`align-items-center z-1 z-3 lg:pct:flex-basis-60`)
    //   // new StyleProcessor(selector.nextSibling).addManyClass(`lg:align-items-start abs z-2 transform:neg:translate-x-20`).removeManyClass(`lg:align-items-center relative z-1 z-3 lg:pct:flex-basis-60`)
    //   new StyleProcessor(selector.nextSibling).addManyClass(`class-switcher-add`)
    //   new StyleProcessor(selector.nextSibling.querySelector(".form-page-switch-container")).addManyClass("opacity-0")
    // }

    // Only run the setCurrentFormPage state function. Else the scrollIntoView stops after 800ms on laptops.
    if (size.windowWidth <= deviceWidthEnum.tablet) {
      setCurrentFormPage(() => pageType);
    }

    // scroll the piles into view
    // document.querySelector(`#id-${pageType}-pile`).scrollIntoView({'inline': 'center', 'behavior': 'smooth'});

    /* To show the fragment of the previous and next for pages, clone the elements, add it to the element scrolled into
    * and on scroll out of that element, remove the element from the current view.*/
  }

  const handleAppFormPageSwitch = (evt, pageType) => {
    // setCurrentFormPageIndex(currentFormPageIndex+1);
    handleAppFormPageSwitchTemplate(pageType);
    // selector.previousSibling !== null
    //     ? new StyleProcessor(selector).removeManyClass("align-items-start align-items-end abs neg:left-80 neg:right-80 opacity-30 scale-0.8").addManyClass("align-items-center relative")
    //     : new StyleProcessor(selector).addManyClass("align-items-center").removeManyClass("align-items-start")
    // new StyleProcessor(selector).removeManyClass("align-items-start align-items-end pct:h-100 abs neg:left-80 neg:right-80 opacity-30 scale-0.8 overflow-y-hidden").addManyClass("align-items-center relative")
    // selector.previousSibling !== null
    //     && new StyleProcessor(selector.previousSibling).addManyClass("align-items-end abs neg:left-80 pct:h-100 opacity-30 scale-0.8 overflow-y-hidden").removeManyClass("relative align-items-center lg:pct:flex-basis-60")
    // selector.nextSibling !== null
    //     && new StyleProcessor(selector.nextSibling).addManyClass("align-items-start abs neg:right-80 pct:h-100 opacity-30 scale-0.8 overflow-y-hidden").removeManyClass("relative align-items-center lg:pct:flex-basis-60")
    // setCurrentFormPage(pageType);

    /*
    If the next button is clicked on the basic form, do not use pushState rather, use replaceState so that on click
    of the previous or back button, the "/new" path that was the entry to the page does not exist in the history
    stack.
    */
    /*if (pageType !== "logo") {
      // This is not the basic-form page or the first form page, so use pushState
      window.history.replaceState({}, "", `${createAppFormBaseURL}/${pageType}-form`)
    } else {
      // This is the basic-form page or the first form page so replaceState on navigation to logo-form page
      window.history.pushState({}, "", `${createAppFormBaseURL}/${pageType}-form`)
    }*/
  }

  const handleAppFormPageSwitchBack = (evt, pageType) => {
    // setCurrentFormPageIndex(currentFormPageIndex-1)
    handleAppFormPageSwitchTemplate(pageType);

    /*
    Intersect the replaceState method when the back button is clicked, remember that we no longer have the /new
    in our history stack, so navigating to /new using the back button does not exist. But by adding the below code
    block to intersect the replaceState operation, we can push the /new first before replacing the state.
    */
    // console.log(document.location)

    // Commented on July 29, 2023.
    // if (document.location.href.split("/")[document.location.href.split("/").length - 1] === "basic-form") {
    //   window.history.replaceState({}, "", "/new")
    // } else {
    //   window.history.replaceState({}, "", `${createAppFormBaseURL}/${pageType}-form`)
    // }

    // window.onpopstate = (event) => {
    //   if (document.location.href.split("/")[document.location.href.split("/").length-1] === "basic-form") {
    //       console.log(document.location)
    //     window.history.pushState({}, "", "/new")
    //   }
    // }
  }
  /*window.onpopstate = (event) => {
    console.log(document.location)
    console.log("On POPSTATE")
    console.log(window.history)
    console.log(event)
    event.stopPropagation();
    event.preventDefault()
    // return null;
    if (document.location.pathname === "/new/basic-form") {
      alert("Redirecting to home page")
    //   event.stopPropagation();
    // // if (document.location.href.split("/")[document.location.href.split("/").length-1] === "basic-form") {
    //   console.log(document.location)
    //   window.history.pushState({}, "", "/new")
    }
  }*/

  const handleCategoryChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setAppCategoryData(values => {
      if (values.includes(value)) {
        return values.filter((item) => item !== value);
      } else {
        return [...values, value]
      }
    });
  }

  const updateDescriptionCount = (event) => {
    setDescriptionCount(event.currentTarget.value.length);
  }

  async function checkNameExists(event) {
    const appName = event.currentTarget.value;
    const fieldName = event.currentTarget.name;
    const requestConfig = {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        // 'Origin': '*',
        // 'Authorization': `Bearer ${rawToken}`,
        // 'Content-Type': "multipart/form-data"
      },
      // body: formData,
      // data: formData,
      modes: 'cors',
    }
    // Delay the fetch request for 800ms
    setTimeout(async function () {
      const appExistURL = `${process.env.REACT_APP_BASE_URL}/app/exists/?name=${appName}`;
      await axios(appExistURL, requestConfig)
        .then(response => {
          if (response.status !== 200) throw response;
          return response.data;
        }).then(data => {
          // console.log(data)
          // console.log(fieldInfo, "opem", "fieldName")
          // data?.exists && 
          setFieldInfo(
            values => (
              { ...values, [fieldName]: data?.exists }
            )
          );
        }).catch(error => {
          console.log(error.response?.data.error)
        })
    }, 800)
  }

  return (
    <section
      className="new-app-form-container flex flex-row justify-center items-center w-full h-full overflow-x-hidden overflow-y-hidden">
      {/*<section
        className="new-app-banner lg:pct:w-28 pct:h-86 mg-r4 bg-f9f9f9 bg-mica radius-inherit border-1 border-eeeeee">
        <section className="bg-00995544"></section>
      </section>*/}
      <form method="post" action=""
        className="new-app-form w-full md:h-[92%] h-full overflow-y-auto radius-inherit border0.5 border-gold lg:shadow lg:h-full"
        encType={"multipart/form-data"}
        ref={appFormElement}
        onSubmit={(event) => submitNewAppForm(event)}>
        <input type="hidden" name="csrf_token" />
        {
          isLoggedIn && tokenData?.is_verified !== undefined && !tokenData?.is_verified
            ? <div className={"sticky top-0 flex flex-row items-center p-2 bg-warning/25 backdrop-blur z-50 lg:justify-center"}>
              <span>
                Kindly verify your account to register your app on Nine.
                <br />You won't be able to register your app until you verify your identity
              </span>
              <Link
                to={"/verify-user"}
                className={"d-block h-10 leading-10 ml-4 px-4 bg-warning color-black text-center rounded decoration-none"}>
                Verify account
              </Link>
            </div>
            : null
        }
        <section className={"sticky top-0 flex flex-row flex-nowrap justify-start items-center w-full max-w-full h-[8%] z-10 bg-base-100 backdrop-blur overflow-x-auto every:flex|flex-column|mg-y1|pad-x4|pad-y2 lg:justify-center lg:overflow-hidden dark:bg-111314 dark:color-whitesmoke"} ref={appFormPagePilesContainer}>
          <Link to={"/"} className={"fa fa-arrow-left w-[32px] flex flex-col my-2 px-8 py-4 font-16 decoration-none color-initial lg:absolute lg:left-8 dark:color-whitesmoke"} />
          {
            ["Basic", "Logo", "Screenshots", "Category", "Links"].map((eachPile, index) => {
              return (
                <div key={index} id={`id-${eachPile.toLowerCase()}-pile`} className={`flex flex-col my-2 px-8 py-4 ${eachPile.toLowerCase() === currentFormPage ? "font-bold font-14 text-center" : ""}`}>
                  {eachPile}
                  {
                    appFormPageSuccessfulList[eachPile.toLowerCase()] && appFormPageSuccessfulList[eachPile.toLowerCase()] === true
                      ? <>
                        <div className={"fa fa-check-circle text-success text-center"}></div>
                      </>
                      : null
                  }
                </div>
              )
            })
          }
        </section>

        {
          appCreateResponseData?.successful
            ? <NotifSuccess message={appCreateResponseData.message} />
            : null
        }
        {
          appCreateResponseData?.error
            ? <NotifError message={appCreateResponseData.message} />
            : null
        }
        <section
          className={"relative flex flex-row flex-nowrap flex-1 flex-grow shrink-0 w-full h-[92%] overflow-hidden every:flex|flex-column|pct:w-100|mg-0|pad-0|font-14|bg-white-solid lg:every:flex|flex-column|justify-start|pct:w-100|mg-r4|mg-0|pad-0|font-14|bg-white-transparent"}>
          <PageSwitchContainer id={"id-basic-form"}>
            <PageSwitchContentContainer>
              <PageSwitchHeader>Tell us about your App</PageSwitchHeader>
              <div className={"leading-8 px-4 py-8 bg-base-100 rounded-xl lg:lh-normal lg:px-8 lg:py-8 dark:bg-222425"}>
                <header className={"px-4"}>Hi {tokenData?.firstname}, kindly fill the important details about your App before we list it on Nine.</header>
                <ol className={"px-8 leading-10 list-decimal"}>
                  {/*<header>Guidelines:</header>*/}
                  <li>Required fields have the asterisk symbol on them</li>
                  <li>Use an App name that identifies your App</li>
                  <li>Don't try to add an App you did not create or build or have permission to register on Nine.
                    Strong penalty exist for users that engage in such acts.</li>
                </ol>
              </div>
              <div className={"p-4 space-y-8"}>
                <FormField classes={"font-semibold"}>
                  <LabelField>
                    App Name <span className={"text-error"}>*</span>
                    <TextInput
                      required={true}
                      id={"id-app-name"}
                      name={"name"}
                      placeholder={"Your app name"}
                      value={appCreateData.name || ""}
                      onChange={handleChange}
                      onKeyUp={checkNameExists}
                      maxLength={48}
                    />
                  </LabelField>
                  {appCreateData?.name && fieldInfo?.name && <div className={"px-2 text-error"}>This app name exist</div>}
                </FormField>
                <FormField classes={"font-semibold"}>
                  <LabelField>
                    Describe your app <span className={"text-error"}>*</span>
                    <TextArea
                      id="id-new-app-description"
                      name="description"
                      cols="30"
                      rows="10"
                      required={true}
                      placeholder="Write about your app in few words."
                      value={app_description_textarea_value}
                      onChange={(event) => { handleChange(event); updateDescriptionCount(event) }}
                      maxLength={120}
                    />
                  </LabelField>
                  {<div className={"font-semibold text-sm px-1"}>Character: {descriptionCount} / 120</div>}
                </FormField>
              </div>
            </PageSwitchContentContainer>
            <PageSwitchButtonPanel>
              <NextPageButton
                classes={"w-full h-14"}
                disabled={!(appCreateData?.name && appCreateData?.description)}
                onClick={(evt) => handleAppFormPageSwitch(evt, "logo")}
              ></NextPageButton>
            </PageSwitchButtonPanel>
          </PageSwitchContainer>
          <section id={"id-basic-form"} className={"app-form-page relative flex flex-col w-full items-center flex-grow flex-shrink-0 overflow-y-hidden dark:bg-111314"}>
            <section className={"space-y-5 w-full h-full bg-base-200 overflow-y-auto lg:w-[56%] dark:bg-111314"}>
              <header
                className="relative top-0 block h-20 leading-[5rem] text-lg font-semibold text-center lg:font-18|font-bold|mg-b2 dark:bg-111314">
                Tell us about your App
              </header>
              <div className={"leading-8 px-4 py-8 bg-base-100 rounded-xl lg:lh-normal lg:px-8 lg:py-8 dark:bg-222425"}>
                <header className={"px-4"}>Hi {tokenData?.firstname}, kindly fill the important details about your App before we list it on Nine.</header>
                <ol className={"px-8 leading-10 list-decimal"}>
                  {/*<header>Guidelines:</header>*/}
                  <li>Required fields have the asterisk symbol on them</li>
                  <li>Use an App name that identifies your App</li>
                  <li>Don't try to add an App you did not create or build or have permission to register on Nine.
                    Strong penalty exist for users that engage in such acts.</li>
                </ol>
              </div>
              <div className={"p-4 space-y-8"}>
                <FormField classes={"font-semibold"}>
                  <LabelField>
                    App Name <span className={"text-error"}>*</span>
                    <TextInput
                      required={true}
                      id={"id-app-name"}
                      name={"name"}
                      placeholder={"Your app name"}
                      value={appCreateData.name || ""}
                      onChange={handleChange}
                      onKeyUp={checkNameExists}
                      maxLength={48}
                    />
                  </LabelField>
                  {appCreateData?.name && fieldInfo?.name && <div className={"px-2 text-error"}>This app name exist</div>}
                </FormField>
                <FormField classes={"font-semibold"}>
                  <LabelField>
                    Describe your app <span className={"text-error"}>*</span>
                    <TextArea
                      id="id-new-app-description"
                      name="description"
                      cols="30"
                      rows="10"
                      required={true}
                      placeholder="Write about your app in few words."
                      value={app_description_textarea_value}
                      onChange={(event) => { handleChange(event); updateDescriptionCount(event) }}
                      maxLength={120}
                    />
                  </LabelField>
                  {<div className={"font-semibold text-sm px-1"}>Character: {descriptionCount} / 120</div>}
                </FormField>
              </div>
              {/*<div className={"d-block pct:w-96 mg-x-auto border:0px_solid_BBB em:border-t-0.05"}></div>*/}
              {/* <FormFields
                useDefaultInput={true}
                label_value={"App name"}
                required={true}
                id={"id-app-name"}
                name={"name"}
                placeholder={"Your app name"}
                value={appCreateData.name || ""}
                onChange={handleChange}
                onKeyUp={checkNameExists}
                maxLength={48}
              >
                {appCreateData?.name && fieldInfo?.name && <div className={"font-12 color-red"}>This app name exist</div>}
              </FormFields> */}

              {/*<div className="d-none">
              <input type="text" name="owner" value={tokenData?.user_id || ""} readOnly={true}/>
            </div>*/}



              {/* <div className="form-input-fields relative flex flex-column align-items-start pad-x2 pad-y1">
                <label htmlFor="id-new-app-description" className="pad-y1">
                  Description
                  <span className={"font-bold color-red pad-x-2"}>*</span>
                </label>
                <textarea
                  name="description"
                  id="id-new-app-description"
                  className="pct:w-100 h-12 pad-x2 pad-y2 mg-y1 outline:1px_solid_transparent border:1px_solid_BBB outline-offset-2 focus:outline:2px_solid_gray transition:outline_80ms_ease radius-smr font-family-inherit dark:bg-222425|border:1px_solid_000304|color-whitesmoke dark:focus:outline:3px_solid_444445 resize-none"
                  cols="30" rows="10"
                  required={true}
                  placeholder="Describe your App"
                  value={app_description_textarea_value}
                  onChange={(event) => { handleChange(event); updateDescriptionCount(event) }}
                  maxLength={120}
                />
                {<div className={"font-12"}>Character: {descriptionCount} / 120</div>}
                <span className={""}></span>
                // onChange={(event, props) => appDescriptionChange(event, props)}
              </div> */}
            </section>

            {/* <div className={"form-page-switch-container block sticky bottom-0 left-0 bg-base-200 bg-mica z-100 w-full py-2 dark:bg-111314"}>
              <div className={"bg-base-300 block w-32 ml-auto mr-2 decoration-none"} tabIndex="-1">
                <Button
                  type={"button"}
                  classes={"w-full h-14"}
                  disabled={!(appCreateData?.name && appCreateData?.description)}
                  onClick={(evt) => handleAppFormPageSwitch(evt, "logo")}
                >
                  Next
                  <span className="fa fa-angle-right mg-l2"></span>
                </Button>
                <button
                  type="button"
                  className="btn btn-active"
                  tabIndex="-1"
                  disabled={!(appCreateData?.name && appCreateData?.description)}
                >
                  Next
                  <span className="fa fa-angle-right mg-l2"></span>
                </button>
              </div>
            </div> */}
            <PageSwitchButtonPanel>
              <NextPageButton
                classes={"w-full h-14"}
                disabled={!(appCreateData?.name && appCreateData?.description)}
                onClick={(evt) => handleAppFormPageSwitch(evt, "logo")}
              ></NextPageButton>
            </PageSwitchButtonPanel>
          </section>

          <PageSwitchContainer id={"id-logo-form"}>
            <PageSwitchContentContainer>
              <PageSwitchHeader>Upload your App logo</PageSwitchHeader>
              <div className={"d-block mx-auto text-center"}>
                <div className={"d-block mx-auto w-72 h-72 leading-[18rem] rounded-full bg-base-100 border-2 border-dashed border-base-100 dark:bg-222425"}>
                  {
                    appImage && (
                      <div className={"relative block w-full h-full rounded-full"}>
                        <img src={appImagePreview} alt={"App uploaded logo"} style={{}}
                          className={"block max-w-full h-full object-center object-cover rounded-full"} />
                      </div>
                    )
                  }
                </div>
                <label htmlFor="id-image-upload" className={"inline-block h-12 leading-[3rem] btn btn-ghost bg-base-100 px-6 my-4 dark:bg-222425|color-whitesmoke"}>Set App Logo</label>
                <input
                  type="file"
                  id="id-image-upload"
                  name={"logo"}
                  accept=".jpg,.jpeg,.png"
                  onChange={handleAppImageChange}
                  hidden
                />
              </div>
            </PageSwitchContentContainer>
            <PageSwitchButtonPanel>
              <PrevPageButton
                onClick={(e) => { handleAppFormPageSwitchBack(e, "basic") }}
              ></PrevPageButton>
              <NextPageButton
                classes={"w-full h-14"}
                onClick={(evt) => handleAppFormPageSwitch(evt, "screenshots")}
              ></NextPageButton>
            </PageSwitchButtonPanel>
          </PageSwitchContainer>

          <section id={"id-logo-form"} className={"app-form-page relative items-center w-full flex-grow flex-shrink-0 overflow-y-hidden lg:items-center dark:bg-111314"}>
            <section className={"w-full h-full overflow-y-auto lg:w-[56%] dark:bg-111314|color-whitesmoke"}>
              {/*<button type={"button"}*/}
              {/*        className={"fa fa-angle-left font-16 d-block abs top-1 left-0 z-100 square-8 lh-8 border-0 text-center radius-circle bg-initial decoration-none color-initial"}*/}
              {/*        onClick={() => navigate('/')}>*/}
              {/*  /!*<span className="fa fa-arrow-left fa-16 relative"></span>*!/*/}
              {/*</button>*/}
              <header
                className="relative top-0 block h-20 leading-[5rem] text-lg font-semibold text-center lg:font-18|font-bold|mg-b2 dark:bg-111314">
                Upload your App logo
              </header>
              <div className={"d-block mx-auto text-center"}>
                <div className={"d-block mx-auto w-72 h-72 leading-[18rem] rounded-full border-2 border-dashed border-gray-700 dark:bg-222425"}>
                  {
                    appImage && (
                      <div className={"relative block w-full h-full rounded-full"}>
                        <img src={appImagePreview} alt={"App uploaded logo"} style={{}}
                          className={"block max-w-full h-full object-center object-cover rounded-full"} />
                      </div>
                    )
                  }
                </div>
                <label htmlFor="id-image-upload" className={"inline-block h-12 leading-[3rem] btn btn-ghost bg-base-100 px-6 my-4 dark:bg-222425|color-whitesmoke"}>Set App Logo</label>
                <input
                  type="file"
                  id="id-image-upload"
                  name={"logo"}
                  accept=".jpg,.jpeg,.png"
                  onChange={handleAppImageChange}
                  hidden
                />
              </div>
            </section>

            {/* <div className={"form-page-switch-container flex flex-row sticky bottom-0 left-0 bg-base-200 bg-mica z-100 w-full py-2 dark:bg-111314"}>
              <Button
                onClick={(e) => { handleAppFormPageSwitchBack(e, "basic") }}
              >
                <span className="fa fa-angle-left"></span>
              </Button>
              <a
                href={e => e.preventDefault()}
                hre={"#id-basic-form"}
                className={"flex-shrink-0 block square-8 h-8 lh-8 mg-x2 radius2 text-center decoration-none border-0 bg-light color-initial font-extrabold cursor-pointer dark:bg-333435|color-whitesmoke"}
                onClick={(event) => {
                  // document.querySelector("#id-basic-form").scrollIntoView()
                  // window.history.back();
                  handleAppFormPageSwitchBack(event, "basic")
                  // window.history.replaceState({}, "", `new`);
                }} tabIndex="-1">
                <span className="fa fa-angle-left"></span>
              </a>
              <div id={"#id-screenshots-form"} className={"block w-32 ml-auto mr-2 decoration-none"} tabIndex="-1">
                <Button
                  classes={"w-full h-14"}
                  onClick={(evt) => handleAppFormPageSwitch(evt, "screenshots")}
                >
                  Next <span className="fa fa-angle-right mg-l2"></span>
                </Button>
                <button
                  type="button"
                  className="d-block pct:w-100 h-8 lh-8 pad-x2 bg-light radius2-xs font-14 font-black border-0 cursor-pointer
                  outline:1px_solid_transparent outline-offset-2 focus:outline:2px_solid_gray transition:outline_80ms_ease disabled:cursor-not-allowed dark:bg-333435|color-whitesmoke dark:disabled:color-898989|opacity-60"
                  tabIndex="-1"
                // disabled={appImage}
                >
                  Next <span className="fa fa-angle-right mg-l2"></span>
                </button>
              </div>
            </div> */}

            <PageSwitchButtonPanel>
              <PrevPageButton
                onClick={(e) => { handleAppFormPageSwitchBack(e, "basic") }}
              ></PrevPageButton>
              <NextPageButton
                classes={"w-full h-14"}
                onClick={(evt) => handleAppFormPageSwitch(evt, "screenshots")}
              ></NextPageButton>
            </PageSwitchButtonPanel>
          </section>

          <PageSwitchContainer id={"id-screenshots-form"}>
            <PageSwitchContentContainer>
              <PageSwitchHeader>Upload Screenshots of your app</PageSwitchHeader>
              <section className={"pad-y4"}>
                {
                  appScreenshotsPreview.length < 1
                    ? <label
                      htmlFor={"id-app-screenshot-upload"}
                      className={"flex flex-col justify-center items-center w-[96%] h-[240px] bg-base-100 border-2 border-dashed border-base-100 mx-auto mb-4 rounded-xl text-base-content"}>
                      <span className="fa fa-plus text-xl py-4"></span>
                      <div>Select images to upload</div>
                      <div>Maximum of 4 images</div>
                      <input
                        id={"id-app-screenshot-upload"}
                        type="file"
                        name={"screenshot"}
                        hidden
                        accept={"image/*"}
                        multiple
                        onChange={handleAppScreenshotSelect}
                      />
                    </label>
                    : <section
                      className={"flex flex-row flex-wrap justify-around px-2 every:pct:w-48|h-320|mg-b2|bg-lighter|radius-sm"}>
                      {
                        appScreenshotsPreview?.map((screenshot_obj, index) => (
                          <div key={index}
                            className={"w-[48%] h-[320px] bg-base-100 mb-4 px-2 rounded-lg"}>
                            <img src={screenshot_obj}
                              alt={`screenshot preview ${index}`}
                              height={"100%"}
                              className={"max-w-full object-cover object-center rounded-lg"} />
                          </div>
                        ))
                      }
                      {
                        appScreenshotsPreview?.length > 0
                          ? new Array(4 - appScreenshotsPreview?.length).fill("").map((_, index) => (
                            <label key={index}
                              htmlFor={"id-app-screenshot-upload"}
                              className={"flex flex-col justify-center items-center text-center bg-base-100 border-2 border-dashed border-base-100 mx-auto rounded-xl color-999 decoration-none dark:bg-222425 dark:border-2 dark:border-base-100"}>
                              <span className="fa fa-plus text-xl py-4"></span>
                              <input
                                id={"id-app-screenshot-upload"}
                                type="file"
                                name={"screenshot"}
                                hidden
                                accept={"image/*"}
                                multiple
                                onChange={handleAppScreenshotSelect}
                              />
                            </label>
                          ))
                          : null
                      }
                    </section>
                }
              </section>
            </PageSwitchContentContainer>
            <PageSwitchButtonPanel>
              <PrevPageButton
                onClick={(e) => { handleAppFormPageSwitchBack(e, "logo") }}
              ></PrevPageButton>
              <NextPageButton
                disabled={!appScreenshots}
                onClick={(evt) => handleAppFormPageSwitch(evt, "category")}
              ></NextPageButton>
            </PageSwitchButtonPanel>
          </PageSwitchContainer>

          <section id={"id-screenshots-form"} className={"app-form-page relative items-center w-full flex-grow flex-shrink-0 overflow-y-hidden lg:items-center dark:bg-111314"}>
            <section className={"pct:w-100 pct:h-100 bg-white-solid overflow-y-auto lg:pct:w-56 dark:bg-111314"}>
              <header className={"relative top-0 d-block h-10 lh-10 font-15 font-semibold text-center bg-white bg-mica-smt border-b2 lg:font-18|font-bold|mg-b2 dark:bg-111314|color-whitesmoke"}>
                Upload Screenshots of your app
                {/*<span className={"d-block font-italic"}>You could upload this later</span>*/}
              </header>
              <section className={"pad-y4"}>
                {
                  appScreenshotsPreview.length < 1
                    ? <label
                      htmlFor={"id-app-screenshot-upload"}
                      className={"flex flex-column justify-center align-items-center pct:w-96 h-160 border:2px_dashed_DDD mg-x-auto mg-b2 radius color-BBB"}>
                      <span className="fa fa-plus font-24 pad-y2"></span>
                      <div>Select images to upload</div>
                      <div>Maximum of 4 images</div>
                      <input
                        id={"id-app-screenshot-upload"}
                        type="file"
                        name={"screenshot"}
                        hidden
                        accept={"image/*"}
                        multiple
                        onChange={handleAppScreenshotSelect}
                      />
                    </label>
                    : <section
                      className={"flex flex-row flex-wrap justify-around pad-x1 every:pct:w-48|h-320|mg-b2|bg-lighter|radius-sm"}>
                      {
                        appScreenshotsPreview?.map((screenshot_obj, index) => (
                          <div key={index}
                            className={"pad-x-2 radius-inherit"}>
                            <img src={screenshot_obj}
                              alt={`screenshot preview ${index}`}
                              height={"100%"}
                              className={"pct:max-w-100 object-cover object-center radius-inherit"} />
                          </div>
                        ))
                      }
                      {
                        appScreenshotsPreview?.length > 0
                          ? new Array(4 - appScreenshotsPreview?.length).fill("").map((_, index) => (
                            <label key={index}
                              htmlFor={"id-app-screenshot-upload"}
                              className={"flex flex-column justify-center align-items-center text-center border:2px_dashed_DDD mg-x-auto radius color-999 decoration-none dark:bg-222425 dark:border:2px_solid_gray"}>
                              <span className="fa fa-plus font-24 pad-y2"></span>
                              <input
                                id={"id-app-screenshot-upload"}
                                type="file"
                                name={"screenshot"}
                                hidden
                                accept={"image/*"}
                                multiple
                                onChange={handleAppScreenshotSelect}
                              />
                            </label>
                          ))
                          : null
                      }
                    </section>
                }
                {/*{
                  appScreenshotsPreview.length < 1
                      ? <label
                          htmlFor={"id-app-screenshot-upload"}
                          className={"flex flex-column justify-center align-items-center pct:w-96 h-160 border:2px_dashed_DDD mg-x-auto mg-y2 radius color-BBB"}>
                        <span className="fa fa-plus font-24 pad-y2"></span>
                        <div>Select images to upload</div>
                        <input
                            id={"id-app-screenshot-upload"}
                            type="file"
                            name={"screenshot"}
                            hidden
                            accept={"image/*"}
                            multiple
                            onChange={handleAppScreenshotSelect}
                        />
                      </label>
                      : <section
                          className={"flex flex-row flex-nowrap justify-start pad-x1 every:pct:w-25|h-180|bg-lighter|radius-sm"}>
                        {
                          appScreenshotsPreview.map((image, index) => (
                              <div className={"pad-x-2 radius-inherit"}><img key={index} src={image}
                                                                             alt={`screenshot preview ${index}`}
                                                                             height={"100%"}
                                                                             className={"pct:max-w-100 object-cover object-center radius-inherit"}/>
                              </div>
                          ))
                        }
                      </section>
                }*/}
              </section>
            </section>
            <div
              className={"form-page-switch-container flex flex-row sticky bottom-0 left-0 bg-white bg-mica z-100 pct:w-100 pad-y2 dark:bg-111314"}>
              <a href={e => e.preventDefault}
                hre={"#id-logo-form"}
                className={"flex-noshrink d-block square-8 h-8 lh-8 mg-x2 radius2 text-center decoration-none border-0 bg-light color-initial font-extrabold cursor-pointer dark:bg-333435|color-whitesmoke"}
                onClick={(event) => {
                  // window.history.back();
                  handleAppFormPageSwitchBack(event, "logo")
                  // window.history.replaceState({}, "", `#id-logo-form`);
                }} tabIndex="-1">
                <span className="fa fa-angle-left"></span>
              </a>
              <a hre={"#id-category-form"} className={"d-block pct:w-32 mg-l-auto mg-r2 decoration-none lg:w-120"}
                tabIndex="-1"
                onClick={(evt) => handleAppFormPageSwitch(evt, "category")}>
                <button
                  type="button"
                  className="d-block pct:w-100 h-8 lh-8 pad-x2 bg-light radius2-xs font-14 font-black border-0 cursor-pointer
                  outline:1px_solid_transparent outline-offset-2 focus:outline:2px_solid_gray transition:outline_80ms_ease disabled:cursor-not-allowed dark:bg-333435|color-whitesmoke dark:disabled:color-898989|opacity-60"
                  tabIndex="-1"

                >
                  Next <span className="fa fa-angle-right mg-l2"></span>
                </button>
              </a>
            </div>
          </section>

          <PageSwitchContainer id={"id-category-form"}>
            <PageSwitchContentContainer>
              <PageSwitchHeader>Select a category for your App</PageSwitchHeader>
              <section id="id-new-app-category-fragment" className={"new-app-category-fragment relative lg:px-4"}>
                <div
                  className={"sticky top-0 block w-full bg-white backdrop-blur z-1 dark:bg-base-100/40 dark:radius2"}
                  ref={selectedCategoryContainer}>
                  {
                    appCategoryData?.map((eachCategory, index) => (
                      <span key={index} id={`id-category-${index}`}
                        className="inline-block h-5 lh-5 pad-x2 mg-x1 mg-y1 radius-round bg-lighter border:1px_solid_BBB font-bold dark:bg-333435|color-whitesmoke dark:border-0">
                        {eachCategory}
                      </span>
                    ))
                  }
                  {
                    defaultAppsCategory &&
                    <div className="block absolute top-0 right-4 h-12 leading-[3rem] px-2 text-center font-bold z-100 dark:color-darkgray">
                      {selectedCategoryCount} of 4
                    </div>
                  }
                </div>
                <section className={"relative"} ref={categoryItemsContainer}>
                  {
                    defaultAppsCategory
                      ? defaultAppsCategory?.map((eachAppsCategory, index) => {
                        return (
                          <div key={index} className={"relative dark:color-whitesmoke"}>
                            <input
                              key={index}
                              type="checkbox"
                              name={"category"}
                              id={`id-category-${index}`}
                              className={"peer/sibling-categoryname appearance-none block w-[96%] h-16 leading-[4rem] px-6 py-1 border-0 radius2 text-left cursor-pointer lg:hover:pct:w-100|mg-x-auto|bg-green-inverse disabled:color-lightgray|cursor-not-allowed checked:bg-green|color-FFFFFF|pct:w-100|mg-x-auto|mg-y-2 transition:all_200ms_ease dark:disabled:color-898989|opacity-20"}
                              // defaultChecked={appData?.category.split(",").includes(eachAppsCategory)}
                              defaultValue={eachAppsCategory}
                              onChange={handleCategoryChange}
                              disabled={!appCategoryData?.includes(eachAppsCategory) && appCategoryData?.length === 4}
                            />
                            <label
                              htmlFor={`id-category-${index}`}
                              className={"d-block abs top-0 left-0 h-8 lh-8 pad-x3 pad-y-3 border-0 radius2 text-left cursor-pointer peer-checked/sibling-categoryname:text-base-content peer-disabled/sibling-categoryname:text-gray-600 peer-disabled/sibling-categoryname:cursor-not-allowed dark:peer-disabled/sibling-categoryname:text-neutral-content dark:peer-disabled/sibling-categoryname:opacity-40"}
                              data-category_name={eachAppsCategory}
                              data-category_item_selected={false}
                                /*onClick={(event) => addToSelectedCategory(event)}*/>
                              {eachAppsCategory}
                            </label>
                          </div>
                        )
                      })
                      : <div className={"flex flex-col w-full h-[640px] justify-center items-center"}>
                        Error fetching categories
                        <div>Check your network connection</div>
                      </div>
                  }
                </section>
              </section>
            </PageSwitchContentContainer>
            <PageSwitchButtonPanel>
              <PrevPageButton
                onClick={(e) => { handleAppFormPageSwitchBack(e, "screenshots") }}
              ></PrevPageButton>
              <NextPageButton
                disabled={appCreateData?.length < 1}
                onClick={(evt) => handleAppFormPageSwitch(evt, "links")}
              ></NextPageButton>
            </PageSwitchButtonPanel>
          </PageSwitchContainer>

          {/*<div className="bg-light pct:w-100 border-thin border-BBB border-bottom-solid"></div>*/}
          <section id={"id-category-form"} className={"app-form-page relative items-center w-full flex-grow flex-shrink-0 overflow-y-hidden lg:items-center dark:bg-111314"}>
            <section className={"pct:w-100 pct:h-100 bg-white-solid overflow-y-auto lg:pct:w-56 dark:bg-111314"}>
              <header
                className="relative top-0 d-block h-10 lh-10 font-15 font-semibold text-center bg-white bg-mica-smt border-b2 lg:font-18|font-bold|mg-b2 dark:bg-111314|color-darkgray">
                Select a category for your App
              </header>
              <section id="id-new-app-category-fragment" className={"new-app-category-fragment relative lg:pad-x2"}>
                <div
                  className={"sticky px:top-0 d-block pct:w-100 bg-white bg-mica z-1 dark:bg-222425 dark:radius2"}
                  ref={selectedCategoryContainer}>
                  {
                    appCategoryData?.map((eachCategory, index) => (
                      <span key={index} id={`id-category-${index}`}
                        className="d-inline-block h-5 lh-5 pad-x2 mg-x1 mg-y1 radius-round bg-lighter border:1px_solid_BBB font-bold dark:bg-333435|color-whitesmoke dark:border-0">
                        {eachCategory}
                      </span>
                    ))
                  }
                  <div className="d-block abs px:top-0 right-4 h-6 lh-6 pad-x1 text-center font-bold z-100 dark:color-darkgray">
                    {selectedCategoryCount} of 4
                  </div>
                </div>
                <section className={""} ref={categoryItemsContainer}>
                  {
                    defaultAppsCategory?.map((eachAppsCategory, index) => {
                      return (
                        <div key={index} className={"relative dark:color-whitesmoke"}>
                          <input
                            key={index}
                            type="checkbox"
                            name={"category"}
                            id={`id-category-${index}`}
                            className={"sibling-categoryname appearance-none d-block pct:w-96 h-8 lh-8 pad-x3 pad-y-3 border-0 radius2 text-left cursor-pointer lg:hover:pct:w-100|mg-x-auto|bg-green-inverse disabled:color-lightgray|cursor-not-allowed checked:bg-green|color-FFFFFF|pct:w-100|mg-x-auto|mg-y-2 transition:all_200ms_ease dark:disabled:color-898989|opacity-20"}
                            // defaultChecked={appData?.category.split(",").includes(eachAppsCategory)}
                            defaultValue={eachAppsCategory}
                            onChange={handleCategoryChange}
                            disabled={!appCategoryData?.includes(eachAppsCategory) && appCategoryData?.length === 4}
                          />
                          <label
                            htmlFor={`id-category-${index}`}
                            className={"d-block abs top-0 left-0 h-8 lh-8 pad-x3 pad-y-3 border-0 radius2 text-left cursor-pointer checked:sibling-categoryname:color-white disabled:sibling-categoryname:color-lightgray|cursor-not-allowed dark:disabled:sibling-categoryname:color-darkgray|opacity-40"}
                            data-category_name={eachAppsCategory}
                            data-category_item_selected={false}
                                /*onClick={(event) => addToSelectedCategory(event)}*/>
                            {eachAppsCategory}
                          </label>
                        </div>
                      )
                    })
                  }
                </section>
              </section>
              {/*<section id="id-new-app-category-fragment" className="new-app-category-fragment">*/}
              {/*  /!*<NewAppCategory isOpen={isAppCategoryModesOpen}/>*!/*/}
              {/*  <section className="h-10 lh-10 text-center font-18 font-bold">Select Category</section>*/}
              {/*  <div*/}
              {/*      className={"d-block"}*/}
              {/*      ref={selectedCategoryContainer}></div>*/}
              {/*  <input type="text" id="id-new-app-category-value" className="new-app-category d-none" name="category"*/}
              {/*         onChange={handleChange} readOnly={true} ref={categoryInputField}/>*/}
              {/*  <div className="d-block abs px:top-8 right-4 h-8 lh-8 pad-x1 text-center font-bold">*/}
              {/*    {selectedCategoryCount} of 4*/}
              {/*  </div>*/}
              {/*  <section ref={categoryItemsContainer}>*/}
              {/*    {defaultAppsCategory?.map((each_apps_category, _) => {*/}
              {/*      return (*/}
              {/*          <button type={"button"} key={_}*/}
              {/*                  className="d-block pct:w-100 h-8 lh-8 pad-x3 pad-y-3 border-0 bg-transparent radius2 text-left lg:hover:pct:w-96|mg-x-auto|bg-d0dad5 transition:all_200ms_ease disabled:color-light"*/}
              {/*                  data-category_name={each_apps_category}*/}
              {/*                  data-category_item_selected={false}*/}
              {/*                  onClick={(event) => addToSelectedCategory(event)}>{each_apps_category}</button>*/}
              {/*      )*/}
              {/*    })}*/}
              {/*  </section>*/}
              {/*</section>*/}

            </section>
            <div
              className={"form-page-switch-container flex flex-row sticky bottom-0 left-0 right-0 bg-white bg-mica z-100 pct:w-100 pad-y2 dark:bg-111314"}>
              <a href={e => e.preventDefault()}
                hre={"#id-screenshots-form"}
                className={"flex-noshrink d-block square-8 h-8 lh-8 mg-x2 radius2 text-center decoration-none border-0 bg-light color-initial font-extrabold cursor-pointer dark:bg-333435|color-whitesmoke"}
                onClick={(event) => {
                  // window.history.back();
                  handleAppFormPageSwitchBack(event, "screenshots")
                  // window.history.replaceState({}, "", `#id-screenshots-form`);
                }} tabIndex="-1">
                <span className="fa fa-angle-left"></span>
              </a>
              <a hre={"#id-links-form"} className={"d-block pct:w-32 mg-l-auto mg-r2 decoration-none lg:w-120"} tabIndex="-1" onClick={(evt) => handleAppFormPageSwitch(evt, "links")}>
                <button
                  type="button"
                  className="d-block pct:w-100 h-8 lh-8 pad-x2 bg-light radius2-xs font-14 font-black border-0 cursor-pointer
                outline:1px_solid_transparent outline-offset-2 focus:outline:2px_solid_gray transition:outline_80ms_ease disabled:cursor-not-allowed dark:bg-333435|color-whitesmoke dark:disabled:color-898989|opacity-60"
                  tabIndex="-1"
                  disabled={appCreateData?.length < 1}
                >
                  Next <span className="fa fa-angle-right mg-l2"></span>
                </button>
              </a>
            </div>
          </section>

          <PageSwitchContainer id={"id-links-form"}>
            <PageSwitchContentContainer>
              <PageSwitchHeader>Add Links to download your app</PageSwitchHeader>
              <div className={"p-4 space-y-8"}>
                <FormField>
                  <LabelField>
                    Play Store
                    <TextInput
                      id={"id-new-app-playstore-link"}
                      name={"playstore_link"}
                      placeholder={"PlayStore download link"}
                      onChange={handleChange}
                    />
                  </LabelField>
                </FormField>
                <FormField>
                  <LabelField>
                    App Store
                    <TextInput
                      id={"id-new-app-appstore-link"}
                      name={"appstore_link"}
                      placeholder={"AppStore download link"}
                      onChange={handleChange}
                    />
                  </LabelField>
                </FormField>
                <FormField>
                  <LabelField>
                    Other Store
                    <TextInput
                      type={"url"}
                      id={"id-new-app-external-link"}
                      name={"external_link"}
                      placeholder={"Link to other Store download link"}
                      onChange={handleChange}
                    />
                  </LabelField>
                </FormField>
                <FormField>
                  <LabelField>
                    Other Store
                    <TextInput
                      type={"url"}
                      id={"id-new-app-website"}
                      name={"website"}
                      placeholder={"Your app's website or landing page"}
                      onChange={handleChange}
                    />
                  </LabelField>
                </FormField>
              </div>
            </PageSwitchContentContainer>
            <PageSwitchButtonPanel>
              <PrevPageButton
                onClick={(e) => { handleAppFormPageSwitchBack(e, "category") }}
              ></PrevPageButton>
              <div className={"bg-base-300 block w-[80%] ml-auto decoration-none"} tabIndex="-1">
                <Button
                  classes={"btn-success w-full h-14"}
                  disabled={!(appLinksValid && tokenData?.is_verified)}
                  onClick={showLoadingState}
                >
                  {isSubmit ? <span className='fa fa-spinner fa-spin'></span> : "Create"}
                </Button>
              </div>
            </PageSwitchButtonPanel>
          </PageSwitchContainer>

          <section id={"id-links-form"} className={"app-form-page relative items-center w-full flex-grow flex-shrink-0 overflow-y-hidden lg:items-center dark:bg-111314"}>
            <section className={"pct:w-100 pct:h-100 bg-white-solid overflow-y-auto lg:pct:w-56 dark:bg-111314"}>
              <header
                className="sticky top-0 d-block h-10 lh-10 font-15 font-semibold text-center bg-white bg-mica-smt border-b2 lg:font-18|font-bold|mg-b2 dark:bg-111314|color-darkgray">
                Add Links to download your app
                {/*App Links*/}
                {/*<div className={"font-12"}>Links to download your app</div>*/}
              </header>
              <FormFields
                useDefaultInput
                label_value={"Play Store"}
                id={"id-new-app-playstore-link"}
                name={"playstore_link"}
                placeholder={"PlayStore download link"}
                onChange={handleChange}
              />
              <FormFields
                useDefaultInput
                label_value={"AppStore"}
                id={"id-new-app-appstore-link"}
                name={"appstore_link"}
                placeholder={"AppStore download link"}
                onChange={handleChange}
              />
              <FormFields
                useDefaultInput
                type={"url"}
                label_value={"Other Store"}
                id={"id-new-app-external-link"}
                name={"external_link"}
                placeholder={"Link to other Store download link"}
                onChange={handleChange}
              />
              <FormFields
                useDefaultInput={true}
                type={"url"}
                label_value={"App website"}
                id={"id-new-app-website"}
                name={"website"}
                placeholder={"Your app's website or landing page"}
                onChange={handleChange}
              />
            </section>
            <div
              className={"form-page-switch-container flex flex-row sticky bottom-0 left-0 bg-white bg-mica z-100 pct:w-100 pad-y2 dark:bg-111314"}>
              <a hre={"#id-category-form"} href={(e) => e.preventDefault()}
                className={"flex-noshrink d-block square-8 h-8 lh-8 mg-x2 radius2 text-center decoration-none border-0 bg-light color-initial font-extrabold cursor-pointer dark:bg-333435|color-whitesmoke"}
                onClick={(event) => {
                  // window.history.back();
                  handleAppFormPageSwitchBack(event, "category")
                  // window.history.replaceState({}, "", `#id-category-form`);
                }} tabIndex="-1">
                <span className="fa fa-angle-left"></span>
              </a>
              <button type="submit"
                className="d-block pct:w-88 h-8 lh-8 pad-x3 bg-green-solid color-FFF radius2-xs mg-l-auto mg-r2 font-14 font-medium border-0 cursor-pointer
                    outline:1px_solid_transparent outline-offset-2 focus:outline:2px_solid_green transition:outline_80ms_ease|width_800ms_ease lg:w-120 disabled:bg-green-inverse|color-gray|cursor-not-allowed dark:disabled:color-898989|opacity-80"
                onClick={showLoadingState}
                disabled={!(appLinksValid && tokenData?.is_verified)}
                tabIndex="-1">
                {isSubmit ? <span className='fa fa-spinner fa-spin'></span> : "Create"}
              </button>
            </div>
          </section>
        </section>
      </form>
    </section>
  )
}

class CreateForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      is_form_empty: true,
      is_form_valid: false,
    }
  }

  render() {
    return (
      <section id="id-new-app-form-fragment"
        className="new-app-form-fragment flex flex-row justify-center align-items-center h-screen overflow-y-hidden">
        <CreateAppsForm />
      </section>
    )
  }
}

export default CreateForm