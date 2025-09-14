export interface Prototype<T extends { clone: () => T }> {
  clone(): T;
}

export class PrototypeRegistry<T extends Prototype<T>> {
  private map: Map<string, T> = new Map();

  register(name: string, prototype: T): void {
    this.map.set(name, prototype);
  }

  unregister(name: string): void {
    this.map.delete(name);
  }

  create(name: string, mutate: (copy: T) => void): T | null {
    const prototype = this.map.get(name);
    if (!prototype) throw new Error(`Unknown prototype: ${name}`);

    const copy = prototype.clone();
    mutate(copy);
    return copy;
  }
}
