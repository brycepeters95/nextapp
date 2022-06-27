import * as trpc from '@trpc/server';
import { z } from 'zod';
import { BrawlAPI } from 'brawl-api';
import {prisma} from "../utils/prisma"
import { getOptionsForVote } from '../../utils/getRandomBrawler';





export const appRouter = trpc.router()
.query('getBrawlerById', {
  async resolve() {
    const [first, second] = getOptionsForVote();
   console.log(first,second,'fffff')

    const bothBrawlers = await prisma.brawler.findMany({
      where:{id:{in: [first,second]}},
    });

    if (bothBrawlers.length !== 2)
    throw new Error("failed to load 2 brawlers")

    return{firstBrawler: bothBrawlers[0], secondBrawler: bothBrawlers[1]};
    // const api = new BrawlAPI();
     
    //     const brawler = await api.Brawlers.getBrawlerById(input.id);
    //     return {name:brawler.name, sprite: brawler.imageUrl}
       
  },
  
})
    .mutation("cast-vote", {
    input: z.object({
    votedFor: z.number(),
    votedAgainst: z.number(),
    }),
    async resolve({ input }) {
      console.log(input,'kkkk')
    const voteInDb = await prisma.vote.create({
      data: {
        votedAgainstId: input.votedAgainst,
        votedForId: input.votedFor,
      },
    });
     return { success: true, vote: voteInDb };
  },

});


export type AppRouter = typeof appRouter;



