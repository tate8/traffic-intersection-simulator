/**
 * The Signal class can be emitted to call a specified
 * function on all of its observers
 */
export default class Signal<T> {
  private observers: ((arg: T) => void)[] = [];

  connect(callback: (arg: T) => void) {
    this.observers.push(callback);
  }

  disconnect(callback: (arg: T) => void) {
    this.observers.filter(e => e != callback);
 }

  emit(arg: T) {
    this.observers.forEach(e => e(arg));
  }
}