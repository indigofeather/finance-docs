import { source } from "@/lib/source";
import { createFromSource } from "fumadocs-core/search/server";
import { createTokenizer } from "@orama/tokenizers/mandarin";

const mandarinTokenizer = createTokenizer();

export const revalidate = false;

export const { staticGET: GET } = createFromSource(source, {
  // Use Mandarin tokenizer for single-locale sites so Chinese queries are segmented correctly.
  components: {
    tokenizer: mandarinTokenizer,
  },
  search: {
    threshold: 0,
    tolerance: 0,
  },
});
