import { PasswordUpdateSuccessfulTemplate } from "./SetPasswordSuccessful";

const ChangePasswordSuccessful = () => {
    return (
        <section className={"card flex flex-col flex-nowrap justify-center items-center w-full h-dvh md:w-[560px] lg:w-[480px] pct:w-80 pct:h-100 lh-normal mx-auto text-center lg:pct:w-40"}>
            <PasswordUpdateSuccessfulTemplate type={"changed"} />
        </section>
    )
}

export default ChangePasswordSuccessful;