import {Carousel} from "react-bootstrap";
import WsCarouselImage from "./WsCarouselImage.tsx";


function WsCarousel() {
    return (
        <Carousel>
            <Carousel.Item>
                <WsCarouselImage text="First slide"
                                 url="https://ucarecdn.com/05f649bf-b70b-4cf8-90f7-2588ce404a08/-/resize/680x/"/>
                <Carousel.Caption>
                    <h3 className="text-light">First slide label</h3>
                    <p className="text-light">Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
                <WsCarouselImage text="Second slide"
                                 url="https://ucarecdn.com/05f649bf-b70b-4cf8-90f7-2588ce404a08/-/resize/680x/"/>
                <Carousel.Caption>
                    <h3 className="text-light">Second slide label</h3>
                    <p className="text-light">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                </Carousel.Caption>
            </Carousel.Item>
        </Carousel>
    );
}

export default WsCarousel;