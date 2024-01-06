import NavBar from "../components/NavBar";
import Footer from "./Footer";

const About = () => {
    return (
        <section className={"mg-auto dark:color-whitesmoke lg:pct:w-56"}>
            <NavBar showAddAppButton={false} showSearch={false} />
            <div className={"flex flex-row justify-center align-center h-320 bg-lighter text-center dark:bg-111314 dark:color-whitesmoke lg:radius2 lg:h-320"}>
                <div className={"align-self-center font-64 font-bold lh-normal"}>
                    Nine
                    <div className={"font-regular pad-y2 lg:font-16"}>&copy; {new Date().getFullYear()}</div>
                </div>
            </div>
            <section className={"pad-x1 pad-y4 text-justify"}>
                Nine is a platform that allows you to showcase the apps that you have built or you want collaboration on.
                Just deploy the app to Nine and tag it for `collaboration`
                <div className={"font-bold pad-t4 lg:pad-x2"}>Features of Nine:</div>
                <div className={"lg:pad-x2"}>
                    <ol className={"pad-x3 lg:pad-unset"}>
                        <li className={"font-12 font-medium pad-y2 lg:font-14"}>Free: </li>
                        Nine allows free linkage of Apps and softwares you want to share with the world.
                        <li className={"font-12 font-medium pad-y2 lg:font-14"}>Variant:</li>
                        You can add your mobile, desktop and Web Apps on Nine.
                        <li className={"font-12 font-medium pad-y2 lg:font-14"}>Reach:</li>
                        Showcase your apps to the World. It's online, everyone can see your work from anywhere in the world.
                        <li className={"font-12 font-medium pad-y2 lg:font-14"}>Instant Distribution:</li>
                        Release your app to the world once your app is ready to serve the world.
                        <li className={"font-12 font-medium pad-y2 color-yellow lg:font-14"}>Collaboration: <span className={"color-yellow font-italic"}>(work in progress)</span></li>
                        Tag your app for collaboration to get developers to work on your app with you.
                    </ol>
                </div>
            </section>
            <Footer noFix={true} />
        </section>
    )
}

export default About;