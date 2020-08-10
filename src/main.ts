import { EventDispatcher } from 'strongly-typed-events';
import sleep from './Utility/sleep';

export interface RuntimeStats {
  id: string;
  isRunning: boolean;
  didRun: boolean;
  startTime: number | undefined;
  endTime: number | undefined;
}

export class RunTracker
{
  private static trackerCreatedEvent = new EventDispatcher<RunTracker, RuntimeStats>();
  private static trackerStartedEvent = new EventDispatcher<RunTracker, RuntimeStats>();
  private static trackerEndedEvent = new EventDispatcher<RunTracker, RuntimeStats>();
  public static get onCreated(){
    return RunTracker.trackerCreatedEvent.asEvent();
  }
  public static get onStarted(){
    return RunTracker.trackerStartedEvent.asEvent();
  }
  public static get onEnded(){
    return RunTracker.trackerEndedEvent.asEvent();
  }

  private running: boolean = false;
  private didRun: boolean = false;
  private id_: string = "";
  private startTime: number = -1;
  private endTime: number = -1;

  constructor(label: string = "", startImmediately: boolean = true){
    this.id_ = `${label}${label == "" ? "" : "-"}${Date.now().toString()}`;
    RunTracker.trackerCreatedEvent.dispatchAsync(this, this.createStats());
    if(startImmediately) this.start();
  }

  public get id(): string {
    return this.id_;
  }

  public get stats() : RuntimeStats {
    return this.createStats();
  }  

  startRun(){
    this.start();
  }

  endRun(){
    this.end();
  }

  private start(){
    if(this.running || this.didRun) return;

    this.running = true;
    this.didRun = true;
    this.startTime = Date.now();
    RunTracker.trackerStartedEvent.dispatchAsync(this, this.createStats());
  }

  private end(){
    if(!this.running) return;

    this.running = false;
    this.didRun = true;
    this.endTime = Date.now();
    RunTracker.trackerEndedEvent.dispatchAsync(this, this.createStats());
  }

  private createStats(){
    return {
      id: this.id_,
      isRunning: this.running,
      didRun: this.didRun,
      startTime: this.didRun ? this.startTime : undefined,
      endTime: this.didRun && !this.running ? this.endTime : undefined,
    }
  }
}

export const runs: Record<string, RuntimeStats> = {}

export const Main = async (): Promise<RuntimeStats> => {
  const tracker = new RunTracker("main", true);
  runs[tracker.id] = tracker.stats;
  const stats = await internalMain(tracker);
  runs[tracker.id] = {...runs[tracker.id], ...tracker.stats};
  return stats;
}

const internalMain = async (tracker: RunTracker) => {
  await sleep(50);
  console.log("Saying Hello in two seconds...");
  await sleep(2000);
  console.log("Hello ya bum!");
  await sleep(1000);
  console.log("Maximum courtesy achieved, terminating frivality...");
  await sleep(500);
  console.log("...");
  await sleep(500);
  console.log("..");
  await sleep(500);
  console.log(".");
  await sleep(500);
  tracker.endRun();
  const stats = tracker.stats;
  runs[tracker.id] = stats;
  await sleep(50);

  return stats;
}
