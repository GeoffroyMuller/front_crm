import { getJWT } from "core/src/helpers/utils";

export default function auth({ next, router }) {
  if (!getJWT()) {
    return router.replace({ name: "login" });
  }

  return next();
}
