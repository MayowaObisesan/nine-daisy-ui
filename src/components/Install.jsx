import { useEffect, useRef, useState } from "react";
import { Button, NotifInfo, NotifSuccess, TemporaryNotif } from "./Elements";

let installPrompt = null;

function disableInAppInstallPrompt() {
    installPrompt = null;
}

const InstallPWA = () => {
    // const installButton = document.querySelector("#id-install-nine");
    const installContainer = useRef(null);
    const [installable, setInstallable] = useState(false);
    const [showInstallContainer, setShowInstallContainer] = useState(false);

    const unsetInstallable = () => {
        // installPrompt = null;
        // disableInAppInstallPrompt();
        setInstallable(() => false);
    }

    const InstallPWAButton = ({ text }) => {
        const installButton = useRef(null);

        const clickInstallButton = async () => {
            if (!installPrompt) {
                console.log("Install prompt not initialized");
                return;
            }
            const result = await installPrompt.prompt();
            console.log("Install prompt was:", result.outcome);
            if (result.outcome === "accepted") { closeInstallContainer(); };
            // Show the notification that installation was successful.
            <TemporaryNotif time={4000}>
                <NotifSuccess title={"Installation Successful"}>
                    Nine is installed on your device.
                    You can proceed from there.
                </NotifSuccess>
            </TemporaryNotif>
        }

        return (
            // <button
            //     type="button"
            //     className={"outline-none border-0 h-6 lh-6 pad-x2 radius bg-green color-white"}
            //     ref={installButton}
            //     onClick={clickInstallButton}
            // >
            //     {text}
            // </button>
            <Button
                type="button"
                ref={installButton}
                onClick={clickInstallButton}
            >
                {text}
            </Button>
        )
    }

    // installButton.addEventListener("click", async () => {
    //     if (!installPrompt) {
    //         console.log("Install prompt not initialized");
    //         return;
    //     }
    //     const result = await installPrompt.prompt();
    //     console.log("Install prompt was:", result.outcome);
    //     disableInAppInstallPrompt();
    // });

    // let installable = false;

    window.addEventListener("appinstalled", () => {
        console.log("App already installed")
        unsetInstallable();
    });

    const closeInstallContainer = () => {
        installPrompt = null;
        setShowInstallContainer(false);
    }

    const handleBeforePromptInstall = (event) => {
        setInstallable(true);
        // const relatedApps = await navigator.getInstalledRelatedApps();
        // Search for a specific installed platform-specific app
        // console.log(relatedApps);
        // const psApp = relatedApps.find((app) => console.log(app));

        event.preventDefault();
        installPrompt = event;
        console.log("Before install prompt available");
    }

    useEffect(() => {
        window.addEventListener("beforeinstallprompt", handleBeforePromptInstall);

        return () => { window.removeEventListener("beforeinstallprompt", handleBeforePromptInstall) }
    }, []);

    useEffect(() => {
        setShowInstallContainer(installable);
        // console.log(installable);
    }, [installable]);

    return (
        <>
            {
                showInstallContainer
                && <section id="id-install-nine" className={"sticky top-[64px] z-10 flex flex-row items-center p-4 bg-gray-200 backdrop-blur-md shadow dark:bg-base-200 dark:lg:bg-base-200"} ref={installContainer}>
                    {/* <button type={"button"} className={"fa fa-times font-14 border-0 bg-transparent square-4 leading-8 text-center relative self-start dark:color-whitesmoke"} onClick={closeInstallContainer}></button> */}
                    <Button
                        classes={"btn-ghost relative self-start bg-transparent leading-8 text-center"}
                        onClick={closeInstallContainer}
                    >
                        <span className={"fa fa-times"}></span>
                    </Button>
                    <div className={"install-message w-full px-4 font-bold text-sm dark:color-whitesmoke"}>
                        Install Nine as an app.
                        <div className={"font-normal lg:text-lg"}>
                            Installation takes less than 10 seconds
                        </div>
                    </div>
                    <InstallPWAButton text={"Install"} />
                </section>
            }
        </>
    );
}

export default InstallPWA;