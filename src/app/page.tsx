import Link from "next/link";

import Button from "~/app/_components/Buttons/Button";
import { Layout, Navbar, Sidebar } from "~/app/_components/Components";
import { CreatePost } from "~/app/_components/create-post";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

export default async function Home() {  
  const session = await getServerAuthSession();  

  return (
    <>
      <Layout
        session={session}
      >
        <p>test</p>
      </Layout>              
    </>
  );
}