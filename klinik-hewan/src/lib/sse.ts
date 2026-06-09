import EventEmitter from 'eventemitter3'

type SSEEvent = {
  type: string
  payload: any
}

class SSEService {
  emitter = new EventEmitter()

  publish(event: SSEEvent) {
    this.emitter.emit(event.type, event.payload)
  }

  subscribe(type: string, cb: (payload: any) => void) {
    this.emitter.on(type, cb)
    return () => this.emitter.off(type, cb)
  }
}

export const sseService = new SSEService()
