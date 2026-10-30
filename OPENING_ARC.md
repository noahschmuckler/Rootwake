# The opening arc: the summit, the pool's sight, the first deepening and the first portal

Design discussion with Noah (2026-10-29), a draft spec, not a pass. Nothing here is built. It joins `BEGINNING.md` (the Eden and
its creatures), `VISION.md` (why the game exists) and the Descent (`DESCENT.md`, the catwalks as built in D0/D1). Lines marked
**Noah** are his decisions; **Proposal** lines are Claude's; **Open** lines wait on him.

## A change to the Descent (Noah)

The catwalk letters are **reversed from the repo's current order.**

- **Noah:** the top catwalk is **D**, and going down the letters spell **D‑E‑L‑I‑V‑E‑R** ("deliver"). Going up they spell
  **R‑E‑V‑I‑L‑E‑D** ("reviled"). (He said "revised"; I read it as REVILED, the word the repo already uses.)
- **The repo today says the opposite:** `LETTERS = ['R','E','V','I','L','E','D']` in `src/descentModel.ts` puts R at the top, and
  `DESCENT.md` says "going down they spell R‑E‑V‑I‑L‑E‑D". Three places need to follow when this is built: that array, the
  `DESCENT.md` sentence, and the snerk's line in `KEEPER_LINES` ("Read them going down and they curse you; going up, they ask a
  favour"), which should swap.
- **Proposal, why it works:** descending is the helpful direction ("Deliver these people, or be reviled"). Each step down is a
  letter of the promise, and climbing back out with the work undone spells the failure. It also puts the **D** (the layer you
  reach first) as the plain statement of purpose.

## The beat sequence

1. **The summit.** Hulda stands on top of the Wellspire and looks out over the valley. She can watch but cannot reach: the Cap
   seals the way down (`DESCENT.md`), so everything she sees is out of her hands. (PLATEAU.md already starts her on the summit and
   says she must meditate and cultivate before the first dive.)
