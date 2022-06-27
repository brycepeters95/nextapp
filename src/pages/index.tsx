import { trpc } from "../utils/trpc";
import type React from "react";
import { inferQueryResponse } from "./api/trpc/[trpc]";

import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import { usePlausible } from "next-plausible";
import { getOptionsForVote } from "@/utils/getRandomBrawler";
import { useState } from "react";

const btn =
  "inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm font-medium rounded-full text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500";

export default function Home() {
  const {
    data: brawlerPair,
    refetch,
    isLoading,
  } = trpc.useQuery(["getBrawlerById"], {
    refetchInterval: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
  console.log(brawlerPair, 'll')


  const voteMutation = trpc.useMutation(["cast-vote"]);
  const plausible = usePlausible()



  const voteForBest = (selected: number) => {
    if (!brawlerPair) return; // Early escape to make Typescript happy

    if (selected === brawlerPair?.firstBrawler.id) {
      // If voted for 1st pokemon, fire voteFor with first ID
      voteMutation.mutate({
        votedFor: brawlerPair.firstBrawler.id,
        votedAgainst: brawlerPair.secondBrawler.id,
      });
    } else {
      // else fire voteFor with second ID
      voteMutation.mutate({
        votedFor: brawlerPair.secondBrawler.id,
        votedAgainst: brawlerPair.firstBrawler.id,
      });
    }


    plausible("cast-vote");
    refetch();
  }

  const fetchingNext = voteMutation.isLoading || isLoading;

  return (
    <div className="h-screen w-screen flex flex-col justify-between items-center relative">
      <Head>
        <title>Roundest brawler</title>
      </Head>

      <div className="text-2xl text-center pt-8">Which Brawler is better?</div>
      {brawlerPair && (
        <div className="p-8 flex justify-between items-center max-w-2xl flex-col md:flex-row animate-fade-in">
          <BrawlerListing
            brawler={brawlerPair.firstBrawler}
            vote={() => voteForBest(brawlerPair.firstBrawler.id)}
            disabled={fetchingNext}
          />
          <div className="p-8 italic text-xl">{"or"}</div>
          <BrawlerListing
            brawler={brawlerPair.secondBrawler}
            vote={() => voteForBest(brawlerPair.secondBrawler.id)}
            disabled={fetchingNext}
          />
          <div className="p-2" />
        </div>

      )}
    </div>
  )
};

type BrawlerFromServer = inferQueryResponse<"getBrawlerById">["firstBrawler"];

const BrawlerListing: React.FC<{
  brawler: BrawlerFromServer;
  vote: () => void;
  disabled: boolean;
}> = (props) => {

  return (
    <div
      className={`flex flex-col items-center transition-opacity ${
        props.disabled && "opacity-0"
      }`}
      key={props.brawler.id}
      >
       <div className="text-xl text-center capitalize mt-[-0.5rem]">
        {props.brawler.name}
      </div>

      <Image src={props.brawler.spriteUrl}
        alt="brawler"
        width={256}
        height={256}
        layout="fixed"
        className="animate-fade-in"
         />
      <button className={btn} onClick={() => props.vote()}>
        Better
      </button>
    </div>
  )
}