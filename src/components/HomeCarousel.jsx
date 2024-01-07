const CarouselItem = ({ subText1, mainText, subText2 }) => {
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

const HomeCarousel = () => {
    return (
        <section className={"nine-home-carousel md:rounded-2xl lg:mx-2"}>
            <div className="carousel w-full h-[360px] md:h-[480px] lg:h-[560px] font-sans">
                <div id="item1" className="flex flex-col justify-center carousel-item w-full">
                    <CarouselItem subText1={"Every"} mainText={"Built-in-Naija"} subText2={"apps in one place"} />
                    {/* <img src="/images/stock/photo-1625726411847-8cbb60cc71e6.jpg" className="w-full" /> */}
                </div>
                <div id="item2" className="flex flex-col justify-center carousel-item w-full">
                    <CarouselItem subText1={"Showcase the"} mainText={"Portfolio"} subText2={"of apps that you have built"} />
                    {/* <img src="/images/stock/photo-1414694762283-acccc27bca85.jpg" className="w-full" /> */}
                </div>
                <div id="item3" className="flex flex-col justify-center carousel-item w-full">
                    <CarouselItem subText1={"List your"} mainText={"Apps"} subText2={"for others to use"} />
                    {/* <img src="/images/stock/photo-1609621838510-5ad474b7d25d.jpg" className="w-full" /> */}
                </div>
                <div id="item3" className="flex flex-col justify-center carousel-item w-full">
                    <CarouselItem subText1={"Gain easy"} mainText={"Recognition"} subText2={"through your apps"} />
                    {/* <img src="/images/stock/photo-1609621838510-5ad474b7d25d.jpg" className="w-full" /> */}
                </div>
                <div id="item3" className="flex flex-col justify-center carousel-item w-full">
                    <CarouselItem subText1={"Get"} mainText={"Motivated"} subText2={"by other people's Work"} />
                    {/* <img src="/images/stock/photo-1609621838510-5ad474b7d25d.jpg" className="w-full" /> */}
                </div>
                {/* <div id="item4" className="flex flex-col justify-center carousel-item w-full">
                    <div className="text-center w-full text-5xl leading-normal">
                        <div>Seek</div>
                        <div className={"text-9xl font-black py-8"}>Collaboration</div>
                        <div>on ongoing apps</div>
                    </div>
                </div> */}
            </div>
            {/* <div className="flex justify-center w-full py-2 gap-2">
                <a href="#item1" className="btn btn-xs">1</a>
                <a href="#item2" className="btn btn-xs">2</a>
                <a href="#item3" className="btn btn-xs">3</a>
            </div> */}
        </section>
    );
}

export default HomeCarousel;