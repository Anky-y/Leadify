"use server";

import { strict } from "assert";
import { NextRequest } from "next/server";

function extractUrls(text: string): string[] {
  if (!text) return [];

  const urlPattern = /https?:\/\/(?:[^\s()<>"'`{}]|(\([^\s()]*\)))+/gi;

  const matches = text.match(urlPattern) || [];
  const cleanUrls = matches.map((url) => {
    return url.replace(/[.,)'"`]+$/, "");
  });

  return cleanUrls;
}
function extractEmails(text: string): string[] {
  if (!text) return [];

  // Improved email regex with common valid chars, but stops before trailing punctuation
  const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;

  const rawEmails = text.match(emailPattern) || [];

  return rawEmails
    .map((email) => email.toLowerCase())
    .filter(
      (email) =>
        !email.endsWith(".jpg") &&
        !email.endsWith(".jpeg") &&
        !email.endsWith(".png") &&
        !email.endsWith(".gif")
    );
}

export async function POST(req: NextRequest) {
  console.log("sdas");
  try {
    const { channelName, channelID } = await req.json();

    if (!channelName || !channelID) {
      return new Response(
        JSON.stringify({ error: "Missing channelName or channelID" }),
        { status: 400 }
      );
    }
    const headers = {
      accept: "*/*",
      "accept-encoding": "gzip, deflate, br, zstd",
      "accept-language": "en-US",
      "client-id": "kimne78kx3ncx6brgo4mv6wki5h1ko",
      "client-session-id": "9d7C3Cb8a51Cc6b8",
      "client-version": "de99b9bb-52a9-4694-9653-6d935ab0cbcc",
      "content-type": "text/plain;charset=UTF-8",
      origin: "https://www.twitch.tv",
      priority: "u=1, i",
      referer: "https://www.twitch.tv/",
      "sec-ch-ua":
        '"Chromium";v="136", "Microsoft Edge";v="136", "Not.A/Brand";v="99"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site",
      "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) ",
      "x-device-id": "4PH7OPyojmsR3EGzYuUlbhvcjIypEJ8u",
    };

    const payload = [
      {
        operationName: "UseLive",
        variables: { channelLogin: channelName },
        extensions: {
          persistedQuery: {
            version: 1,
            sha256Hash:
              "639d5f11bfb8bf3053b424d9ef650d04c4ebb7d94711d644afb08fe9a0fad5d9",
          },
        },
      },
      {
        operationName: "ChannelRoot_AboutPanel",
        variables: {
          channelLogin: channelName,
          skipSchedule: true,
          includeIsDJ: true,
        },
        extensions: {
          persistedQuery: {
            version: 1,
            sha256Hash:
              "0df42c4d26990ec1216d0b815c92cc4a4a806e25b352b66ac1dd91d5a1d59b80",
          },
        },
      },
      {
        operationName: "ChannelPanels",
        variables: { id: channelID },
        extensions: {
          persistedQuery: {
            version: 1,
            sha256Hash:
              "06d5b518ba3b016ebe62000151c9a81f162f2a1430eb1cf9ad0678ba56d0a768",
          },
        },
      },
    ];
    console.log("recoeved request :D");
    const twitchRes = await fetch("https://gql.twitch.tv/gql", {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    console.log("interception sent")
    console.log(twitchRes)

    if (!twitchRes.ok) {
      console.log("failed req")
      return new Response(JSON.stringify({ error: "Twitch error" }), {
        status: twitchRes.status,
      });
    }

    console.log("After twitch res check")

    const return_data = {
      socials: {
        youtube: [] as string[],
        tiktok: [] as string[],
        twitter: [] as string[],
        discord: [] as string[],
        instagram: [] as string[],
        facebook: [] as string[],
        linkedin: [] as string[],
      },
      emails: [] as string[],
    };
    const data = await twitchRes.json();
    const socialMedias = data[1]?.data?.user?.channel?.socialMedias;
    if (Array.isArray(socialMedias)) {
      socialMedias.forEach((link) => {
        console.log(link.url);
        if (String(link.url).toLowerCase().includes("youtube")) {
          return_data.socials.youtube.push(link?.url as string);
        } else if (
          String(link.url).toLowerCase().includes("twitter") ||
          String(link.url).toLowerCase().includes("x.com")
        ) {
          return_data.socials.twitter.push(link.url as string);
        } else if (String(link.url).toLowerCase().includes("facebook")) {
          return_data.socials.facebook.push(link.url as string);
        } else if (String(link.url).toLowerCase().includes("tiktok")) {
          return_data.socials.tiktok.push(link.url as string);
        } else if (String(link.url).toLowerCase().includes("linkedin")) {
          return_data.socials.linkedin.push(link.url as string);
        } else if (String(link.url).toLowerCase().includes("instagram")) {
          return_data.socials.instagram.push(link.url as string);
        } else if (String(link.url).toLowerCase().includes("discord")) {
          return_data.socials.discord.push(link.url as string);
        }
      });
    } else {
      throw new TypeError("socialMedias is not an array");
    }
    try {
      const panels = data[2]?.data?.user?.panels;
      let url = [] as string[];
      let emails = [] as string[];

      emails.push(...extractEmails(JSON.stringify(data)));
      if (Array.isArray(panels)) {
        panels.forEach((panel) => {
          const description = panel?.description;
          if (description) {
            url.push(...extractUrls(description));
          }
          const link = panel?.linkURL;
          if (link) url.push(link);
        });
        if (emails) return_data.emails.push(...emails);
        url.forEach((link) => {
          if (String(link).toLowerCase().includes("youtube")) {
            return_data.socials.youtube.push(link as string);
          } else if (
            String(link).toLowerCase().includes("twitter") ||
            String(link).toLowerCase().includes("x.com")
          ) {
            return_data.socials.twitter.push(link as string);
          } else if (String(link).toLowerCase().includes("facebook")) {
            return_data.socials.facebook.push(link as string);
          } else if (String(link).toLowerCase().includes("tiktok")) {
            return_data.socials.tiktok.push(link as string);
          } else if (String(link).toLowerCase().includes("linkedin")) {
            return_data.socials.linkedin.push(link as string);
          } else if (String(link).toLowerCase().includes("instagram")) {
            return_data.socials.instagram.push(link as string);
          } else if (String(link).toLowerCase().includes("discord")) {
            return_data.socials.discord.push(link as string);
          }
        });
      }
    } catch (e) {
      console.log(`Error processing panels: ${e} (status ${twitchRes.status})`);
    }

    // Deduplicate all socials and emails before returning
    Object.keys(return_data.socials).forEach((key) => {
      // @ts-ignore
      return_data.socials[key] = Array.from(new Set(return_data.socials[key]));
    });
    return_data.emails = Array.from(new Set(return_data.emails));

    return new Response(JSON.stringify(return_data), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Internal server error:" ${err} }), { status: 500 });
  }

}

