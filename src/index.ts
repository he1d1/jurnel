const version = "0.0.1";

export interface Env {
  users: DurableObjectNamespace;
  journals: DurableObjectNamespace;
}

export default {
  async fetch(request: Request, env: Env) {
    const parts = request.url.split("/").splice(3);

    if (parts[0] === "api") return handleApi(parts.splice(1), request, env);

    return new Response("<h1>Not found</h1>", {
      headers: { "Content-Type": "text/html" },
      status: 404,
    });
  },
};

async function handleApi(parts: string[], request: Request, env: Env) {
  if (parts[0] === "user") return handleUser(parts.splice(1), request, env);

  // Don't return 404 page for API requests
  return new Response("Not found", { status: 404 });
}

async function handleUser(parts: string[], request: Request, env: Env) {
  if (!parts[0]) {
    switch (request.method) {
      case "POST":
        // check if user exists and then forward request
        throw new Error("Not implemented");
      case "GET":
      case "PATCH":
      case "DELETE":
        // get logged in user's durable object and forward request
        throw new Error("Not implemented");
      default:
        return new Response("Method not allowed", { status: 405 });
    }
  }

  if (parts[0].length === 64) {
    //
    throw new Error("Not implemented");
  }
}

export class User {
  constructor(state: DurableObjectState, env: Env) {
    this.state = state;
    this.env = env;
  }

  state: DurableObjectState;
  env: Env;

  async fetch(request: Request) {}
}

export class Journal {
  constructor(state: DurableObjectState, env: Env) {
    this.state = state;
    this.env = env;
  }

  state: DurableObjectState;
  env: Env;

  async fetch(request: Request) {}
}
