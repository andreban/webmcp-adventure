type Listener<T = unknown> = (data: T) => void;

export class EventEmitter {
  private events: Map<string, Set<Listener>> = new Map();

  public on<T = unknown>(event: string, listener: Listener<T>): () => void {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    const set = this.events.get(event)!;
    set.add(listener as Listener);
    return () => this.off(event, listener);
  }

  public off<T = unknown>(event: string, listener: Listener<T>): void {
    const set = this.events.get(event);
    if (set) {
      set.delete(listener as Listener);
      if (set.size === 0) {
        this.events.delete(event);
      }
    }
  }

  public emit<T = unknown>(event: string, data?: T): void {
    const set = this.events.get(event);
    if (set) {
      set.forEach((listener) => {
        try {
          listener(data);
        } catch (err) {
          console.error(`Error in event listener for "${event}":`, err);
        }
      });
    }
  }

  public clear(): void {
    this.events.clear();
  }
}
