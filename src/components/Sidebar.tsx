import {
  ArrowRightOnRectangleIcon,
  HeartIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  PlusCircleIcon,
  RssIcon,
  WalletIcon,
} from "@heroicons/react/24/outline";
import IconButton from "./IconButton";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import UserIcon from "../../assets/user.png";
import { usePlaylistContext } from "@/contexts/PlaylistContext";
import { spotifyApi } from "@/config/spotify";

const Sidebar = () => {
  const { data: session } = useSession();
  // console.log('SESSION: ' ,session);

  const {
    playlistContextState: { playlists },
    updatePlaylistContextState,
  } = usePlaylistContext();
  // console.log("playlists: ", playlists);

  const setSelectedPlaylist = async (playlistId: string) => {
    const playlistResponse = await spotifyApi.getPlaylist(playlistId);
    // console.log(playlistResponse);
    updatePlaylistContextState({
      selectedPlaylistId: playlistId,
      selectedPlaylist: playlistResponse.body,
    });
  };

  return (
    <div className=" text-gray-500 px-5 pt-5 pb-36 text-xs lg:text-sm border-r border-gray-900 h-screen overflow-y-scroll no-scrollbar sm:max-w-[12rem] lg:max-w-[15rem] hidden md:block">
      <div className="space-y-4 bg-gradient-radial">
        <IconButton icon={HomeIcon} label="Home" />
        <IconButton icon={MagnifyingGlassIcon} label="Search" />
        <IconButton icon={WalletIcon} label="Your Library" />
        <hr className="border-gray-900 border-t" />
        <IconButton icon={PlusCircleIcon} label="Create Playlist" />
        <IconButton icon={HeartIcon} label="Liked Songs" />
        <IconButton icon={RssIcon} label="Your episodes" />
        <hr className="border-gray-900 border-t" />

        {playlists.map(({ id, name }) => (
          <p
            key={id}
            className="cursor-pointer hover:text-white"
            onClick={() => setSelectedPlaylist(id)}
          >
            {name}
          </p>
        ))}

        <hr className="border-gray-900 border-t" />
        <h1>{session?.user?.name}</h1>
        <h3>{session?.user?.email}</h3>
        {session?.user && (
          <Image
            src={session?.user?.image || UserIcon}
            alt="User Icon"
            width={50}
            height={50}
            className="rounded-full object-cover"
          />
        )}
        {session?.user && (
          <button
            className="flex items-center space-x-2 hover:text-white"
            onClick={() => {
              signOut();
            }}
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            <span>Logout</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
