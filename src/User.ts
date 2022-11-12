import { createDurable } from "itty-durable";
import { hashPassword } from "./util";
import type { Env } from "./index";

export class User extends createDurable() {
  constructor(state: DurableObjectState, env: Env) {
    super(state, env);

    this.id = state.id;
    this.storage = state.storage;
    this.env = env;
  }

  id: DurableObjectId;
  storage: DurableObjectStorage;
  env: Env;

  async create({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }) {
    const id = this.id.toString();

    if (await this.storage.get("exists")) {
      return { id, exists: true };
    }

    const [hash, salt] = await hashPassword(password);

    await Promise.all([
      this.storage.put("name", name),
      this.storage.put("email", email),
      this.storage.put("hash", hash),
      this.storage.put("salt", salt),
      this.storage.put("exists", true),
    ]);

    return { id, exists: false };
  }

  async login(
    { email, password }: { email: string; password: string },
    ip: string
  ) {
    const [hash, salt] = await Promise.all([
      this.storage.get("hash") as Promise<ArrayBuffer>,
      this.storage.get("salt") as Promise<Uint8Array>,
    ]);

    const [newHash] = await hashPassword(password, salt);

    const session = crypto.randomUUID();

    const sessions: { [ip: string]: string } =
      (await this.storage.get("sessions")) ?? {};

    sessions[ip] = session;

    await this.storage.put("sessions", sessions);

    const headers = new Headers();

    headers.set("Set-Cookie", `session=${session}; Path=/`);
    headers.set("Set-Cookie", `id=${this.id}; Path=/`);

    return {
      valid:
        new Uint8Array(hash).toString() === new Uint8Array(newHash).toString(),
      headers,
    };
  }
}
