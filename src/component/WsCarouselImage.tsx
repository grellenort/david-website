import Image from 'react-bootstrap/Image';

interface WsCarouselImageProps {
    text?: string,
    url?: string
}

function WsCarouselImage({text, url}: WsCarouselImageProps) {
    return (
        <Image src={url} rounded alt={text}/>
    );
}

export default WsCarouselImage;