2. **The pool's sight.** When she stands in the pool, under the stream of heavenly water falling from above, her vision is
   enhanced like a **heads-up display**: she sees **highlighted icons against the real world** showing the **location and status of
   every living entity**: the wolves, the deer, the thunderbird, the hobbits.
   - **Noah's intent:** this is how she develops a **yearning to go out and visit them.**
   - **Proposal, what "status" shows:** hunger, health, and what each is doing (a wolf stalking, a hobbit gathering, the
     thunderbird circling). It is the same data the village model already keeps (`HobbitState.activity`, `hunger`; raiders' states).
   - **Proposal, how it relates to what exists:** the explored map is a fog-of-war atlas (`overworldMap.ts`), and her sight
     already widens by tier (`TIER_VIEW`, VILLAGE_HANDOFF.md). The pool's sight is a live layer *over* the world, not the map. It
     works only while she stands in the water, so the water is the reason to keep returning.
3. **Petal teaches cultivation and the first deepening.** The tutorial character (`ADVERSARIES.md`, `VISION.md`) walks her through
   cultivating at the pool and diving the crystal drop to the first layer.
4. **The D catwalk.** On her first deepening she steps out onto **D**, the catwalk around the water droplet (the deep node is a
   waterdrop; `DESCENT.md`, D1). **Noah:** a character on the catwalk gives exposition, and the droplet can deliver some of it too.
5. **A task.** A **snerk** (Noah wrote "nark"; the repo's snerks already keep the information station on every layer) gives her a
   task to complete inside the first layer.
6. **The reward is information and a door.** Completing it:
   - **enables new information** when she next looks out from the top (the pool's sight gains something), and
   - **opens the first portal**, most likely to **the base of the Wellspire**, so she can venture out. (PLATEAU.md already places
     the ground-level portal on the island at the spire's foot, gated by clarity and a match-3 session; this adds the quest as the
     reason it opens.)

## The catwalk characters as quest-givers (Noah)

- The characters on each catwalk are **quest-givers who unlock mechanics at deeper and deeper levels.**
- They and Petal share one aim: to **teach Hulda to bring about a more advanced humanoid civilization.** It is built **layer by
  layer**, so each depth is a new lesson in what to build and what it costs.
- **Proposal, using what exists:** the keepers are already staged by depth (`descentModel.ts`): a snerk's archive on every layer, a
  hollowed's power node from the second, a greeblin's machine from the fourth. Each new keeper type is a natural new domain of
  quests, and the seven layers map to the seven bands (ROYGBIV).
- **Tie to the philosophy:** the keepers' quests are good and needed (the civilization is the point), and each advance feeds the
  counterpart (`VISION.md`). That lets Petal and the keepers want the same thing for different reasons, which is a good place for the
  player to feel the cost.

## Who speaks first on D, and the inciting event (Noah, 2026-10-29)

- **The first voice on D is a snerk.** It gives **technical instruction on how to operate the instruments on that level**, and
  a **quest to activate them.**
- **The quests from Petal and the snerk together could be the inciting event that first breaks the Eden.** So the first thing the
  player does with the mountain's machinery is the thing that ends the peace.

## The Eden breaks with a taste of blood (Noah's idea, 2026-10-29; dropped the same day)

**Superseded.** Noah dropped the vegetarian Eden after the leavers-and-takers discussion below: animals and hobbits hunt in the
Eden, for need. The options are kept as history; the break moved to reproduction and surplus (see the two sections below).

- **Noah:** in Eden there was no eating of meat, everything was vegetarian, and **the first taste of blood breaks it.** He is not
  sure whether that means the wolves are passive in some way, or the hobbits stop being vegetarian gatherers and make their first
  hunted kill.
- **This conflicts with `BEGINNING.md`**, where Noah specified the wolves hunting deer, boar and turkey, the bear feasting, and
  the thunderbird taking fish. Both can stand only if the Eden is a **pocket** (`VISION.md`): a sheltered place with a different
  law inside it than outside. **Open:** which of these do you want?
  - **A. Nobody kills in the Eden.** Wolves, bobcats, the bear and the thunderbird eat plants (or are fed by the pocket). The
    first kill, by anyone, is the break. `BEGINNING.md`'s predator table would be rewritten as a predator *potential*.
  - **B. Predators hunt, as specced; the break is the hobbits' first hunt.** Blood is natural for the animals and a fall only
    for the hobbits.
  - **C. The pocket suppresses killing, and activating the instruments on D lifts the suppression.** The inciting event
    (the snerk's quest) is then literally what lets hunger back in. Wolves are passive until the machinery wakes, and the first
    kill (by wolf or hobbit) follows from the player's own act.
  - **Proposal:** C joins your two ideas best, since it makes the snerk's quest the cause and keeps your ecology. It needs a
    reason the instruments hold hunger (the karst "soaks up chaos"; hunger and fear are chaos's oldest forms, `DESCENT.md`).

## Leavers and takers (Daniel Quinn, *Ishmael*, 1992)

Noah asked for a reminder of the distinction ("levers"; the book's word is **leavers**) and how it might apply.

- **Takers** are the "civilized" peoples, the culture that arose with the agricultural revolution about 10,000 years ago and
  grew into today's globalized society. **Leavers** are everyone else, past and present. Takers believe the world was made for
  humans and that they are the culmination of it; leavers "leave" the order of things alone.
- **The Law of Limited Competition:** you may compete to the full extent of your capabilities, but you may not hunt down your
  competitors, destroy their food, or deny them access to it. Species that break it risk extinction. Takers believe they are
  exempt.
- **Totalitarian agriculture:** food grown and locked up as a surplus that fuels population growth, and denies others a share.
- **The Tree of the Knowledge of Good and Evil**, in the book's reading, is not moral knowledge in general. It is **taking the
  power to decide which species live and which die.** Agricultural peoples do exactly that when they choose which organisms to
  cultivate, displace or kill.
- **Cain and Abel**, in the book, is the story of takers (Cain the farmer) wiping out leavers (Abel the herder) and taking their land.

### How it applies here (Claude's reading, for Noah to accept or reject)

- **The lens already fits your hobbits.** Foraging hobbits are leavers; the villages, stores and walls are the takers' way. Hulda
  is the avatar of agriculture, so she is literally the taker's goddess. Your sense that she is moving them from leavers to takers is
  the arc the book describes.
- **Quinn would put the Fall somewhere other than the meat.** In the book, eating meat is not the sin (leavers hunt). The sin is
  the **judgment**: deciding who is expendable, and denying a competitor its food. So a way to honour both Noah's vegetarian Eden and
  the book is for the first blood to be **the first kill that is a verdict**: "this one may live and that one may not."
- **The village mechanics already include taker acts.** The villagers hunt the same warren the wolves eat from and the village reads
  over-hunting in wolf behaviour (`SETTLEMENTS.md`); the thorn hedge is raised across the wolves' run (`VILLAGE_HANDOFF.md`, G3b);
  the granary stores a surplus. By the Law of Limited Competition each of those is a taker's move. They could be named as such in
  play.
- **Where the game parts from the book.** *Ishmael* treats the takers' story as the disaster. Your philosophy (`VISION.md`) says
  the advance is necessary and that option 3 borrows from option 2 in proportion. So the game asks whether there can be a
  **taker-scale civilization that still keeps the leaver's law**: growth without denying anyone their food. That is a clear
  description of your "perfect magitech utopia," and the failed states (cyberpunk, pirates) are takers who broke the law.

## The first taker quest (Noah's idea, 2026-10-29)

- **Noah:** the hobbits can be **hunter-gatherers who hunt only enough to survive.** A quest asks the hunters to **overhunt the rabbit
  warren** and **preserve the meat for winter in excess of what they need to maintain their population.** When the wolves come hungry,
  the hobbits **fight them and kill them.** Noah asked whether this fits Quinn's definition.
- **It fits, on both counts** (Claude's reading):
  - *Surplus beyond need, stored, to grow the population* is the engine of totalitarian agriculture. Quinn's "food race": more
    food, more people, which needs more food. The village already does this: a fed village gains a child every few days
    (`wellFedDays`, `BIRTH_DAYS` in `villageModel.ts`).
  - *Taking the competitor's food, then killing the competitor when it comes for it,* is the Law of Limited Competition broken
    twice: the hobbits destroy the wolves' food (the same warren, `SETTLEMENTS.md` S1) and then hunt the wolves down. The wolves
    come hungry **because of what the village did.**
- **The line to make legible.** Quinn's leavers do preserve food, and drying meat for winter is not itself the fault. The fault is
  quantity past need and denying others. So the game wants a visible "enough": the village's own need is computable (the
  population's meals through the winter, `SETTLEMENTS.md`), and the quest is the first time the hunters are told to go **past it.**
- **Proposal, the moral texture.** Fighting wolves that attack the village feels right and uses the existing combat, so the
  player may not notice it as a fall until its effects show.
- **Proposal, the cascade.** There is one archetypal pack (`BEGINNING.md`). Killing it removes the pressure on what it eats; with
  the fruiting creature (below) as the pack's staple, that means the endless meat fruit goes unchecked and "consumes everything".
  That is the Eden's first real imbalance, and it is
  Hulda's own domain to restore ("the balance of creatures", `ADVERSARIES.md`), which fits "the mechanics emerge as the player
  seeks to restore balance" (`VISION.md`).
- **Result (Noah, 2026-10-29): the vegetarian Eden is dropped.** That is option B above: blood is not the break; the surplus and
  the war are.

## The Eden before the fall has no children (Noah, 2026-10-29)

- **Noah:** a second difference between the Eden before and after the fall is **reproduction.** The hobbits may have gone for
  untold eons **without children.** The wolves too. The mammals do not reproduce.
- **The rabbits become a fruit.** Rabbits **grow continuously like plants**, a kind of **meat fruit of the planet**, and multiply
  without end. If it were not for the wolves, the hobbits and the other predators, they would consume everything. They are so
  nutritious that the hobbits need only a small number, along with what they gather, to maintain themselves.
- **Noah: this wants a different creature**, "more like a popping fungus", so the fruiting animals do not get confused with the
  mammals (who do not reproduce).
  - **Proposal, anchors:** (a) the *vegetable lamb of Tartary* (*barometz*), the medieval legend of a plant that bore lambs as its
    fruit; (b) the real **hen-of-the-woods** (*Grifola*) and **chicken-of-the-woods** (*Laetiporus*), meaty fungi that grow at oak
    bases and so belong to the Barrens' blackjack oaks; (c) a **puffball** that pops and releases. Any of these gives a creature that
    is plainly not a mammal, so a mammal that does not reproduce stays clear. **Open:** which look and name?
  - **Proposal, what it means for the code.** The warren already is a pool that regrows (`WARREN_CAP` 12, `WARREN_REGROW` 4 a day,
    `villageModel.ts`) and that the pack eats first. This is a reskin of that pool, not a new system.
- **Petal's first quest unlocks the drive (Noah).** Petal plays on the player's desire for the hobbits to have children, **something
  the hobbits secretly wish for but do not know about**, and her first quest helps unlock it.
- **Proposal, how the player comes to want it.** The pool's sight shows each creature's status (above). It could show a faint,
  unnamed ache in the hobbits that the player sees and Petal then names. The player's yearning and the hobbits' hidden one rhyme.
- **Proposal, the cost.** In the current build, infants are what the snatchers take and the sacs target (`MOTHER.md`, `D3`
  in `villageModel.ts`). **With no children there is nothing for the mother to take.** The first wished-for gift is therefore also
  the enemy's first handle, and Shub-Niggurath ("the mother of a thousand young", fecundity without end; `ADVERSARIES.md`) is the
  counterpart of exactly this advance. The fruiting creature's endless multiplication is the same pattern, held in balance by
  predation. That fits the cost-of-advancement rule precisely.
- **Proposal, the causal chain.** Children, then more mouths, then hunting past need and storing a surplus, then the competitor's
  food taken and the wolves killed (the first taker quest above), then the fruiting creature loses its predator and "consumes
  everything" (Noah's own words). Each step is Quinn's food race made playable.
- **Existing code to gate.** Births (`BIRTH_DAYS`, `wellFedDays`), the den's returning wolves and `PACK_GROW_DAYS` are the places
  that would be switched off in the beginning state and on at the unlock.

## Open

- ~~Which of A, B or C~~ Decided: B (the vegetarian Eden is dropped). **Still open:** does the first blood or the first child
  come before she leaves the spire through the first portal?
- **How far does "no reproduction" go?** Hobbits and wolves, said Noah. What of the deer, boar, bear and bobcats; and the
  thunderbird and the fish, which are not mammals? If the deer do not breed, the wolves cannot hunt them without depleting them, so
  in the beginning state the pack and the other predators would eat the fruiting creature, and the deer, boar and turkey in
  `BEGINNING.md` would be a fixed, un-hunted number until the unlock. Is that right?
- ~~Who speaks on D?~~ Decided above (Noah, 2026-10-29): a snerk.
- **What the first quest asks.** Something small and teachable that fits the first layer (a browned-out station kept running with the
  board, `DESCENT.md` D3, is the existing idea).
- **What the pool's sight gains from the first quest.** Range, new categories (the apex animals' dens, the ruins), or detail on
  status.

## Update (Noah, 2026-10-29; `ECOLOGY.md`)

The snerk on D gives a different first quest: **inhabit a deer.** Hulda rises from the soil as a deer and explores the world, unable to
interact with it, to observe up close. The first blood is the death of a hungry wolf after the hobbits overharvest the
chicken-of-the-woods. Wolves and hobbits are kin until the hobbits decide they deserve children at the wolves' expense. The bear and
thunderbird carry off hobbit elders, but only once the emotional stakes are set.
