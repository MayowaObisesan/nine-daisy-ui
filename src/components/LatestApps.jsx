import React, { useEffect, useRef, useState } from 'react'
import { AppBoxes } from "./AppBoxes";
import axios from 'axios';
// import { ListApps } from './loaders/appLoaders';
import { useLoaderData, useNavigation } from 'react-router-dom';

// export async function loader() {
//   const apps = await ListApps();
//   return { apps };
// }

const AppLoadingList = () => {
  return (
    <section className="flex flex-row flex-wrap justify-around">
      <section className="h-180 pct:w-100 ma-w-320 mg-b4 gradient:to_bottom_right-EEEEEE-whitesmoke radius lg:pct:w-30"></section>
      <section className="h-180 pct:w-100 ma-w-320 mg-b4 gradient:to_bottom_right-EEEEEE-whitesmoke radius lg:pct:w-30"></section>
      <section className="h-180 pct:w-100 ma-w-320 mg-b4 gradient:to_bottom_right-EEEEEE-whitesmoke radius lg:pct:w-30"></section>
      <section className="h-180 pct:w-100 ma-w-320 mg-b4 gradient:to_bottom_right-EEEEEE-whitesmoke radius lg:pct:w-30"></section>
    </section>
  )
}

const AppList = props => {
  const appsList = props.appsList
  const isAppsListEmpty = props.isAppsListEmpty
  const isNetworkError = props.isNetworkError

  if (appsList?.length < 1) {
    return (
      <section className={"flex flex-col flex-wrap justify-center items-center h-[480px] pad-y6 lh-6 dark:color-darkgray"}>
        <div className={"font-14 font-medium lg:font-16"}>No Apps listed on Nine yet.</div>
        <div className={"font-16 text-center lg:fon-21"}>Be the first to register your app.</div>
      </section>
    )
  } else if (!isAppsListEmpty) {
    return (
      <section id={"id-latest-apps-container"}
        className={`flex flex-row flex-wrap justify-between overflow-x-auto mg-t2 gap-4`}>
        {
          appsList?.length > 0
            ? appsList.map((each_apps_obj, index) => {
              return (
                <section key={index} className={"flex flex-col items-center w-full md:w-[340px] lg:w-[364px] lg:min-w-80 lg:max-w-[26rem] lg:flex-1 pct:w-100 lg:pct:w-33"}>
                  <AppBoxes key={each_apps_obj.id} id={each_apps_obj.id} name={each_apps_obj.name}
                    description={each_apps_obj.description} category={each_apps_obj.category}
                    truncate_description={true} {...each_apps_obj}
                  />
                </section>
                // <div key={each_apps_obj.app_name}>
                //     {each_apps_obj.app_name}
                //     {each_apps_obj.app_category}
                // </div>
              )
            })
            : null
        }
        {
          props.children?.length > 0 ? props.children.map((each_apps_obj, index) => {
            return (
              <AppBoxes key={each_apps_obj.id} id={each_apps_obj.id} name={each_apps_obj.name}
                description={each_apps_obj.description} category={each_apps_obj.category}
                truncate_description={true} {...each_apps_obj}
              />
            )
          }) : null
        }
      </section>
    )
  }
  else if (isNetworkError) {
    return <section className="flex flex-row flex-wrap justify-center align-items-center pct:h-100">
      <section className="d-block font-14 font-semibold">
        <span className="relative fa fa-wifi font-32 color-light mg-y4">
          <span className="fa fa-circle color-gray font-8 abs left-0 right-0 bottom-4"></span>
        </span>
        <div className="d-block">Network Error.</div>
        <span>Unable to Fetch Apps.</span>
      </section>
    </section>
  } else {
    return <section className="flex flex-row flex-wrap justify-center align-items-center pct:h-100">
      <section className="d-block font-14">
        <section className="d-block font-14 font-semibold">
          <span className="relative fa fa-question font-32 color-light mg-y4">
            <span className="fa fa-circle color-gray font-8 abs left-0 right-0 bottom-4"></span>
          </span>
          <div className="d-block">Something went wrong.</div>
          <span>Unable to Fetch Apps.</span>
        </section>
      </section>
    </section>
  }
}

