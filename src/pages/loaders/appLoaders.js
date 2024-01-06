import axios from "axios";
import { loginToken } from "../../helpers/utils";

export async function ListApps() {
    let appsList, nextAppPageData
    let isAppsLoading = true;
    let isAppsListEmpty = false;
    // console.log("List apps function")
    // const [isAppsLoading, setIsAppsLoading] = useState(true);
    // console.log("isApps loading defined")
    // const [appsList, setAppsList] = useState([]);
    // const [isAppsListEmpty, setIsAppsListEmpty] = useState(false);
    // const [latestAppsFetched, setLatestAppsFetched] = useState(false);
    // const [responseDetails, setResponseDetails] = useState('Fetching Apps.');
    // const [networkError, setNetworkError] = useState(false);
    // const [nextAppPageData, setNextAppPageData] = useState({
    //     hasNextPage: false,
    //     next: ""
    // });
    // const [moreLatestApps, setMoreLatestApps] = useState(null)
    // console.log("list app Loader")

    // useEffect(() => {
    // }, [])
    const fetch_config = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            // 'Origin': '*',
            // 'Authorization': `Bearer ${window.localStorage.getItem('nine_login')}`
        },
        modes: 'cors',  // options: cors, no-cors, same-origin
        cache: 'default',   // options: default, no-store, reload, no-cache, force-cache, only-if-cached
    }
    await axios(`${process.env.REACT_APP_BASE_URL}/app/`, fetch_config)
        .then(response => {
            if (response.status > 400) {
                // return setResponseDetails('Error fetching apps. Try again.');
            }
            return response.data
        })
        .then(data => {
            // console.log(data.results)
            // setAppsList(data.results);
            // setLatestAppsFetched(true);
            // setResponseDetails('');
            // setNetworkError(false);
            // setIsAppsLoading(false);
            isAppsLoading = false;
            isAppsListEmpty = false;
            // if (data.next) setNextAppPageData({ hasNextPage: true, next: data.next });
            if (data.next) nextAppPageData = { hasNextPage: true, next: data.next }
            // console.log(data.results)
            appsList = data.results
        }).catch(err => {
            console.log('Error fetch latest apps: ' + err)
            // setAppsList([]);
            // setLatestAppsFetched(false);
            // setIsAppsListEmpty(true);
            // setResponseDetails('Error fetching Latest Apps.');
            // setNetworkError(true);
            // setIsAppsLoading(false);
            isAppsListEmpty = true;
            isAppsLoading = false;
            appsList = [];
        });
    // return { appsList, isAppsLoading, isAppsListEmpty, nextAppPageData }
    return { appsList, isAppsLoading, isAppsListEmpty, nextAppPageData }
}


export async function getApp(appNameId) {
    let data = null;
    let isLoading = true;
    let isError = false;
    console.log("get app Loader")

    const fetchConfig = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            // 'Origin': '*',
            // 'Authorization': `Bearer ${window.localStorage.getItem('nine_login')}`
        },
        modes: 'cors',  // options: cors, no-cors, same-origin
        cache: 'default',   // options: default, no-store, reload, no-cache, force-cache, only-if-cached
    }
    await axios(`${process.env.REACT_APP_BASE_URL}/app/${appNameId}/`, fetchConfig)
        .then(response => {
            if (response.status > 400) {
                // return setResponseDetails('Error fetching apps. Try again.');
            }
            return response.data
        })
        .then(resData => {
            isLoading = false;
            console.log(resData.results)
            data = resData
        }).catch(err => {
            console.log('Error fetch apps: ' + err)
            isLoading = false;
            // data = [];
            isError = true;
        });
    return { data, isLoading, isError }
}

export async function getProfile() {
    let data = null;
    let isLoading = true;
    let isError = false;
    const fetchConfig = {
        method: 'GET',
        headers: {
            // 'Accept': 'application/json',
            // 'Origin': '*',
            'Authorization': `Bearer ${loginToken()}`
        },
        modes: 'cors',  // options: cors, no-cors, same-origin, navigate, websocket
        cache: 'default',   // options: default, no-store, reload, no-cache, force-cache, only-if-cached
    }
    // fetch(`${process.env.REACT_APP_BASE_URL}/user/me/`, fetchConfig)
    await axios(`${process.env.REACT_APP_BASE_URL}/user/me/`, fetchConfig)
        .then(response => {
            if (response.status > 400) {
                // Display a fixed notification page and show the network error page.
                // return setResponseDetails('Error fetching apps. Try again.');
            }
            return response.data
        })
        .then(res_data => {
            isLoading = false;
            data = res_data;
        }).catch(err => {
            console.log('Error fetch data: ' + err)
            isError = true;
            isLoading = false;
        });
    return { data, isLoading, isError };
}

export async function getUser(userId) {
    let userData = null;
    let isLoading = true;
    let isError = false;
    const fetchConfig = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            // 'Origin': '*',
            // 'Authorization': `Bearer ${localStorage.getItem('nine_login')}`
        },
        modes: 'cors',  // options: cors, no-cors, same-origin, navigate, websocket
        cache: 'default',   // options: default, no-store, reload, no-cache, force-cache, only-if-cached
    }
    // useFetch(`${process.env.REACT_APP_BASE_URL}/user/${id}/`)
    await axios(`${process.env.REACT_APP_BASE_URL}/user/${userId}/`, fetchConfig)
        .then(response => {
            if (response.status > 400) {
                // Display a fixed notification page and show the network error page.
                // return setResponseDetails('Error fetching apps. Try again.');
            }
            return response.data
        })
        .then(data => {
            isLoading = false;
            userData = data;
        }).catch(err => {
            console.log('Error fetch data: ' + err)
            isError = true;
            isLoading = false;
        });
    return { userData, isLoading, isError };
}

export async function getUserApps(userId) {
    let data = null;
    let isLoading = true;
    let isError = false;
    let nextPageData = {};
    const fetchConfig = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            // 'Origin': '*',
            // 'Authorization': `Bearer ${localStorage.getItem('nine_login')}`
        },
        modes: 'cors',  // options: cors, no-cors, same-origin, navigate, websocket
        cache: 'default',   // options: default, no-store, reload, no-cache, force-cache, only-if-cached
    }
    // useFetch(`${process.env.REACT_APP_BASE_URL}/user/${id}/`)
    await axios(`${process.env.REACT_APP_BASE_URL}/user/${userId}/apps/`, fetchConfig)
        .then(response => {
            if (response.status > 400) {
                // Display a fixed notification page and show the network error page.
                // return setResponseDetails('Error fetching apps. Try again.');
            }
            return response.data
        })
        .then(res_data => {
            isLoading = false;
            data = res_data;
            if (data.next) nextPageData = { hasNextPage: true, next: data.next }
        }).catch(err => {
            console.log('Error fetch data: ' + err)
            isError = true;
            isLoading = false;
        });
    return { data, isLoading, isError, nextPageData };
}