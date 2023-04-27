import { Server } from "socket.io";
import express from "express";

class Main {
  public io: any;
  constructor(server: any) {
    this.io = new Server(server);
    // global.io = this.io;
  }
  init(io: Server) {
    io.on("connection", (socket) => {
      socket.on("disconnect", () => {
        console.log("user disconnected");
      });
    });
  }
}

export default Main;
