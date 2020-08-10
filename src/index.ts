import { Main, runs } from './main';

Main()
  .then((stats) => {
      console.log("Program terminated.");
      console.log(`Run Stats: ${JSON.stringify(stats, null, 2)}`);
      console.log(`Runs: ${JSON.stringify(runs, null, 2)}`)
    })
  .catch(e => console.log("Unhandled error caught in main:" + e))