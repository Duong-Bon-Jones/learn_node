import EventEmitter from "events";

class Logger extends EventEmitter {
  log(message: string) {
    console.log(message);

    this.emit("messageLogged", {
      id: 1,
      message,
    });
  }
}

export { Logger };
