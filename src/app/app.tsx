"use client";

import { PROJECT_TITLE } from "~/lib/constants";
import NFTMinter from "~/components/NFTMinter";

export default function App() {
  return (
    <div className="w-[400px] mx-auto py-8 px-4 min-h-screen flex flex-col">
      {/* TEMPLATE_CONTENT_START - Replace content below */}
      <div className="space-y-6 text-center mb-8">
        <h1 className="text-4xl font-semibold tracking-tight">
          {PROJECT_TITLE}
        </h1>
        <p className="text-lg text-muted-foreground">
          Mint any NFT on Base with 2 clicks
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <NFTMinter />
      </div>
      {/* TEMPLATE_CONTENT_END */}
    </div>
  );
}
