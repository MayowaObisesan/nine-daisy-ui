export const CarouselItem = ({ subText1, mainText, subText2 }) => {
    return (
        <>
            <div className="text-center w-full font-medium text-4xl leading-normal">
                <div className={"text-3xl lg:text-4xl lg:text-balance"}>{subText1}</div>
                <div className={"text-5xl lg:text-8xl font-black py-6 md:py-8"}>{mainText}</div>
                <div className={"text-3xl lg:text-4xl lg:text-balance"}>{subText2}</div>
            </div>
            <img src="/images/stock/photo-1625726411847-8cbb60cc71e6.jpg" alt={""} className="w-full" />
        </>
    )
}