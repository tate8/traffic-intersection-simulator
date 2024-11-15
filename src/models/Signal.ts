export default class Signal {
  private observers: Function[] = [];

  connect(callback: Function) {
    this.observers.push(callback);
  }

  disconnect(callback: Function) {
    this.observers.filter(e => e != callback);
 }

  emit(...args: any[]) {
    this.observers.forEach(e => e(...args));
  }
}