import FeaturedRoom from "@/components/FeaturedRoom/FeaturedRoom";
import HotelGallery from "@/components/Gallery/Gallery";
import HerrorSection from "@/components/HerroSection/HerroSection";
import NewsFeed from "@/components/NewsFeed/NewsFeed";
import PageSearch from "@/components/PageSearch/PageSearch";
import { getStaticProps } from "@/libs/apis";


const Home = async () => {
  const result = await getStaticProps();
  const rooms = result.rooms

  return (
    <>
      <hr />
      <HerrorSection />
      <PageSearch />
      <hr />
      {rooms && rooms.length > 0 ? (
        <><FeaturedRoom featuredRooms={rooms} />
          <hr /> </>
      ) : null}
      <HotelGallery />
      <hr />
      <NewsFeed />



    </>
  );
};

export default Home;
