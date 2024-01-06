import { useEffect, useState } from "react";
// import { useAtomValue } from "jotai";
// import { tokenState } from "../Home";
import axios from "axios";
import useTokenData from "./useTokenData";

const useUserData = () => {
    // const {rawToken, isLoggedIn, tokenData} = useAtomValue(tokenState);
    const { rawToken, isLoggedIn, tokenData } = useTokenData();
    let [isError, setIsError] = useState(false);
    let [responseDetails, setResponseDetails] = useState('');
    let [userDataResults, setUserDataResults] = useState(null);
    let [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetch_headers = {
            method: 'GET',
            headers: {
                // 'Accept': 'application/json',
                // 'Origin': '*',
                'Authorization': `Bearer ${localStorage.getItem('nine_login')}`
            },
            modes: 'cors',  // options: cors, no-cors, same-origin, navigate, websocket
            cache: 'default',   // options: default, no-store, reload, no-cache, force-cache, only-if-cached
        }
        // fetch(`${process.env.REACT_APP_BASE_URL}/user/me/`, fetch_headers)
        axios(`${process.env.REACT_APP_BASE_URL}/user/me/`, fetch_headers)
            .then(response => {
                if (response.status > 400) {
                    return setResponseDetails('Error fetching apps. Try again.');
                }
                // console.log(response)
                // return response.json()
                return response.data
            })
            .then(data => {
                // console.log(data)
                setUserDataResults(data);
                setIsLoading(false);
                // alert(data);
                /*this.setState({
                    appDetails: data
                })*/
            }).catch(err => {
                console.log('Error fetch data: ' + err)
                setResponseDetails('Error fetching data');
                setIsError(true);
                setIsLoading(false);
                /*this.setState({
                    appDetails: null,
                    responseDetails: 'Error fetching Latest Apps.',
                    networkError: true,
                    isAppsLoading: false
                })*/
            });

        // alert(rawToken);
        return () => { }
    }, [isLoading]);
    // const userData = atom({
    //     key: 'userData',
    //     default: {}
    // });
    // useRecoilState(userData);
    return { userDataResults, isLoading, responseDetails, isError };
}

export default useUserData;