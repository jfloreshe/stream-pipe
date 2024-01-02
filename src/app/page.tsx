import Link from "next/link";

import Button from "~/app/_components/Buttons/Button";
import { Navbar, Sidebar } from "~/app/_components/Components";
import { CreatePost } from "~/app/_components/create-post";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

export default async function Home() {
  const hello = await api.post.hello.query({ text: "from tRPC" });
  const session = await getServerAuthSession();
  const test = () => {}

  return (
    <>
      <Navbar session={session} />      
      <Sidebar />
    </>
  );
}