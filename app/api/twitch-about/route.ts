"use server";

import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { channelName, channelID, userID} = await req.json();
    

    if (!channelName || !channelID) {
      return new Response(JSON.stringify({ error: "Missing channelName or channelID" }), { status: 400 });
    }
  const headers = {
    'accept': '*/*',
    'accept-encoding': 'gzip, deflate, br, zstd',
    'accept-language': 'en-US',
    'client-id': 'kimne78kx3ncx6brgo4mv6wki5h1ko',
    'client-session-id': '9d7C3Cb8a51Cc6b8',
    'client-version': 'de99b9bb-52a9-4694-9653-6d935ab0cbcc',
    'content-type': 'text/plain;charset=UTF-8',
    'origin': 'https://www.twitch.tv',
    'priority': 'u=1, i',
    'referer': 'https://www.twitch.tv/',
    'sec-ch-ua': '"Chromium";v="136", "Microsoft Edge";v="136", "Not.A/Brand";v="99"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-site',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ',
    'x-device-id': '4PH7OPyojmsR3EGzYuUlbhvcjIypEJ8u'
  };

  const payload = [
    {
      operationName: "UseLive",
      variables: { channelLogin: channelName },
      extensions: {
        persistedQuery: {
          version: 1,
          sha256Hash: "639d5f11bfb8bf3053b424d9ef650d04c4ebb7d94711d644afb08fe9a0fad5d9"
        }
      }
    },
    {
      operationName: "ChannelRoot_AboutPanel",
      variables: {
        channelLogin: channelName,
        skipSchedule: true,
        includeIsDJ: true
      },
      extensions: {
        persistedQuery: {
          version: 1,
          sha256Hash: "0df42c4d26990ec1216d0b815c92cc4a4a806e25b352b66ac1dd91d5a1d59b80"
        }
      }
    },
    {
      operationName: "ChannelPanels",
      variables: { id: channelID },
      extensions: {
        persistedQuery: {
          version: 1,
          sha256Hash: "06d5b518ba3b016ebe62000151c9a81f162f2a1430eb1cf9ad0678ba56d0a768"
        }
      }
    }
  ];
    console.log("recoeved request :D")
     const twitchRes = await fetch("https://gql.twitch.tv/gql", {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });
    
    if (!twitchRes.ok) {
      return new Response(JSON.stringify({ error: "Twitch error" }), { status: twitchRes.status });
    }

    const data = await twitchRes.json();
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}