let showAppDetailModes = false
const displayAppDetail = (props) => {
  showAppDetailModes = !showAppDetailModes
  console.log(showAppDetailModes)
  alert(showAppDetailModes)
}

/*
function AppBoxes (props) {
  return (
    <section key={props.name}
      // className="relative flex flex-column justify-center align-items-center lg:pct:w-16 pct:min-w-56 pct:max-w-16 sm:pct:max-w-56 text-center radius-sm shadow hover:shadow3 hover:cursor-pointer pad-top4 mg-x2 mg-y2">
      //        className="relative flex flex-column justify-center align-items-center vh:h-36 pct:w-45 max-w-320 mg-y4 gradient:to_bottom_right-#EEE-whitesmoke radius2 shadow:0px-0px-1px-2px-C8EAD1 text-center hover:cursor-pointer font-14"
      //        className="relative pct:w-100 gradient:to_bottom_right-lightgray-whitesmoke radius shadow:0px-0px-1px-2px-C8EAD1 hover:cursor-pointer font-14"
             className="relative pct:w-100 gradient:to_bottom_right-lightgray-whitesmoke radius hover:cursor-pointer font-14 mg-b2"
             onClick={new NEH().drawAppsDetailsTemplate}>
      <Link to={`/app/${props.id}`} state={{ app_name: props.name }}
            className="relative flex flex-column justify-center pct:w-100 decoration-none color-initial font-14">
        {/!*<div className="square-12 radius-circle bg-light mg-t3"></div>*!/}
        <div className="h-280 pct:w-100 bg-light radius-top-left radius-top-right"></div>
        <div className="pad-t2 pad-x2 font-semibold font-18">{props.name}</div>
        <div className="pad-x2 font-12">{truncate_letters(props.description, 0, 30)}</div>
        {/!*<div className="pad-t2 text-center font-semibold">{props.playstore_link}</div>*!/}
        <div className="pad-y1 pad-x1">
          {props.category.split(',').map((each_app_category, index) => {
            return (<span key={index}
              className="d-inline-block pad-x2 h-4 lh-4 mg-x1-smt radius-round bg-light font-normal font-10">{each_app_category}</span>)
          })}
        <section className="flex flex-row justify-start align-items-center pad-x1 pad-y2 mg-t2 border:0px_solid_lightgray em:border-t-0.05">
          <img src="" alt="" className="square-4 lh-4 radius-circle bg-lighter"/>
          <div className="pad-x1 font-medium">{props.owner.firstname} {props.owner.lastname}</div>
        </section>
        </div>
      </Link>

    </section>
  )
}
*/

// class LatestAppsFragmentClass extends React.Component {
//   constructor(props) {
//     super(props)
//     this.state = {
//       list_count: props.list_count,
//       isAppsLoading: true,
//       appsList: [],
//       isAppsListEmpty: false,
//       latestAppsFetched: false,
//       responseDetails: 'Fetching Apps.',
//       networkError: false,
//     }
//   }

//   componentDidMount() {
//     const fetch_headers = {
//       method: 'GET',
//       headers: {
//         'Accept': 'application/json',
//         'Origin': '*',
//         'Authorization': `Bearer ${window.localStorage.getItem('nine_login')}`
//       },
//       modes: 'no-cors',  // options: cors, no-cors, same-origin
//       cache: 'default',   // options: default, no-store, reload, no-cache, force-cache, only-if-cached
//     }
//     fetch(`${process.env.REACT_APP_BASE_URL}/app/`, fetch_headers)
//       .then(response => {
//         if (response.status > 400) {
//           return this.setState({
//             responseDetails: 'Error fetching apps. Try again.',
//           })
//         }
//         return response.json()
//       })
//       .then(data => {
//         console.log(data.results)
//         this.setState({
//           appsList: data.results,
//           latestAppsFetched: true,
//           responseDetails: '',
//           networkError: false,
//           isAppsLoading: false,
//         })
//       }).catch(err => {
//         console.log('Error fetch latest apps: ' + err)
//         this.setState({
//           appsList: [],
//           latestAppsFetched: false,
//           isAppsListEmpty: true,
//           responseDetails: 'Error fetching Latest Apps.',
//           networkError: true,
//           isAppsLoading: false,
//         })
//       })
//   }

