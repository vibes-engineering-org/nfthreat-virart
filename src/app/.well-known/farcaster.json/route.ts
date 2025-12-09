import { PROJECT_TITLE } from "~/lib/constants";

export async function GET() {
  const appUrl =
    process.env.NEXT_PUBLIC_URL ||
    `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;

  const config = {
    accountAssociation: {
      header: "eyJmaWQiOjg2OTk5OSwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweDc2ZDUwQjBFMTQ3OWE5QmEyYkQ5MzVGMUU5YTI3QzBjNjQ5QzhDMTIifQ",
      payload: "eyJkb21haW4iOiJuZnRocmVhdC12aXJhcnQudmVyY2VsLmFwcCJ9",
      signature: "MHgzZWVkYWEyYmEyOTdhYjI5MmFlZmM4NDQ3ZjJiYTdjYmYyNzk5NmVmZDY0ZTc4ZjM5NTAxMzcwNDM2NzczNTIyMTlhMWEyYjI0ZmRhNGMyMTk3ZmQ3NWE4NjE0MjU4ZTdkNDdhYTQzYmRmZmY1OTBlNGEyZjc4N2MxMDJiYjFkMzFi"
    },
    miniapp: {
      version: "1",
      name: PROJECT_TITLE,
      iconUrl: `${appUrl}/icon.png`,
      homeUrl: appUrl,
      imageUrl: `${appUrl}/frames/hello/opengraph-image`,
      ogImageUrl: `${appUrl}/frames/hello/opengraph-image`,
      buttonTitle: "Open",
      splashImageUrl: `${appUrl}/splash.png`,
      splashBackgroundColor: "#f7f7f7",
      webhookUrl: `${appUrl}/api/webhook`,
      primaryCategory: "social",
    },
  };

  return Response.json(config);
}
