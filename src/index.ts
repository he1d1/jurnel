import {
  json,
  missing,
  error,
  status,
  withContent,
  withParams,
  ThrowableRouter,
} from "itty-router-extras";
import { withDurables } from "itty-durable";

export interface Env {
  users: DurableObjectNamespace;
  sessions: DurableObjectNamespace;
}

export { User } from "./User";

const router = ThrowableRouter({ base: "/" });

router
  .all("*", withDurables())

  .post("/api/user", withContent, async ({ users, content }) => {
    if (
      !(
        typeof content.name === "string" &&
        typeof content.email === "string" &&
        typeof content.password === "string"
      )
    ) {
      return status(422);
    }

    const { id, exists } = await (
      await users.get(content.email).create(content)
    ).json();

    if (exists) {
      return status(409);
    }

    return status(201, { id });
  })

  .post(
    "/api/login",
    withContent,
    async ({ users, sessions, content, headers }) => {
      if (
        !(
          typeof content.email === "string" &&
          typeof content.password === "string"
        )
      ) {
        status(422);
      }
      const { valid, headers: cookies } = await (
        await users
          .get(content.email)
          .login(content, headers.get("CF-Connecting-IP"))
      ).json();

      if (!valid) {
        return status(401);
      }

      console.log(cookies);

      return json(
        {},
        {
          headers: cookies,
          status: 201,
        }
      );
    }
  )

  .all("*", () => missing("Not Found"));

export default {
  fetch: router.handle,
};
