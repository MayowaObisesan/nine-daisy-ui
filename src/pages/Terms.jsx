import { Link } from "react-router-dom";
import NavBar from "../components/NavBar";

const Terms = () => {
    return (
        <section className={"flex flex-col dark:bg-111314"}>
            <NavBar showAddAppButton={false} showSearch={false} />
            <section className={"fixed left-0 top-0 flex flex-row w-full h-dvh pct:w-100 vh:h-100 justify-center items-center"}>
                <div className={"font-32 font-bold dark:color-whitesmoke"}>Coming soon</div>
            </section>
            <section className={"block mx-auto w-[96%] lg:w-[56%] pct:w-96 lg:pct:w-56 dark:color-whitesmoke opacity-40"} style={{ filter: "blur(4px)" }}>
                <header className={"font-16 font-bold py-8"}>Terms and Conditions</header>
                Please read these terms and conditions ("terms and conditions", "terms") carefully before using https://nine-ui.vercel.app website (“website”, "service") operated by Nine ("us", 'we", "our").

                <header className={"font-16 font-bold py-8"}>Conditions of use</header>
                By using this website, you certify that you have read and reviewed this Agreement and that you agree to comply with its terms.
                If you do not want to be bound by the terms of this Agreement, you are advised to stop using the website accordingly. Nine only grants use and access of this website, its products, and its services to those who have accepted its terms.

                <header className={"font-16 font-bold py-8"}>Privacy policy</header>
                Before you continue using our website, we advise you to read our <Link to="/privacy">privacy policy</Link> regarding our user data collection.
                It will help you better understand our practices.

                {/* <header className={"font-16 font-bold py-8"}>Age restriction</header>
                You must be at least 18 (eighteen) years of age before you can use this website.
                By using this website, you warrant that you are at least 18 years of age and you may legally adhere to this Agreement. [company name] assumes no responsibility for liabilities related to age misrepresentation. */}

                <header className={"font-16 font-bold py-8"}>Intellectual property</header>
                You agree that all materials, products, and services provided on this website are the property of Nine, its affiliates, directors, officers, employees, agents, suppliers, or licensors including all copyrights, trade secrets, trademarks, patents, and other intellectual property. You also agree that you will not reproduce or redistribute the [company name]’s intellectual property in any way, including electronic, digital, or new trademark registrations.
                You grant Nine a royalty-free and non-exclusive license to display, use, copy, transmit, and broadcast the content you upload and publish. For issues regarding intellectual property claims, you should contact the company in order to come to an agreement.

                <header className={"font-16 font-bold py-8"}>User accounts</header>
                As a user of this website, you may be asked to register with us and provide private information. You are responsible for ensuring the accuracy of this information, and you are responsible for maintaining the safety and security of your identifying information. You are also responsible for all activities that occur under your account or password.
                If you think there are any possible issues regarding the security of your account on the website, inform us immediately so we may address them accordingly.
                We reserve all rights to terminate accounts, edit or remove content and cancel orders at our sole discretion.

                <header className={"font-16 font-bold py-8"}>Applicable law</header>
                By using this website, you agree that the laws of Nigeria, without regard to principles of conflict laws, will govern these terms and conditions, or any dispute of any sort that might come between Nine and you, or its business partners and associates.

                <header className={"font-16 font-bold py-8"}>Disputes</header>
                Any dispute related in any way to your use of this website or to products you purchase from us shall be arbitrated by state or federal court of Nigeria and you consent to exclusive jurisdiction and venue of such courts.
                Indemnification
                You agree to indemnify Nine and its affiliates and hold Nine harmless against legal claims and demands that may arise from your use or misuse of our services. We reserve the right to select our own legal counsel.

                <header className={"font-16 font-bold py-8"}>Limitation on liability</header>
                Nine is not liable for any damages that may occur to you as a result of your misuse of our website.
                Nine reserves the right to edit, modify, and change this Agreement at any time. We shall let our users know of these changes through electronic mail. This Agreement is an understanding between Nine and the user, and this supersedes and replaces all prior agreements regarding the use of this website.
            </section>
        </section>
    )
}

export default Terms;