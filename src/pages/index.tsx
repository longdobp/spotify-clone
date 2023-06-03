import { NextPage } from "next";
import Head from "next/head";
import Sidebar from "../components/Sidebar";
import Center from "@/components/Center";
import PlaylistContextProvider from "@/contexts/PlaylistContext";

const Home: NextPage = () => {
  return (
    <div className="bg-black h-screen overflow-hidden">
      <PlaylistContextProvider>
        <Head>
          <title>Spotify 1.0</title>
          <meta name="description" content="Spotify by Long Do" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className="flex">
          <Sidebar />
          <Center />
        </main>
      </PlaylistContextProvider>
    </div>
  );
};

export default Home;
