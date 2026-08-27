export interface Clock {
  now(): Date;
}

export class SystemClock implements Clock {
  now(): Date {
    return new Date();
  }
}

export class FixedClock implements Clock {
  private time: Date;

  constructor(time: Date) {
    this.time = time;
  }

  now(): Date {
    return this.time;
  }
}
