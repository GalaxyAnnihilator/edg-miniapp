import Carousel from "@/components/carousel";
import { useAtomValue } from "jotai";
import { bannersState } from "@/state";

function Banners() {
  const banners = useAtomValue(bannersState);

  return (
    <Carousel
      slides={banners.map((banner) => (
        <img
          className="w-full rounded"
          src={"https://theme.hstatic.net/1000079076/1000802069/14/slideshow_3.jpg"}
          alt="Banner"
          onError={(e) => (e.currentTarget.src = "/static/fallback.jpg")}
        />
      ))}
    />
  );
}

export default Banners;