//   render() {
//     return (
//       <section id="id-napps-latest-apps-container" className="flex-grow pct:w-100 mg-auto pad-x1 pad-b2 bg-white-solid z-10">
//         <header id="id-napps-latest-apps-header"
//           className="text-left font-15 font-medium lg:pad-y2 pad-y-unset pad-l1 h-10 lh-10">
//           Latest Apps
//           <span className=""></span>
//         </header>
//         <section className="">
//           {/*<section className="flex flex-row bg-EEE h-8 lh-8 pct:w-100 radius focus-within:bg-DDD|outline:3px_solid_green">*/}
//           {/*  <label htmlFor="id-dummy-search-field" className="fa fa-search w-8 lh-8 font-16 color-BBB text-center"></label>*/}
//           {/*  <input type="text" id="id-dummy-search-field"*/}
//           {/*         className="flex-grow h-8 border-none outline-none bg-transparent font-14 font-medium"*/}
//           {/*         placeholder="Search"/>*/}
//           {/*</section>*/}
//           {
//             !this.state.isAppsLoading ?
//               <AppList appsList={this.state.appsList} isAppsListEmpty={this.state.isAppsListEmpty}
//                 isNetworkError={this.state.networkError} />
//               : <AppLoadingList />
//           }
//           {this.props.children}
//           {
//             showAppDetailModes ?
//               <Modes modes_id="id-app-details-modes" modes_class="modes modes-white modes-fullscreen"
//                 show_modes={true}>akhdkagsehabhu</Modes>
//               : console.log('No modes')
//           }
//         </section>
//       </section>
//     )
//   }
// }

