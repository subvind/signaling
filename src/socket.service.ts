import { Injectable } from '@nestjs/common';

import Pusher from 'pusher'

let secret = process.env.PUSHER_SECRET || '6shiidf3t9im3loq'
let key = process.env.PUSHER_KEY || '2b9237a62e1e7efd692d'
let server = {
  appId: process.env.PUSHER_APP_ID || '1134433',
  cluster: process.env.PUSHER_CLUSTER || 'us3',
  useTLS: true
}

@Injectable()
export class SocketService {
  private wsServer: any = null;

  constructor() {
    let that = this;
    
    // init PusherJS
    (async function () {
      await that.webSocketServer(key, secret, server)
    })()
  }

  public wss (): Promise<any> {
    // check if loaded every 0.2 seconds
    let that = this
    return new Promise((resolve) => {
      let interval = setInterval(async () => {
        if (that.wsServer !== null) {
          console.log('loaded server web socket')
          clearInterval(interval)
          resolve(that.wsServer);
        } else {
          console.log('loading server web socket', that.wsServer)
        }
      }, 200)
    });
  }

  async webSocketServer (key: string, secret: string, config: any) {
    // only allow one to be loaded
    if (this.wsServer === null) {
      this.wsServer = new Pusher({key, secret, ...config});
    }
    return this.wsServer
  }
}