import { usePlaylistContext } from "@/contexts/PlaylistContext";
import { pickRandom } from "@/utils/pickRandom";
import UserIcon from "../../assets/user.png";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import Songs from "./Songs";

const colours = [
  "from-indigo-500",
  "from-blue-500",
  "from-green-500",
  "from-red-500",
  "from-yellow-500",
  "from-pink-500",
  "from-purple-500",
];

const Center = () => {
  const {
    playlistContextState: { selectedPlaylist, selectedPlaylistId },
  } = usePlaylistContext();
  const { data: session } = useSession();
  const [fromColour, setFromColour] = useState<string | null>(null);
  useEffect(() => {
    setFromColour(pickRandom(colours));
  }, [selectedPlaylistId]);
  return (
    <div className="flex-grow text-white relative h-screen overflow-y-scroll no-scrollbar">
      <header className="absolute top-5 right-8">
        <div
          className="flex items-center bg-black space-x-3 opacity-90 hover:opacity-70 cursor-pointer rounded-full py-1 px-1"
          onClick={() => {
            signOut();
          }}
        >
          <Image
            src={session?.user?.image || UserIcon}
            alt="User Avatar"
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
          <span>{session?.user?.name}</span>
          <ChevronDownIcon className="icon" />
        </div>
      </header>
      <section
        className={`flex items-end space-x-7 bg-gradient-to-b ${fromColour} to-black h-80 p-8`}
      >
        {selectedPlaylist && (
          <>
            <Image
              src={selectedPlaylist.images[0].url}
              alt="Playlist Image"
              height={176}
              width={176}
              className="shadow-2xl"
            />
            <div>
              <p>PLAYLIST</p>
              <h1 className="text-2xl font-bold md:text-3xl xl:text-5xl">
                {selectedPlaylist?.name}
              </h1>
            </div>
          </>
        )}
      </section>
      <div>
        <Songs />
      </div>
    </div>
  );
};

export default Center;
