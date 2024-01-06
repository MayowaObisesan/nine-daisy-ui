import { useEffect, useState } from "react";
import { decodeToken } from "../helpers/decodeToken";
// import {atom, useRecoilState} from "recoil";

// export const tokenState = atom({
//     key: 'tokenState', // unique ID (with respect to other atoms/selectors)
//     default: {}, // default value (aka initial value)
// });

// export const tokenState = atom({
//     rawToken: '',
//     isLoggedIn: false,
//     tokenData: {}
// })

const useTokenData = () => {
    let [isLoggedIn, setIsLoggedIn] = useState(false);
    let [tokenData, setTokenData] = useState(null);
    let [rawToken, setRawToken] = useState('');
    // let [tokenDataStore, setTokenDataStore] = useRecoilState(tokenState);
    // let [tokenDataStore, setTokenDataStore] = useAtom(tokenState);

    useEffect(() => {
        let loginToken;
        loginToken = localStorage.getItem("nine_login");
        setRawToken(loginToken);
        loginToken === null ? setIsLoggedIn(false) : setIsLoggedIn(true);
        isLoggedIn ? setTokenData(JSON.parse(decodeToken(loginToken))) : setTokenData(null);

        // setTokenDataStore({rawToken, isLoggedIn, tokenData})
        return () => { }
    }, [isLoggedIn]);

    // console.log(tokenData)
    // setTokenDataStore({rawToken, isLoggedIn, tokenData})
    // console.log(tokenDataStore);
    return { rawToken, isLoggedIn, tokenData };
    // return tokenDataStore;
}

export default useTokenData;

// import { useState, useEffect } from "react";
//
// const useFetch = (url) => {
//   const [data, setData] = useState(null);
//
//   useEffect(() => {
//     fetch(url)
//       .then((res) => res.json())
//       .then((data) => setData(data));
//   }, [url]);
//
//   return [data];
// };
//
// export default useFetch;