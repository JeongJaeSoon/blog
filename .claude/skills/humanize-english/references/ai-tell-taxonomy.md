# English AI-writing taxonomy v0.1

This is an editing aid, not an authorship classifier. A single match is never
evidence. Judge on repetition, co-occurrence, document-level skew, and mismatch
with the intended register.

Same contract as `humanize-korean` and `humanize-japanese`, so the three
languages can be driven the same way.

## Severity

- **S1** — strong on its own or in a pair. Fix unless the source clearly wants it.
- **S2** — context dependent. Check genre, reader and register first.
- **S3** — weak signal or preference. Do not change automatically.
- **Guard** — not a tell. Present to stop over-editing.

## Evidence labels

- **E** — corresponds to a measurable property; `scripts/metrics.py` computes it.
- **J** — English editing practice.
- **T** — specific to Korean/Japanese → English rendering, which is how the
  English on this blog is produced.

## A. Opening and framing

| ID | Sev | Pattern | Fix | Ev |
|---|---|---|---|---|
| A-1 | S1 | Preview opening: "In this post I'll walk through…", "This article covers…" | Delete. Start on the concrete situation. | J |
| A-2 | S1 | Throat-clearing: "Here's the thing", "The thing is", "Let's dive in", "Let's take a look at" | Delete the sentence; the next one is the real opening. | J |
| A-3 | S2 | Faux insight: "what everyone gets wrong", "the real reason", "nobody talks about" | Say the finding plainly, or cut it. | J |
| A-4 | S2 | Audience hedge: "Whether you're a beginner or an expert…" | Delete. There is one reader. | J |

## B. Hedging and modality

| ID | Sev | Pattern | Fix | Ev |
|---|---|---|---|---|
| B-1 | S1 | Stacked hedges: "might potentially", "could possibly", "may perhaps" | One hedge or none. Never change the author's certainty level. | J/E |
| B-2 | S2 | Vague benefit: "can be beneficial/useful/helpful", "in some cases" | Name what it does, with the number if there is one. | J |
| B-3 | S2 | Unquantified comparative: "significantly faster", "much more reliable" with no figure | Supply the measurement or drop the comparison. | J |
| B-4 | Guard | Uncertainty the author actually stated ("I did not verify this") | Keep it exactly. Do not upgrade to confidence. | J |

## C. Diction

| ID | Sev | Pattern | Fix | Ev |
|---|---|---|---|---|
| C-1 | S1 | Inflated verbs and adjectives: leverage, utilize, delve, unpack, streamline, elevate, unlock, robust, seamless, powerful tool, game changer, cutting-edge, transformative | Use the plain verb for what was done. | J/E |
| C-2 | S2 | Empty intensifiers: simply, just, easily, effortlessly, very | Delete. It was not easy or the post would not exist. | J/E |
| C-3 | S2 | Nominalization chains: "the implementation of the configuration of…" | Return to verbs. | J/E |
| C-4 | S1 | Contractions: `didn't`, `it's`, `we're`, `you've`, `I'd` — either apostrophe, any case | Expand. `I'd` is `I would` in one place and `I had` in another, so read each one. | E |
| C-5 | S3 | `'s` after a pronoun or indefinite pronoun: `everyone's`, `somebody's` | Possessive or contraction; the script cannot tell. Read the match. | E |

## D. Connectives and scaffolding

| ID | Sev | Pattern | Fix | Ev |
|---|---|---|---|---|
| D-1 | S2 | Sentence-initial connective chain: Additionally, Furthermore, Moreover, That said, repeated across paragraphs | Keep at most one per few paragraphs; most can just be deleted. | J/E |
| D-2 | S2 | "First / Next / Finally" used as paragraph scaffolding rather than real sequence | Delete the scaffolding words; the order is already visible. | J |
| D-3 | S2 | "This means that" / "This is because" repetition | Vary or join the sentences. Keep the causal strength unchanged. | J/E |

## E. Rhetorical templates

| ID | Sev | Pattern | Fix | Ev |
|---|---|---|---|---|
| E-1 | S2 | "not X, but Y" repeated | Once is a sentence. Three times is a template — rewrite two of them. | J/E |
| E-2 | S2 | Colon reveal: a short clause, a colon, then the payoff | Fine once; a habit otherwise. | J |
| E-3 | S2 | A rhetorical question the next sentence answers | Delete the question, keep the answer. | J/E |
| E-4 | S2 | A list padded out to three | Two reasons is a fine number of reasons. | J |

## F. Closures

| ID | Sev | Pattern | Fix | Ev |
|---|---|---|---|---|
| F-1 | S1 | "In conclusion", "To sum up", "All in all", "At the end of the day" | Delete the phrase; keep the finding if it is new. | J/E |
| F-2 | S2 | A final paragraph restating the thesis in different words | Cut it, or replace with what is still unsolved. | J |
| F-3 | S2 | A takeaway generic enough to belong to any post on the subject | Cut it. | J |

## G. Rhythm and symmetry

| ID | Sev | Pattern | Fix | Ev |
|---|---|---|---|---|
| G-1 | S2 | Sentence-length CV below threshold | Join and split only where meaning allows. Never edit on the number alone. | E |
| G-2 | S2 | Paragraph-length CV below threshold | Same. Technical prose legitimately clusters. | E |
| G-3 | S2 | The same sentence opening repeated across a section | Vary, unless the repetition is deliberate. | E |

## H. Formatting

| ID | Sev | Pattern | Fix | Ev |
|---|---|---|---|---|
| H-1 | S2 | Bold applied to a whole sentence | Bold a term, not a sentence, or drop it. | J |
| H-2 | S3 | Em dash density above threshold | Keep one per paragraph at most in short copy. | E |
| H-3 | S3 | Emoji in headings | Remove. | J |
| H-4 | S2 | A table whose cells are adjectives | Replace with measurements, or delete the table. | J |

## I. Translationese (ko/ja → en)

The English here is rendered from Korean, so this section matters more than the
generic slop above. No off-the-shelf English humanizer covers it.

| ID | Sev | Pattern | Fix | Ev |
|---|---|---|---|---|
| I-1 | S2 | "through" chains from `~을 통해` / `~を通じて` | Make the actor the subject and use a real verb. | T |
| I-2 | S2 | Topic-comment order kept: "As for X, it is…", "Regarding X," | English fronts the subject. Rewrite. | T |
| I-3 | S2 | Over-explicit subject: every sentence opening with "I" | English drops fewer subjects than Korean, but not none. Vary. | T/E |
| I-4 | S2 | "in the case of", "at the time of" from `경우` / `때` | "when", "if", or restructure. | T |
| I-5 | S2 | Passive where the Korean was impersonal, not passive | Name the actor. | T/E |
| I-6 | S2 | Literal connective calques: "on the other hand" for `반면`, "also" for `또한`, every paragraph | Cut most of them. | T |

## Guards

| ID | Pattern | Why it is not a tell |
|---|---|---|
| Guard-1 | Flat declarative sentences with no hedging | That is this blog's register. Do not soften. |
| Guard-2 | First person throughout | Required. Do not convert to passive or "we". |
| Guard-3 | Identifiers, paths, config keys, versions, numbers, pasted output | Not prose. Never edited, never rounded, never "improved". |
| Guard-4 | Fewer than 5 sentences | Rhythm metrics are unreliable. Report as advisory only. |
| Guard-5 | Repetition of a technical term | English technical writing repeats the term rather than finding synonyms. |
