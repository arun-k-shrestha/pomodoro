// This route is what receives the Google callback and other Auth.js auth requests in an App Router app
import { handlers } from "@/auth";

export const { GET, POST } = handlers;
