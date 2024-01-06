import { useEffect, useState } from "react";

export const useDeviceSize = () => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);
    const [screenWidth, setScreenWidth] = useState(window.screen.width);
    const [screenHeight, setScreenHeight] = useState(window.screen.height);
    const [screenResized, setScreenResized] = useState(false);

    useEffect(() => {
        setScreenWidth(window.innerWidth);
        setScreenWidth(window.screen.width);
    }, [windowWidth]);

    useEffect(() => {
        function handleResize() {
            setWindowWidth(window.innerWidth);
            setWindowHeight(window.innerHeight);
            setScreenWidth(window.screen.width);
            setScreenHeight(window.screen.height);
            setScreenResized(true);
            // alert("Screen resized");
        }

        // console.log(windowWidth);
        // console.log(screenWidth);

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
            // setScreenResized(false);
        };
    }, [screenResized]);

    return { windowWidth, screenWidth, windowHeight, screenHeight };
}
