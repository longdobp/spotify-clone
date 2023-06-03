import SpotifyProvider from "next-auth/providers/spotify";
import { scopes, spotifyApi } from "../../../config/spotify";
import NextAuth, { CallbacksOptions } from "next-auth";
import { ExtendedSession, ExtendedToken, TokenError } from "../../../types";

const refreshAccessToken = async (
  token: ExtendedToken
): Promise<ExtendedToken> => {
  try {
    spotifyApi.setAccessToken(token.accessToken);
    spotifyApi.setRefreshToken(token.refreshToken);

    const { body: refreshedTokens } = await spotifyApi.refreshAccessToken();

    console.log("REFRESHED TOKENS ARE: ", refreshedTokens);

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      refreshToken: refreshedTokens.refresh_token || token.refreshToken,
      accessTokenExpiresAt: Date.now() + refreshedTokens.expires_in * 1000,
    };
  } catch (error) {
    return {
      ...token,
      error: TokenError.RefreshAccessTokenError,
    };
  }
};

const jwtCallback: CallbacksOptions["jwt"] = async ({
  token,
  account,
  user,
}) => {
  // Persist the OAuth access_token and or the user id to the token right after signin
  let extendedToken: ExtendedToken;
  if (account && user) {
    extendedToken = {
      ...token,
      user,
      accessToken: account.access_token as string,
      refreshToken: account.refresh_token as string,
      accessTokenExpiresAt: (account.expires_at as number) * 1000,
    };
    // console.log("FIRST TIME LOGIN, EXTENDED TOKEN: ", extendedToken);
    return extendedToken;
  }

  if (Date.now() + 5000 < (token as ExtendedToken).accessTokenExpiresAt) {
    // console.log('ACCESS TOKEN STILL VALID, RETURNING EXTENDED TOKEN: ', token)
    return token;
  }

  console.log("ACCESS TOKEN EXPIRED, REFRESHING...");
  return await refreshAccessToken(token as ExtendedToken);
};

const sessionCallback: CallbacksOptions["session"] = async ({
  session,
  token,
}) => {
  // Send properties to the client, like an access_token and user id from a provider.
  (session as ExtendedSession).accessToken = (
    token as ExtendedToken
  ).accessToken;
  (session as ExtendedSession).error = (token as ExtendedToken).error;

  return session;
};

export default NextAuth({
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID as string,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET as string,
      authorization: {
        url: "https://accounts.spotify.com/authorize",
        params: {
          scope: scopes,
        },
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    jwt: jwtCallback,
    session: sessionCallback,
  },
});
