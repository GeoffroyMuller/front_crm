import { getJWT } from "@/core/helpers/utils";

export default function auth({ next, router }) {
  if (!getJWT()) {
    return router.replace({ name: "login" });
  }

  return next();
}
