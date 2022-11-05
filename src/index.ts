export default {
  async fetch(request: Request ) {
    return new Response('Hello world')
  }
}

export interface Env {
  users: DurableObjectNamespace
  journals: DurableObjectNamespace
}

export class User {
  constructor(state: DurableObjectState, env: Env) {
    this.state = state
    this.env = env
  }

  state: DurableObjectState
  env: Env

  async fetch(request: Request) {
  }
}

export class Journal {
  constructor(state: DurableObjectState, env: Env) {
    this.state = state
    this.env = env
  }

  state: DurableObjectState
  env: Env

  async fetch(request: Request) {
  }
}
