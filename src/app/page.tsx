import Link from "next/link";

import Button from "~/app/_components/Buttons/Button";
import { ErrorMessage, Layout, LoadingMessage, MuliColumnVideo } from "~/app/_components/Components";
import { CreatePost } from "~/app/_components/create-post";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

export default async function Home() {  
  const session = await getServerAuthSession();  
  let isLoading = false;
  const data = await api.video.getRandomVideos.query(40);

  const Error = () => {
    if (isLoading) {
      return <LoadingMessage />;
    } else if (!data) {
      return (
        <ErrorMessage
          icon="GreenPlay"
          message="No hay videos."
          description="No hay videos disponibles."
        />
      );
    } else {
      return <></>;
    }
  };

  return (
    <>
      <Layout
        closeSidebar={false}
        session={session}
      >
        {!data ? (
          <Error />
        ): (
          <>
          <MuliColumnVideo
            videos={data.videos.map((video) => ({
              id: video?.id || "",
              title: video?.title || "",
              thumbnailUrl: video?.thumbnailUrl || "",
              createdAt: video?.createdAt || new Date(),
              views: video?.views || 0,
            }))}
            users={data.users.map((user) => ({
              name: user?.name || "",
              image: user?.image || "",
            }))}
          >
          </MuliColumnVideo>
          </>
        )}
      </Layout>              
    </>
  );
}