function LatestApps({ listCount, fetchData, fetchMoreData }) {
  const { apps } = useLoaderData();
  const navigation = useNavigation();
  // const [isAppsLoading, setIsAppsLoading] = useState(true);
  // const [appsList, setAppsList] = useState([]);
  // const [isAppsListEmpty, setIsAppsListEmpty] = useState(false);
  // const [latestAppsFetched, setLatestAppsFetched] = useState(false);
  // const [responseDetails, setResponseDetails] = useState('Fetching Apps.');
  // const [networkError, setNetworkError] = useState(false);

  // const [nextPageData, setNextPageData] = useState({
  //   hasNextPage: false,
  //   next: ""
  // });
  // console.log(data)
  const [nextPageData, setNextPageData] = useState(apps?.nextAppPageData)
  const [moreLatestApps, setMoreLatestApps] = useState(null)
  const scrollContainerRef = useRef(null);
  // const { windowWidth, screenWidth, deviceWidthEnum } = useDeviceWidth();

  /*console.log(fetchMoreData);
  console.log(listCount);
  console.log(nextPageData);*/

  // useEffect(() => {
  //   async function fetchApps() {
  //     const appData = await data();
  //     setAppsList(appData?.appsList)
  //     setIsAppsLoading(appData?.isAppsLoading)
  //     setNextPageData(appData?.nextPageData)
  //   }
  //   fetchApps()
  //   // return () => fetchApps()
  // }, [])

  useEffect(() => {
    const fetch_config = {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        // 'Origin': '*',
      },
      modes: 'no-cors',  // options: cors, no-cors, same-origin
      cache: 'default',   // options: default, no-store, reload, no-cache, force-cache, only-if-cached
    }
    const fetchMoreApps = () => {
      // fetch(nextPageData.next, fetch_config)
      if (nextPageData?.next)
        axios(nextPageData?.next, fetch_config)
          // .then((res) => res.json())
          .then((res) => res.data)
          .then((data) => {
            setMoreLatestApps(data.results);
            if (data.next) {
              setNextPageData({ hasNextPage: true, next: data.next });
            } else {
              setNextPageData({ hasNextPage: false, next: data.next })
            }
          });
    }
    fetchMoreApps();
    // alert("Done fetching more data")
    return () => { }
  }, [fetchMoreData, nextPageData?.next]);

  useEffect(() => {
    // handle Scroll check
    const scrollContainerElem = scrollContainerRef.current;
    const handleScroll = () => {
      if (scrollContainerElem.scrollHeight - scrollContainerElem.scrollTop === scrollContainerElem.clientHeight) {
        // we've reached the bottom of the scrollContainerElem
        console.log("Reached the bottom of the page.");
      }
    };

    scrollContainerElem.addEventListener("scroll", handleScroll);
    return () => { scrollContainerElem.removeEventListener("scroll", handleScroll) }
  }, []);

  // useEffect(() => {
  //   const fetch_config = {
  //     method: 'GET',
  //     headers: {
  //       'Accept': 'application/json',
  //       // 'Origin': '*',
  //       // 'Authorization': `Bearer ${window.localStorage.getItem('nine_login')}`
  //     },
  //     modes: 'no-cors',  // options: cors, no-cors, same-origin
  //     cache: 'default',   // options: default, no-store, reload, no-cache, force-cache, only-if-cached
  //   }
  //   // fetch(`${process.env.REACT_APP_BASE_URL}/app/`, fetch_config)
  //   axios(`${process.env.REACT_APP_BASE_URL}/app/`, fetch_config)
  //     .then(response => {
  //       if (response.status > 400) {
  //         return setResponseDetails('Error fetching apps. Try again.');
  //       }
  //       return response.data
  //     })
  //     .then(data => {
  //       // console.log(data.results)
  //       setAppsList(data.results);
  //       setLatestAppsFetched(true);
  //       setResponseDetails('');
  //       setNetworkError(false);
  //       setIsAppsLoading(false);
  //       if (data.next) setNextPageData({ hasNextPage: true, next: data.next });
  //     }).catch(err => {
  //       console.log('Error fetch latest apps: ' + err)
  //       setAppsList([]);
  //       setLatestAppsFetched(false);
  //       setIsAppsListEmpty(true);
  //       setResponseDetails('Error fetching Latest Apps.');
  //       setNetworkError(true);
  //       setIsAppsLoading(false);
  //     });
  // }, []);

  return (
    <section id="id-napps-latest-apps-container" className="bg-rose-80 flex-grow w-full m-auto px-2 pb-4 z-10 shadow:0px--20px-80px-20px-FFFFFF88 dark:bg-111314|shadow:0px--20px-80px-20px-11131488" ref={scrollContainerRef}>
      <header id="id-napps-latest-apps-header"
        className={"lg:w-[88%] text-2xl font-15 font-semibold mx-auto lg:pl-4 pad-y-unset pl-2 h-20 leading-[5rem] text-left text-base-content"}>
        Latest Apps
        <span className=""></span>
      </header>
      <section id={"id-napps-latest-apps"} className={"lg:w-[88%] mx-auto lg:pct:w-80 lg:mg-x-auto"}>
        {
          apps?.isAppsLoading
            ? <AppLoadingList />
            : <>
              <AppList appsList={apps?.appsList} isAppsListEmpty={apps?.isAppsListEmpty}
                isNetworkError={apps?.networkError}>
                {moreLatestApps}
              </AppList>
              {
                nextPageData?.hasNextPage
                  ? <button type={"button"} className={"d-block mg-x-auto h-5 lh-5 font-9 font-bold border-0 bg-green-inverse color-green-dark pad-x2 radius"}>
                    Load more Apps
                  </button>
                  : null
              }
            </>
        }
      </section>
    </section>
  )
}

export default LatestApps;