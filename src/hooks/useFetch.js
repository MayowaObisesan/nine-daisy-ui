import axios from "axios";
import { useState, useEffect } from "react";

const useFetch = (url) => {
    const [data, setData] = useState(null);

    useEffect(() => {
        // fetch(url)
        axios.get(url)
            // .then((res) => res.json())
            .then((res) => res.data)
            .then((data) => setData(data))
            .catch((err) => null);
    }, [url]);

    return [data];
};

export default useFetch;