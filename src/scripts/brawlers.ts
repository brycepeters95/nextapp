
// import {brawldata} from "brawldata.js"
// const client = new brawldata.Client()
//  import {  Brawler } from "types";
import {BrawlAPI} from "brawl-api"
import {prisma} from "../backend/utils/prisma"

// return brawlerid name and image... maybe more
//best gadget & star power & brawler based on type
//based on map and mode & pick best team comp

// interface IBrawlers{
//   id: number
//   name: string
//   spriteUrl: string,
// }

 export const getTheBrawlers = async () => {
  const client = new BrawlAPI();
  let allBrawlers=await client.Brawlers.getAllBrawlers();
  console.log(allBrawlers)

  const allBrawlersMap =allBrawlers.map((p,index ) => ({
    id:(p as unknown as {id:number}).id,
    name:(p as {name:string}).name,
    spriteUrl: p.imageUrl
  }))
  console.log(allBrawlersMap)

  const creation = await prisma.brawler.createMany({
    data: allBrawlersMap
  })
 console.log("creation?",creation);

  // const formattedBrawlers = getTheBrawlers();


  // const creation = formattedBrawlers;

 }
// module.exports = getTheBrawlers;

getTheBrawlers()