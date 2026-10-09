import type { ArchetypeKey, Gendered, Psyche } from "./archetypes";
import type { Lang } from "./i18n";
import { KA_SCENARIOS } from "./ka";

// Keys: persona (the mask), shadow (unintegrated), soul (Anima in a man / Animus in a woman), self.
// Where the soul-image behaves differently in a man and a woman, deltas and insights are gendered.

export interface Choice {
  label: string;
  /** What the avatar says or does */
  line: string;
  deltas: Gendered<Partial<Psyche>>;
  insight: Gendered<string>;
}

export interface Scenario {
  id: string;
  kind: "situation" | "riddle";
  place: string;
  title: string;
  prompt: Gendered<string>;
  speaker?: string;
  choices: Choice[];
  quote?: { text: string; source: string };
}

export const SCENARIOS: Scenario[] = [
  {
    id: "joke",
    kind: "situation",
    place: "Office kitchen · 09:12",
    title: "The Silly Joke",
    speaker: "Marco, colleague",
    prompt:
      "“Why did the scarecrow get promoted? Because he was outstanding in his field!” Marco grins. Everyone turns to you.",
    choices: [
      {
        label: "Fake a big laugh",
        line: "“Hahaha, classic Marco!”",
        deltas: { persona: 7, shadow: 3, self: -2 },
        insight:
          "Pure Persona: the social mask doing its job. That's useful, but when you put it on automatically, your real reaction gets exiled. The eye-roll you swallowed doesn't vanish. It sinks into the Shadow.",
      },
      {
        label: "Show with your eyes it wasn't funny",
        line: "A slow, deliberate eye-roll.",
        deltas: { shadow: 5, soul: 4, self: -2 },
        insight: {
          man: "A touchy, contemptuous mood leaking out, typical of an unconscious Anima: petty irritation instead of a clear feeling. The aggression underneath is Shadow.",
          woman:
            "A cold verdict delivered without a word, typical of an unconscious Animus: judgment with no relationship in it. The contempt underneath is Shadow.",
        },
      },
      {
        label: "Be honest and warm",
        line: "“That's terrible. I love it. Got another one?”",
        deltas: { self: 8, persona: -3, shadow: -3 },
        insight:
          "Truth and warmth held together. The Self is what holds opposites (honesty and kindness) without splitting them, and the mask can loosen because nothing needs hiding.",
      },
      {
        label: "Laugh at how bad it is",
        line: "You genuinely crack up at the absurdity.",
        deltas: { man: { soul: 5, persona: -3, shadow: -2 }, woman: { self: 4, persona: -4, shadow: -2 } },
        insight: {
          man: "Play and Eros are gifts of a living Anima. Spontaneous joy drops the mask without any effort.",
          woman:
            "Spontaneous joy drops the mask. When you stop managing how you come across, the Persona thins and something truer shows.",
        },
      },
    ],
  },
  {
    id: "candy",
    kind: "situation",
    place: "Summer fair · 17:40",
    title: "Cotton Candy",
    prompt:
      "A pink cloud of cotton candy spins in front of you. It smells like being seven years old. Your inner voice says: “Sugar. Bad for your teeth.”",
    choices: [
      {
        label: "Refuse rigidly",
        line: "“No. Sugar is poison.” You walk away tense.",
        deltas: { shadow: 8, persona: 4 },
        insight:
          "The 'disciplined, healthy person' is a Persona, and the desire you deny so hard doesn't disappear. It goes underground. In the popular paraphrase of Jung, what you resist persists: the repressed wish gains energy in the Shadow.",
      },
      {
        label: "Buy one and savour it",
        line: "You eat it slowly, sticky-fingered and happy.",
        deltas: { self: 6, shadow: -5, persona: -3 },
        insight:
          "This is a conscious yes to the inner child (the puer). Indulging with awareness integrates the desire instead of exiling it. Once the need is met consciously, it stops running you.",
      },
      {
        label: "Refuse, then binge in secret",
        line: "In public you say no. Later you eat three alone in the car.",
        deltas: { shadow: 12, persona: 3, self: -4 },
        insight:
          "Enantiodromia: anything pushed to an extreme flips into its opposite. A spotless Persona in public, a secret binge in the car. The wider the gap between mask and life, the stronger the Shadow.",
      },
      {
        label: "Mock the adults eating it",
        line: "“So childish,” you mutter.",
        deltas: { shadow: 7, persona: 3 },
        insight:
          "Projection. The 'childishness' you mock out there is your own exiled inner child. Whatever we despise in others often points to something we have disowned.",
      },
    ],
  },
  {
    id: "how-are-you",
    kind: "situation",
    place: "Corridor · Wednesday",
    title: "“How Are You?”",
    speaker: "Your manager, passing by",
    prompt:
      "It has been a terrible week: a breakup, little sleep. Your manager smiles in the corridor: “Hey! How are you?”",
    choices: [
      {
        label: "“Great, thanks! Super busy!”",
        line: "Big smile. Thumbs up.",
        deltas: { persona: 7, shadow: 3 },
        insight:
          "The Persona at full thickness. Some mask at work is healthy, but when 'great!' is the only answer you ever allow yourself, the real feeling has nowhere to go but down.",
      },
      {
        label: "Tell them everything",
        line: "Twenty minutes in the corridor: the breakup, the tears, the details.",
        deltas: { persona: -8, self: -2, soul: 3 },
        insight: {
          man: "This is a Persona that is too thin. Jung warned that without a mask you are exposed, flooded by the inner world. Here the Anima's mood speaks through you, unfiltered.",
          woman:
            "This is a Persona that is too thin. Jung warned that without a mask you are exposed, flooded by the inner world. Being honest isn't the same as having no boundary.",
        },
      },
      {
        label: "Honest, with a boundary",
        line: "“Honestly, a rough week. I'm handling it. Thanks for asking.”",
        deltas: { self: 7, persona: -3, shadow: -2 },
        insight:
          "A healthy Persona is a filter, not a wall. You tell the truth in a form that fits the setting. That is the Self using the mask instead of hiding behind it.",
      },
      {
        label: "Change the subject",
        line: "“Oh, did you see the new coffee machine?”",
        deltas: { persona: 4, shadow: 2 },
        insight: "Deflection keeps the mask in place and the feeling unprocessed.",
      },
    ],
    quote: {
      text: "…a kind of mask, designed on the one hand to make a definite impression upon others, and, on the other, to conceal the true nature of the individual.",
      source: "C. G. Jung on the Persona, Two Essays on Analytical Psychology",
    },
  },
  {
    id: "smoke",
    kind: "situation",
    place: "Balcony · 23:04",
    title: "The Last Cigarette",
    prompt:
      "You decided to quit smoking. Day four. A craving hits like a wave. There's one cigarette left in the drawer.",
    choices: [
      {
        label: "White-knuckle it, insult yourself",
        line: "“You're pathetic. Don't you dare.”",
        deltas: { man: { shadow: 7, self: -2 }, woman: { soul: 6, shadow: 5 } },
        insight: {
          man: "Willpower that runs on self-contempt splits you in two. The despised part doesn't leave. It goes underground and keeps plotting in the Shadow.",
          woman:
            "This is the negative Animus as inner tyrant, the merciless voice Marie-Louise von Franz described, the one that tells you you're worthless. Willpower that runs on self-contempt splits you, and the split-off part keeps plotting in the Shadow.",
        },
      },
      {
        label: "Smoke it, quit Monday",
        line: "“Just this one. Monday for real.”",
        deltas: { shadow: 7, self: -3 },
        insight:
          "Rationalisation is how the Shadow speaks politely. The ego makes a deal, and the complex gets stronger.",
      },
      {
        label: "Ask the craving what it wants",
        line: "You sit with it. It wants a pause, a breath, a little rebellion. You step outside and breathe for five minutes.",
        deltas: { self: 10, shadow: -6 },
        insight:
          "This treats the symptom as a symbol. In a 1961 letter to Bill W. (co-founder of AA), Jung wrote that craving can be a disguised thirst for wholeness. If you give the real need a conscious form, the substitute loses power.",
      },
      {
        label: "Call a friend: “I'm struggling.”",
        line: "Your voice shakes a bit. They stay on the line.",
        deltas: { persona: -6, self: 4, shadow: -3 },
        insight:
          "You dropped the 'I've got this' mask. Admitting vulnerability to another person takes the secret power away from the complex.",
      },
    ],
  },
  {
    id: "riddle-shadow",
    kind: "riddle",
    place: "The Sphinx · Riddle I",
    title: "The One Who Follows",
    speaker: "The Sphinx",
    prompt:
      "“I walk behind you in daylight, I vanish at noon, and at night I am everywhere. The more you deny me, the longer I grow. What am I?”",
    choices: [
      {
        label: "Your Shadow",
        line: "“I am you, the part I don't look at.”",
        deltas: { self: 8, shadow: -5 },
        insight:
          "Correct. Naming the Shadow is the first act of integration. It 'vanishes at noon' because full consciousness casts no shadow, and denial makes it grow.",
      },
      {
        label: "Your past",
        line: "“My history.”",
        deltas: { shadow: 2 },
        insight: "That's a reasonable answer, but the past doesn't grow when you deny it. The Shadow does.",
      },
      {
        label: "Your fear",
        line: "“Fear.”",
        deltas: { shadow: 3, self: 1 },
        insight:
          "You're close. Fear often guards the Shadow's door, but the Shadow holds much more than fear: desire, anger, and unlived gifts.",
      },
      {
        label: "“Riddles are pointless.”",
        line: "You shrug, too cool to play, and walk past the Sphinx.",
        deltas: { shadow: 5, persona: 4 },
        insight:
          "A 'too cool to care' Persona dismisses the question, and in myth, whoever ignores the Sphinx gets devoured.",
      },
    ],
    quote: {
      text: "One does not become enlightened by imagining figures of light, but by making the darkness conscious.",
      source: "C. G. Jung, Alchemical Studies",
    },
  },
  {
    id: "critique",
    kind: "situation",
    place: "Meeting room · 14:30",
    title: "The Critique",
    speaker: "Your manager",
    prompt: "In front of the team: “Honestly, your presentation lacked depth.” Your face gets hot.",
    choices: [
      {
        label: "Counter-attack",
        line: "“Funny, coming from someone whose last report was late.”",
        deltas: { man: { shadow: 8, self: -2 }, woman: { soul: 6, shadow: 5 } },
        insight: {
          man: "The hurt is real, but the attack is the Shadow defending a wounded ego: raw aggression, unexamined.",
          woman:
            "Animus possession: the sword comes out before thinking does. The hurt is real, but a cutting verdict takes the place of a real conversation.",
        },
      },
      {
        label: "Smile, nod, ruminate all night",
        line: "“Sure, of course.” At 2 a.m. you're still replaying it.",
        deltas: { persona: 4, soul: 4, shadow: 4 },
        insight: {
          man: "A smiling mask by day, and the negative Anima by night: brooding, sulking, sinking into a mood. The anger you didn't express turns inward.",
          woman:
            "A smiling mask by day, and the negative Animus by night: an inner judge replaying verdicts. The anger you didn't express turns into self-prosecution.",
        },
      },
      {
        label: "Get curious",
        line: "“Which part felt shallow? I'd like to understand.”",
        deltas: { self: 8, soul: 2, shadow: -4 },
        insight: {
          man: "This is a related Anima (the capacity to stay in contact while it hurts) serving the Self. You hold the sting and the curiosity at once.",
          woman:
            "This is a mature Animus (clear, steady words) serving the Self. You hold the sting and the curiosity at once.",
        },
      },
      {
        label: "Joke it off",
        line: "“Depth is overrated anyway!”",
        deltas: { persona: 6, shadow: 3 },
        insight: "Humour as Persona armour. You get through the moment, but the wound goes unexamined.",
      },
    ],
  },
  {
    id: "colleague",
    kind: "situation",
    place: "Open space · Monday",
    title: "The Irritating New Hire",
    prompt:
      "The new colleague is loud, self-promoting, and always talks about their achievements. You can't stand them, and you don't even know why it bothers you so much.",
    choices: [
      {
        label: "Gossip about them",
        line: "“Did you hear them in the meeting? So full of themselves.”",
        deltas: { shadow: 10 },
        insight:
          "Pure projection. The intensity of your irritation is the clue: it's out of proportion because it's carrying something of yours.",
      },
      {
        label: "Ask what you're not allowing yourself",
        line: "In your journal: “Maybe I want to be seen too, and I never let myself.”",
        deltas: { self: 9, shadow: -8 },
        insight:
          "Withdrawing a projection. This is the core move of shadow work, and it brings back energy you'd been spending on hating them.",
      },
      {
        label: "Avoid them entirely",
        line: "You take the long way around their desk.",
        deltas: { shadow: 4, persona: 2 },
        insight: "Avoidance keeps the projection intact. The trigger stays outside, so the lesson stays outside too.",
      },
      {
        label: "Invite them to lunch",
        line: "“Tell me how you got into this field.”",
        deltas: { self: 4, persona: -2, shadow: -3 },
        insight: "Relating to the real person dissolves the projected image. People are rarely the monsters our Shadow paints.",
      },
    ],
    quote: {
      text: "Everything that irritates us about others can lead us to an understanding of ourselves.",
      source: "C. G. Jung, Memories, Dreams, Reflections",
    },
  },
  {
    id: "dream",
    kind: "situation",
    place: "Bedroom · 06:10",
    title: "The Dream of the Lake",
    prompt: {
      man: "You wake from a vivid dream. An unknown woman with a lantern led you through a dark forest to a lake and pointed down into the water, smiling.",
      woman:
        "You wake from a vivid dream. An unknown man, calm and certain, led you through a dark forest to a lake and pointed down into the water.",
    },
    choices: [
      {
        label: "Forget it, dreams are noise",
        line: "You check your phone and the dream dissolves.",
        deltas: { shadow: 4, persona: 2, soul: -2 },
        insight:
          "For Jung, dreams were letters from the unconscious, and unread letters pile up. A purely daytime, Persona-only life shuts the door on the inner world.",
      },
      {
        label: "Write it down and draw it",
        line: "A sketch of the lake, the figure, the pointing hand.",
        deltas: { soul: 7, self: 3 },
        insight: {
          man: "Honouring the image. The unknown woman who leads you to the water is your Anima as psychopomp, the guide of souls into the unconscious.",
          woman:
            "Honouring the image. The unknown man who leads you to the water is your Animus as psychopomp, the guide of souls into the unconscious.",
        },
      },
      {
        label: "Active imagination",
        line: "Eyes closed, you return to the lake and ask the figure: “What do you want to show me?”",
        deltas: { self: 8, soul: 5, shadow: -3 },
        insight: {
          man: "This is Jung's own method: dialoguing with inner figures while awake. Jung spoke with his Anima this way, and it's how she becomes a conscious partner instead of a hidden mood.",
          woman:
            "This is Jung's own method: dialoguing with inner figures while awake. It's how the Animus becomes a conscious partner, a source of direction instead of a voice of judgment.",
        },
      },
      {
        label: "Google the meaning",
        line: "“lake dream meaning” and you accept the first result.",
        deltas: { soul: -3, persona: 2, self: -1 },
        insight:
          "This intellectualises the dream. Jung rejected fixed dream dictionaries because a symbol means something in the context of your life, not in general.",
      },
    ],
    quote: {
      text: "The dream is a little hidden door in the innermost and most secret recesses of the soul.",
      source: "C. G. Jung, The Meaning of Psychology for Modern Man",
    },
  },
  {
    id: "boxing",
    kind: "situation",
    place: "Boxing gym · 19:00",
    title: "Try a Fist",
    speaker: "Your friend",
    prompt: "“Come to a boxing class with me!” You've always said you're just not an aggressive person.",
    choices: [
      {
        label: "“Violence isn't me.”",
        line: "You decline, a little too fast.",
        deltas: { shadow: 7, persona: 3 },
        insight:
          "The 'nice person' Persona has a Shadow attached. Disowned aggression doesn't disappear. It leaks out as passive-aggression.",
      },
      {
        label: "Go and hit the bag hard",
        line: "Thud. Thud. You start laughing at your own strength.",
        deltas: { man: { shadow: -7, self: 5 }, woman: { shadow: -7, soul: 4, self: 3 } },
        insight: {
          man: "The Shadow holds gold. When aggression is consciously channelled, it becomes vitality, assertiveness, and healthy boundaries.",
          woman:
            "The Shadow holds gold, and the positive Animus lends you strength and decisiveness. When aggression is consciously channelled, it becomes vitality and boundaries.",
        },
      },
      {
        label: "Go, but judge the 'meatheads'",
        line: "You spend the class feeling superior.",
        deltas: { shadow: 5, persona: 3 },
        insight: "Your body is in the room, but your projection (and your image of being above it) runs the show.",
      },
      {
        label: "Go, feel scared, stay anyway",
        line: "Your hands shake. You stay till the end.",
        deltas: { self: 6, persona: -2, shadow: -3 },
        insight: "Courage isn't the absence of fear. It's the Self holding the fear while you act anyway.",
      },
    ],
  },
  {
    id: "fascination",
    kind: "situation",
    place: "A friend's party · 23:30",
    title: "Love at First Sight",
    prompt: {
      man: "You talk to a woman for twenty minutes. She's mysterious, luminous, she seems to understand you completely. You know almost nothing about her, but you're already sure she's the one.",
      woman:
        "You talk to a man for twenty minutes. He's brilliant, certain, he seems to know exactly where life goes. You know almost nothing about him, but you're already sure he's the one.",
    },
    choices: [
      {
        label: "Plan the future in your head",
        line: "By midnight you've named your children.",
        deltas: { soul: 9, self: -3 },
        insight: {
          man: "This is the classic Anima projection. Instant, total fascination means you've fallen for your own inner image of the feminine, painted onto a stranger. When the real woman shows through, the spell will break.",
          woman:
            "This is the classic Animus projection. Instant, total fascination means you've fallen for your own inner hero or guide, painted onto a stranger. When the real man shows through, the spell will break.",
        },
      },
      {
        label: "Play it cool",
        line: "You pretend you're barely interested.",
        deltas: { persona: 6, shadow: 3 },
        insight: "The mask protects you from being seen wanting. The longing goes underground.",
      },
      {
        label: "Get curious about the real person",
        line: "“Tell me something nobody would guess about you.”",
        deltas: { self: 6, soul: 2, persona: -2 },
        insight:
          "You relate to the person instead of the projection. The fascination is real, but now there's room for who they actually are.",
      },
      {
        label: "Ask what in them belongs to you",
        line: "Later, at home: “What quality am I longing for, and where is it in me?”",
        deltas: { self: 8, soul: 3, shadow: -3 },
        insight: {
          man: "Withdrawing the projection. You take back the Anima you placed on her, so the feeling, depth, and inspiration become your own capacities. You can still love her, as herself.",
          woman:
            "Withdrawing the projection. You take back the Animus you placed on him, so the courage, clarity, and direction become your own capacities. You can still love him, as himself.",
        },
      },
    ],
    quote: {
      text: "The meeting of two personalities is like the contact of two chemical substances: if there is any reaction, both are transformed.",
      source: "C. G. Jung, Modern Man in Search of a Soul",
    },
  },
  {
    id: "dance",
    kind: "situation",
    place: "Wedding party · 22:15",
    title: "The Dance Floor",
    prompt: "Someone grabs your hand: “Come dance!” You are, objectively, a terrible dancer.",
    choices: [
      {
        label: "Dance badly and joyfully",
        line: "Arms everywhere. Zero rhythm. Pure joy.",
        deltas: { man: { persona: -6, soul: 4, self: 3 }, woman: { persona: -6, self: 5 } },
        insight: {
          man: "This is Eros and embodiment, the Anima alive in the body. When you release the need to look good, the Persona drops and life flows in.",
          woman: "This is embodiment and play. When you release the need to look good, the Persona drops and life flows in.",
        },
      },
      {
        label: "“I'll film everyone instead!”",
        line: "You hide behind your phone.",
        deltas: { persona: 5, shadow: 2 },
        insight: "The camera becomes a Persona shield. You're watching life instead of living it.",
      },
      {
        label: "Dance while judging your body",
        line: "You move, but a voice inside keeps commenting.",
        deltas: { man: { persona: 4, shadow: 4 }, woman: { persona: 3, soul: 4, shadow: 2 } },
        insight: {
          man: "You perform the dance for an imagined audience. The Persona watches, and the shame gathers in the Shadow.",
          woman: "This is the negative Animus as inner critic, present even on the dance floor, judging every move.",
        },
      },
      {
        label: "One dance, then sit happily",
        line: "“That was fun. I'm good now.” And you mean it.",
        deltas: { self: 6, persona: -2 },
        insight: "This is an authentic boundary. The Self knows what's enough, without guilt and without performance.",
      },
    ],
  },
  {
    id: "envy",
    kind: "situation",
    place: "Bed, phone · 02:00",
    title: "Envy at 2 a.m.",
    prompt: "An old classmate just announced a book deal. Your stomach drops.",
    choices: [
      {
        label: "Leave a sarcastic comment",
        line: "“Wow, anyone can publish these days 😅”",
        deltas: { shadow: 9 },
        insight: "The Shadow acted out. Envy that isn't acknowledged turns into small cruelty.",
      },
      {
        label: "“Congrats!!” (You feel sick.)",
        line: "Three heart emojis. Phone face-down.",
        deltas: { persona: 6, shadow: 4 },
        insight: "These are Persona words over real feelings. It's polite, but the envy stays buried and keeps working.",
      },
      {
        label: "Let the envy point the way",
        line: "“I'm envious. That means I want to write.” You open a blank page.",
        deltas: { man: { self: 10, shadow: -7 }, woman: { self: 9, soul: 3, shadow: -7 } },
        insight: {
          man: "Envy is a compass toward your unlived life. Turning it into action is shadow integration at its best.",
          woman:
            "Envy is a compass toward your unlived life. The positive Animus turns it into a decision and a first deed. That's shadow integration at its best.",
        },
      },
      {
        label: "Spiral: “I'm a failure.”",
        line: "You scroll until 4 a.m.",
        deltas: { soul: 5, shadow: 5, self: -2 },
        insight: {
          man: "This is a negative-Anima mood: self-pity, melancholy, drowning in feeling without reflecting on it.",
          woman:
            "This is the negative Animus's devastating verdict: 'you'll never amount to anything'. Recognise the voice. It's an inner figure speaking, not the truth.",
        },
      },
    ],
  },
  {
    id: "riddle-self",
    kind: "riddle",
    place: "The Mirror · Riddle II",
    title: "The Center and the Circle",
    speaker: "The Mirror",
    prompt:
      "“I was never born and I never die. I am the center and the whole circle. Every road you walk leads back to me. Who am I?”",
    choices: [
      {
        label: "God",
        line: "“The divine.”",
        deltas: { self: 4, soul: 2 },
        insight:
          "That's partly right. Jung said the Self is psychologically indistinguishable from the God-image (imago Dei). But the riddle points inward.",
      },
      {
        label: "The Ego",
        line: "“Me, the one talking.”",
        deltas: { persona: 4, self: -2 },
        insight:
          "The ego is only the center of consciousness, and it easily mistakes itself for its mask. The Self is the center and the circumference of the whole psyche, conscious and unconscious.",
      },
      {
        label: "The Self",
        line: "“The Self, the whole of me.”",
        deltas: { self: 9, shadow: -3 },
        insight:
          "Correct. Jung saw the Self in mandalas worldwide: a center with a circle around it. Individuation is the lifelong road back to it.",
      },
      {
        label: "The Persona",
        line: "“The face everyone sees.”",
        deltas: { persona: 5 },
        insight:
          "The Persona is the opposite: a mask, a fragment, made to be seen. That's why in your vessel it sits over the face. The Self isn't made to be seen. It just is.",
      },
    ],
    quote: {
      text: "The Self is not only the centre, but also the whole circumference which embraces both conscious and unconscious.",
      source: "C. G. Jung, Psychology and Alchemy",
    },
  },
];

/** The archetype(s) that moved most (by absolute raw delta). */
export function biggestMovers(d: Partial<Psyche>): ArchetypeKey[] {
  const entries = Object.entries(d) as [ArchetypeKey, number][];
  const max = Math.max(...entries.map(([, v]) => Math.abs(v)));
  return entries.filter(([, v]) => Math.abs(v) === max).map(([k]) => k);
}

/** Scenario text in the reader's language; ids, kinds and deltas always come from the source above. */
export function localizeScenario(s: Scenario, lang: Lang): Scenario {
  if (lang === "en") return s;
  const t = KA_SCENARIOS[s.id];
  if (!t) return s;
  return {
    ...s,
    place: t.place,
    title: t.title,
    speaker: t.speaker ?? s.speaker,
    prompt: t.prompt,
    quote: t.quote ?? s.quote,
    choices: s.choices.map((c, i) => ({ ...c, ...(t.choices[i] ?? {}) })),
  };
}
