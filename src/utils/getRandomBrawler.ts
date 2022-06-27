const MAX_NUM_ID = 58;
const BRAWLER_FIRST_NUMBERS = 16000000


export const getRandomBrawler: (notThisOne?: number) => number = (
  notThisOne
) => {
  const brawlerNumber = Math.floor(BRAWLER_FIRST_NUMBERS+ Math.random() * MAX_NUM_ID) + 1;
  // console.log(brawlerNumber,'sss')
  if (brawlerNumber !== notThisOne) return brawlerNumber;
  return getRandomBrawler(notThisOne);
};

export const getOptionsForVote = () => {

  const firstId = getRandomBrawler();
  const secondId = getRandomBrawler(firstId);
console.log(firstId,secondId,'oo')
  return [firstId, secondId];
};
getOptionsForVote()
getRandomBrawler()