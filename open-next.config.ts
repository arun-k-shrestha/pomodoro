import type { OpenNextConfig } from "open-next/types/open-next.js";

const config: OpenNextConfig = {
  default: {},
  dangerous: {
    disableTagCache: true,
    disableIncrementalCache: true,
  },
};

export default config;
