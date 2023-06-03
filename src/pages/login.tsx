import Image from "next/image";
import logo from "../../assets/spotify-logo.png";
import { signIn, ClientSafeProvider, getProviders } from "next-auth/react";
import { GetServerSideProps } from "next";

interface Props {
  providers: Awaited<ReturnType<typeof getProviders>>
}

const Login = ({ providers }: Props) => {
  const { name: providerName, id: providerId } =
		providers?.spotify as ClientSafeProvider
    // console.log(providers?.spotify);
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <Image src={logo} alt="Spotify Logo" height={200} />
      <button
        className="bg-[#1ed760] text-white px-16 py-2 rounded-2xl mt-2"
        onClick={() => {
          signIn(providerId, { callbackUrl: '/' })
        }}
      >
        Login with {providerName}
      </button>
    </div>
  );
};

export default Login

export const getServerSideProps: GetServerSideProps<Props> = async context => {
	const providers = await getProviders()
	return {
		props: {
			providers
		}
	}
}
