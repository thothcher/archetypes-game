import type { ArchetypeKey, Gendered, Psyche } from "./archetypes";
import type { Lang } from "./locale";
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
  /** id of the practice (lib/practices.ts) that trains the healthier response */
  practice?: string;
}

export const SCENARIOS: Scenario[] = [
  {
    id: "joke",
    kind: "situation",
    place: "Office kitchen · 09:12",
    title: "The Silly Joke",
    practice: "mask-inventory",
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
    practice: "conscious-yes",
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
    practice: "true-answer",
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
    practice: "active-imagination",
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
    practice: "projection-log",
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
    practice: "soul-voice",
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
    practice: "projection-log",
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
    practice: "dream-journal",
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
    practice: "body-fire",
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
    practice: "take-back",
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
    practice: "offline",
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
    practice: "soul-gift",
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
    practice: "mandala",
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
  {
    id: "family-question",
    kind: "situation",
    place: "Sunday lunch at your parents' · 14:00",
    title: "The Question",
    practice: "soul-voice",
    speaker: "Your aunt, passing the salad",
    prompt: "“So, when are you getting married? Your cousin already has two kids!” The whole table goes quiet and waits.",
    choices: [
      {
        label: "“Soon, soon!”",
        line: "A bright smile, then you steer the talk to the weather.",
        deltas: { persona: 7, shadow: 3 },
        insight:
          "The family Persona: the good child who never makes a scene. It keeps the peace at the table, but whatever you really feel about the question goes unsaid and sinks into the Shadow.",
      },
      {
        label: "Snap back",
        line: "“And when are you going to mind your own business?”",
        deltas: { man: { shadow: 8, self: -2 }, woman: { soul: 5, shadow: 5, self: -1 } },
        insight: {
          man: "Years of swallowed irritation come out all at once. The Shadow erupts precisely because it was never allowed to speak in small doses.",
          woman:
            "The Animus draws the sword: a cutting line, delivered as a verdict. The anger is fair, but the sharpness ends the conversation instead of having it.",
        },
      },
      {
        label: "Warm, with a boundary",
        line: "“When it's right, you'll be the first to know. Now tell me about your garden.”",
        deltas: { self: 8, persona: -2, shadow: -3 },
        insight:
          "Kindness and a closed door at the same time. The Self doesn't need to win the argument or obey the expectation. It answers from its own center and moves on.",
      },
      {
        label: "Say nothing, brood all week",
        line: "You nod. On the drive home the question keeps replaying.",
        deltas: { man: { soul: 6, shadow: 3 }, woman: { soul: 6, shadow: 2, self: -1 } },
        insight: {
          man: "A negative-Anima mood: a heavy, sulky cloud you can't quite name. The feeling never became a word, so it became weather.",
          woman:
            "Now the inner judge takes over your aunt's job: “maybe she's right, something is wrong with you.” Ask whose voice that is. It's a figure inside you, not the truth.",
        },
      },
    ],
    quote: {
      text: "The shoe that fits one person pinches another; there is no recipe for living that suits all cases.",
      source: "C. G. Jung, Modern Man in Search of a Soul",
    },
  },
  {
    id: "toast",
    kind: "situation",
    place: "Birthday feast · 21:40",
    title: "The Toast",
    practice: "true-answer",
    speaker: "The toastmaster, glass raised",
    prompt: "“And now, a few words from you!” Thirty faces turn your way, glasses in the air. You hate speaking in public.",
    choices: [
      {
        label: "Recite a polished cliché",
        line: "“To health, to happiness, to everyone at this table!” Perfect, safe, empty.",
        deltas: { persona: 6, self: -1 },
        insight:
          "The Persona has a ready-made speech for every occasion. Nothing goes wrong, and nothing of you is in it either. The mask did the talking.",
      },
      {
        label: "Say one true thing, clumsily",
        line: "Your voice wobbles: “It was a hard year. This table is why I'm okay.”",
        deltas: { man: { self: 8, soul: 2, persona: -4 }, woman: { self: 8, persona: -4, shadow: -1 } },
        insight: {
          man: "A true word with feeling in it: the Anima lending warmth to the Self. The wobble isn't failure. It's the sound of the mask coming off.",
          woman: "A true word, plainly said. The Self speaks without polish, and the wobble is the sound of the mask coming off.",
        },
      },
      {
        label: "Mumble, drink, burn with shame",
        line: "“Uh… cheers.” You stare at your plate for the rest of the night.",
        deltas: { shadow: 6, persona: 2, self: -2 },
        insight:
          "Shame is the Shadow's favourite food. The moment the mask had nothing prepared, you felt naked, and the feeling went underground to wait for the next toast.",
      },
      {
        label: "Get carried away",
        line: "It starts as a toast and becomes a twenty-minute sermon, half tears and half lecture.",
        deltas: { soul: 7, persona: 2, self: -2 },
        insight: {
          man: "Anima possession: sentimentality takes the microphone. The tears are real, but you're swept along by the feeling instead of relating to it.",
          woman:
            "Animus possession: the toast turns into a sermon on how everyone ought to live. Opinions arrive dressed as eternal truths, and the people at the table disappear.",
        },
      },
    ],
  },
  {
    id: "perfect-post",
    kind: "situation",
    place: "Beach, last evening of the holiday · 19:20",
    title: "The Perfect Post",
    practice: "offline",
    prompt:
      "You and your partner argued for most of the trip. Now the sunset is perfect, and so is the photo of the two of you, smiling in front of it.",
    choices: [
      {
        label: "Post it: “Best trip ever ❤️”",
        line: "Filter, caption, share. It looks like a dream.",
        deltas: { persona: 8, shadow: 3 },
        insight:
          "Persona at industrial scale. The image replaces the experience, and the argument, which was the real story of the trip, goes underground.",
      },
      {
        label: "Refresh the likes all evening",
        line: "47. Refresh. 52. Refresh.",
        deltas: { persona: 6, shadow: 2, self: -3 },
        insight:
          "When the mask's audience decides how you feel, the ego hands its center to strangers. The counter goes up while the Self goes quiet.",
      },
      {
        label: "Put the phone away and talk",
        line: "“Can we talk about this week? I don't want to pretend it was fine.”",
        deltas: { self: 7, persona: -4, shadow: -2 },
        insight:
          "You choose the relationship over its picture. Talking about the real thing thins the Persona and gives the unspoken tension somewhere to go besides the Shadow.",
      },
      {
        label: "A caption with a sting",
        line: "“Survived seven days with this one 🙃”",
        deltas: { shadow: 6, soul: 3, persona: 2 },
        insight: {
          man: "A jab dressed as a joke, posted where your partner can't answer back. The hurt Anima sulks in public, and the Shadow does the writing.",
          woman:
            "A verdict dressed as a joke, posted where your partner can't answer back. The Animus passes judgement, and the Shadow does the writing.",
        },
      },
    ],
  },
  {
    id: "traffic",
    kind: "situation",
    place: "On the road to work · 08:47",
    title: "Cut Off",
    practice: "body-fire",
    prompt:
      "A car swerves in front of you without signalling. You slam on the brakes and your coffee lands in your lap. You're usually the calm one.",
    choices: [
      {
        label: "Lean on the horn and scream",
        line: "Words you would never say in front of your mother.",
        deltas: { shadow: 7, persona: -2, self: -2 },
        insight:
          "The 'calm one' Persona has no room for anger, so the anger waits in the Shadow and breaks through the moment the mask is jolted. All that energy, and none of it conscious.",
      },
      {
        label: "Chase them down",
        line: "For two kilometres you ride their bumper.",
        deltas: { shadow: 10, self: -3 },
        insight:
          "Possession by an affect. For a few minutes the complex is driving, literally, and you're the passenger. Jung's warning about complexes: we think we have them, but often they have us.",
      },
      {
        label: "Breathe and name it",
        line: "“Wow. I'm furious. My hands are shaking.” You breathe until the light turns green.",
        deltas: { man: { self: 7, soul: 2, shadow: -4 }, woman: { self: 8, shadow: -4 } },
        insight: {
          man: "You notice the fire without becoming it. Naming the exact feeling is the work of a related Anima, and the Self holds the anger instead of being thrown by it.",
          woman: "You notice the fire without becoming it. The anger is yours, felt and contained, and the Self stays in the driver's seat.",
        },
      },
      {
        label: "Replay it all day",
        line: "You tell the story to everyone you meet, a little angrier each time.",
        deltas: { soul: 5, shadow: 4, self: -1 },
        insight: {
          man: "A negative-Anima mood: the incident sours the whole day, and you snap at people and sulk without knowing why. The feeling was never digested, so it spreads.",
          woman:
            "The inner prosecutor builds the case: “people like that shouldn't be allowed to drive.” Opinions and verdicts multiply, all about them, and the hurt itself is never looked at.",
        },
      },
    ],
  },
  {
    id: "ex-text",
    kind: "situation",
    place: "Bed, phone · 01:13",
    title: "The Text from the Ex",
    practice: "take-back",
    prompt: "Eight months of silence, and then: “hey. been thinking about you.” Your heart starts doing something stupid.",
    choices: [
      {
        label: "Reply at once, at length",
        line: "Four paragraphs. Every feeling since the breakup.",
        deltas: { soul: 8, self: -2 },
        insight: {
          man: "The Anima floods in as longing and sweeps you away. The woman you're writing to is half memory and half your own soul-image, which is why the pull feels so much bigger than the person.",
          woman:
            "The Animus image flares up again: the one who once seemed to know where your life was going. The pull feels like fate, and that's how you can tell it's a projection and not only the person.",
        },
      },
      {
        label: "Leave it on read, post a glowing selfie",
        line: "You, laughing, looking great. Posted at 1:20 a.m.",
        deltas: { persona: 6, shadow: 4 },
        insight:
          "Revenge staged by the Persona. The image says “I'm fine”, and the hurt underneath it goes quietly into the Shadow.",
      },
      {
        label: "Wait for morning, write first",
        line: "In your notes: “I miss being known. Not necessarily by them.”",
        deltas: { self: 8, soul: 2, shadow: -2 },
        insight:
          "Naming exactly what you long for separates the need from the person. Then you get to decide what to do, instead of the longing deciding for you.",
      },
      {
        label: "Reply with ice",
        line: "“lol. no.” You block the number, then lie awake until four.",
        deltas: { shadow: 6, soul: 3, self: -2 },
        insight: {
          man: "Contempt as armour. It protects the wound, but the feeling it can't afford drops into the Shadow, and the Anima takes her revenge as a sleepless, restless mood.",
          woman:
            "A cutting verdict as armour, typical of the negative Animus. It protects the wound, but the feeling it can't afford drops into the Shadow and keeps you awake.",
        },
      },
    ],
  },
  {
    id: "favor",
    kind: "situation",
    place: "Phone call · Friday 20:00",
    title: "“Can You Help Me Move?”",
    practice: "unsent-letter",
    speaker: "The same friend, for the fourth time this year",
    prompt:
      "“You're the best! Can you help me move on Saturday? And bring your car?” You had planned to finally rest this weekend.",
    choices: [
      {
        label: "“Of course!”",
        line: "Then you complain about it to three other people.",
        deltas: { persona: 6, shadow: 5 },
        insight:
          "The 'always helpful' Persona. Every no you swallow turns into a little resentment, and resentment is the Shadow's savings account.",
      },
      {
        label: "Say yes, then show up late and sulky",
        line: "Two hours late. You carry exactly one box.",
        deltas: { shadow: 8, persona: 2 },
        insight:
          "Passive aggression is the Shadow saying the no you didn't. The anger gets out anyway, just sideways, where nobody can name it.",
      },
      {
        label: "A clear, warm no",
        line: "“Not this time. I need this weekend. I hope the move goes smoothly.”",
        deltas: { man: { self: 7, persona: -3, shadow: -4 }, woman: { self: 6, soul: 2, persona: -3, shadow: -4 } },
        insight: {
          man: "This is what integrated aggression looks like: a calm no. A boundary is respect in both directions, and a friendship survives it far better than it survives resentment.",
          woman:
            "The positive Animus gives you a clear word, and the Self keeps it warm. A boundary is respect in both directions, and a friendship survives it far better than it survives resentment.",
        },
      },
      {
        label: "Finally tell them what you think",
        line: "“You know what your problem is?” Fifteen minutes, with examples.",
        deltas: { man: { shadow: 7, self: -1 }, woman: { soul: 6, shadow: 4 } },
        insight: {
          man: "The anger is legitimate, but after years in the cellar it comes out all at once. A Shadow that never gets out in small doses eventually explodes.",
          woman:
            "Animus possession: a fair complaint grows into a sweeping verdict on their whole character. It's truthful, but there's no relationship left in it.",
        },
      },
    ],
  },
  {
    id: "compliment",
    kind: "situation",
    place: "All-hands meeting · 11:00",
    title: "The Compliment",
    practice: "mask-inventory",
    speaker: "Your director",
    prompt:
      "“I want to thank one person in particular. This project happened because of you.” Everyone applauds. You'd like to disappear.",
    choices: [
      {
        label: "“Oh, it was nothing, it was the team”",
        line: "You wave it away and stare at the table.",
        deltas: { persona: 5, shadow: 4 },
        insight:
          "False modesty is a mask too. Jungians call this the 'golden shadow': we can disown our gifts as stubbornly as our faults, and a gift you never live weighs on you as well.",
      },
      {
        label: "“Thank you. I worked hard on it.”",
        line: "You let it land. It feels strange, and good.",
        deltas: { self: 8, persona: -3, shadow: -3 },
        insight:
          "Receiving without inflating or shrinking. The Self can take in the light without needing to hide it or grab it.",
      },
      {
        label: "Smile while a voice says “fraud”",
        line: "Outside you nod. Inside, a voice lists every mistake you've ever made.",
        deltas: { man: { soul: 5, shadow: 3, self: -1 }, woman: { soul: 6, shadow: 2, self: -1 } },
        insight: {
          man: "A dark Anima mood swallows the praise: a familiar melancholy whispering that none of it is real. It's a mood, not a measurement.",
          woman:
            "The negative Animus as prosecutor: its verdict, 'fraud', is louder than any applause. Recognise the voice. It's an inner figure speaking, not the truth.",
        },
      },
      {
        label: "Make it your story all week",
        line: "By Friday everyone has heard how hard it all was without you.",
        deltas: { persona: 7, self: -3 },
        insight:
          "Inflation is Jung's word for the ego swelling up with something bigger than itself, here the role of the hero. It feels like a lift, and it usually ends in a fall.",
      },
    ],
  },
  {
    id: "meltdown",
    kind: "situation",
    place: "Supermarket checkout · 18:30",
    title: "The Meltdown",
    practice: "soul-voice",
    prompt:
      "You're looking after your four-year-old nephew. He wants a chocolate bar, hears no, and throws himself on the floor, screaming. The whole queue is staring at you.",
    choices: [
      {
        label: "Hiss: “Stop it, people are watching!”",
        line: "You pull him up by the arm, your face burning.",
        deltas: { persona: 6, shadow: 3, self: -1 },
        insight:
          "Notice who the scolding is for: the onlookers. The Persona has taken over, and the child's feeling gets treated as an embarrassment instead of a feeling.",
      },
      {
        label: "Buy the chocolate to make it stop",
        line: "Instant silence. Victory? Not quite.",
        deltas: { persona: 4, shadow: 3, self: -2 },
        insight:
          "Peace at any price avoids the conflict, and the fear of looking like the bad one stays unexamined in the Shadow. Meanwhile he learns that volume buys chocolate.",
      },
      {
        label: "Kneel down and name the feeling",
        line: "“You really wanted that. You're so angry.” He sobs into your shoulder. The answer is still no.",
        deltas: { man: { self: 6, soul: 4, persona: -3 }, woman: { self: 7, soul: 2, persona: -3 } },
        insight: {
          man: "A related Anima in action: you meet the feeling instead of managing the image. Warm and steady at once, the Self holds both the no and the child.",
          woman:
            "The positive Animus keeps the no steady, and warmth gives it a heart. Holding the line and the child at the same time is the Self at work.",
        },
      },
      {
        label: "Shout louder than him",
        line: "Now there are two people having a tantrum.",
        deltas: { shadow: 8, self: -2 },
        insight:
          "His storm wakes up yours: the unlived anger of a child who once wasn't allowed to scream. Shadow answers Shadow.",
      },
    ],
    quote: {
      text: "If there is anything that we wish to change in the child, we should first examine it and see whether it is not something that could better be changed in ourselves.",
      source: "C. G. Jung, The Development of Personality",
    },
  },
  {
    id: "empty-saturday",
    kind: "situation",
    place: "Your flat · Saturday 10:00",
    title: "The Empty Saturday",
    practice: "solitude",
    prompt:
      "Your plans fell through. No work, no obligations, nobody expecting you. A whole empty day stretches out ahead, and it feels strangely uncomfortable.",
    choices: [
      {
        label: "Fill it immediately",
        line: "By 10:05: a series, three group chats and the fridge.",
        deltas: { shadow: 4, persona: 2, self: -3 },
        insight:
          "Busyness as an escape route. Silence is where the unlived parts of you start to speak, so the noise goes up to keep them quiet.",
      },
      {
        label: "Message everyone until someone's free",
        line: "“Anyone around today? Anyone??”",
        deltas: { persona: 5, self: -2 },
        insight:
          "Without an audience the Persona has nothing to do, and that can feel like not existing. Fear of being alone is often fear of meeting yourself.",
      },
      {
        label: "A long walk, no phone",
        line: "Three hours later you come back with a thought you didn't know you had.",
        deltas: { self: 9, persona: -3 },
        insight:
          "The Self speaks quietly and needs room. An unplanned, unwitnessed day is a small version of Jung's tower at Bollingen.",
      },
      {
        label: "Dig out what you abandoned",
        line: "The guitar, the sketchbook, the half-written story you put away years ago.",
        deltas: { man: { soul: 6, self: 3 }, woman: { soul: 4, self: 4, shadow: -2 } },
        insight: {
          man: "Useless beauty: play for its own sake is how the Anima comes back to life. Nothing to achieve, only something to feel.",
          woman:
            "The positive Animus turns 'someday' into a first deed. Picking up what you abandoned frees energy that was stuck in the Shadow as unlived life.",
        },
      },
    ],
    quote: {
      text: "People will do anything, no matter how absurd, in order to avoid facing their own souls.",
      source: "C. G. Jung, Psychology and Alchemy",
    },
  },
  {
    id: "grey-hair",
    kind: "situation",
    place: "Bathroom mirror · 07:30",
    title: "The First Grey Hair",
    practice: "solitude",
    prompt: "Brushing your teeth, you see it: a grey hair. Then a second one. Next month you turn forty.",
    choices: [
      {
        label: "Pull it out, tell no one",
        line: "Then you order an expensive anti-ageing cream.",
        deltas: { persona: 6, shadow: 3 },
        insight:
          "Clinging to the youthful Persona. The mask that fit at twenty-five starts to pinch, and everything it can't admit, like the fear of ageing and of time running out, goes into the Shadow.",
      },
      {
        label: "Panic-buy a motorbike",
        line: "By lunchtime you've booked a skydive too.",
        deltas: { shadow: 6, persona: 2, self: -2 },
        insight:
          "Enantiodromia again: a cautious life flips into its opposite. The unlived life demands its due, and when it isn't met consciously, it arrives as a midlife crisis.",
      },
      {
        label: "Ask what the second half is for",
        line: "In your journal: “What did I postpone? What matters now?”",
        deltas: { self: 9, shadow: -3 },
        insight:
          "Jung saw midlife as a turning point. The first half of life builds an ego and a place in the world; the second turns toward meaning and wholeness. The question itself is the start of individuation.",
      },
      {
        label: "“Hello, silver.”",
        line: "You leave it. It looks rather distinguished.",
        deltas: { self: 4, persona: -4 },
        insight:
          "You let the mask age with you. A Persona that can change along with your life stays a tool instead of becoming a cage.",
      },
    ],
    quote: {
      text: "We cannot live the afternoon of life according to the programme of life's morning; for what was great in the morning will be little at evening, and what in the morning was true will at evening have become a lie.",
      source: "C. G. Jung, The Stages of Life",
    },
  },
  {
    id: "group-chat",
    kind: "situation",
    place: "Group chat · 22:50",
    title: "The Group Chat",
    practice: "projection-log",
    prompt:
      "Your friends' group chat is roasting Luka, who isn't in it: his new haircut, his new girlfriend, his new 'spiritual phase'. The jokes are getting meaner, and they're funny.",
    choices: [
      {
        label: "Add the meanest joke yet",
        line: "It gets the most 😂. You feel great, for about a minute.",
        deltas: { shadow: 9, persona: 2 },
        insight:
          "The group Shadow. A crowd lets everyone's darkness out at once and points it at a scapegoat. Jung distrusted the mass for exactly this reason: in a crowd, each person's insight and responsibility sink.",
      },
      {
        label: "Send a 😂 and go quiet",
        line: "You laugh along without really laughing.",
        deltas: { persona: 5, shadow: 3 },
        insight:
          "The mask of belonging: you join in without joining. The discomfort you don't voice doesn't vanish. It sinks.",
      },
      {
        label: "“Okay, enough. Leave him alone.”",
        line: "A pause. Then someone types: “fair.”",
        deltas: { self: 8, persona: -3, shadow: -3 },
        insight:
          "Stepping out of the group Shadow costs your mask a little popularity. It wins back something bigger: the sense of being one person, not part of a pack.",
      },
      {
        label: "Notice what the jokes are about",
        line: "His 'spiritual phase'. Secretly, you've been curious about meditation for a year.",
        deltas: { self: 6, shadow: -7 },
        insight:
          "Withdrawing a projection. What a group mocks hardest often holds what its members secretly want or fear. The laughter was guarding a door.",
      },
    ],
    quote: {
      text: "Knowing your own darkness is the best method for dealing with the darknesses of other people.",
      source: "C. G. Jung, Letters",
    },
  },
  {
    id: "fork",
    kind: "situation",
    place: "Kitchen table · 23:00",
    title: "Two Offers",
    practice: "hold-opposites",
    prompt:
      "Two job offers, and you have to answer by Friday. One is safe and well paid, the kind of job your parents can brag about. The other pays less and is exactly what you've dreamed of since you were twelve.",
    choices: [
      {
        label: "Take the safe one",
        line: "“It's the responsible choice,” you say, in your father's voice.",
        deltas: { persona: 7, shadow: 4 },
        insight:
          "Choosing the role others approve of. The dream doesn't die when you sign. It waits in the Shadow, and an unlived life has a way of coming back as restlessness.",
      },
      {
        label: "Take the dream one, out of spite",
        line: "Signed by midnight, mostly to prove everyone wrong.",
        deltas: { shadow: 5, self: -2, persona: -1 },
        insight:
          "Rebellion is as unfree as obedience: your parents are still making the choice, just upside down. The Shadow chose, not you.",
      },
      {
        label: "Let a spreadsheet decide",
        line: "Forty rows, weighted scores, no feelings allowed.",
        deltas: { man: { persona: 3, soul: -3, self: -1 }, woman: { soul: 5, self: -2 } },
        insight: {
          man: "Thinking with feeling locked out. Without the Anima, the 'rational' choice is missing the one number that matters most: what you love.",
          woman:
            "The Animus as a council of judges with a spreadsheet: criteria and 'shoulds' drown out your own voice. Logos is a gift, but here it's deciding for you.",
        },
      },
      {
        label: "Hold both, and wait",
        line: "You write out both lives in full and don't rush. By Thursday, something quieter than fear or pride is speaking.",
        deltas: { self: 9, shadow: -3 },
        insight:
          "Holding the tension of opposites. Jung called it the transcendent function: if you don't collapse the conflict too early, a third attitude appears that neither side could have produced alone.",
      },
    ],
    quote: {
      text: "All the greatest and most important problems of life are fundamentally insoluble. They can never be solved, but only outgrown.",
      source: "C. G. Jung, Commentary on The Secret of the Golden Flower",
    },
  },
  {
    id: "riddle-persona",
    kind: "riddle",
    place: "The Theatre · Riddle III",
    title: "The Thousand Faces",
    practice: "mask-inventory",
    speaker: "The Masked Actor",
    prompt:
      "“I have a thousand faces and none of my own. The crowd hands me to you, and you wear me every day. Wear me lightly and I serve you. Wear me too long and I wear you. What am I?”",
    choices: [
      {
        label: "Your reputation",
        line: "“What people think of me.”",
        deltas: { persona: 3 },
        insight: "Close. Reputation is what the mask earns. The riddle asks for the mask itself.",
      },
      {
        label: "The Persona",
        line: "“The mask: my role in the world.”",
        deltas: { self: 7, persona: -4 },
        insight:
          "Correct. In Latin, persona was the mask an actor wore on stage, and Jung borrowed the word for the face we show society. Knowing it's a mask is what lets you take it off.",
      },
      {
        label: "Your personality",
        line: "“That's just who I am.”",
        deltas: { persona: 6, self: -3 },
        insight:
          "That's exactly the trap the riddle describes: identification. When the mask feels like 'just who I am', it has started wearing you.",
      },
      {
        label: "Fake people",
        line: "“Other people. I'm never fake.”",
        deltas: { shadow: 5, persona: 3 },
        insight:
          "Contempt for masks is a mask too: the 'authentic one'. Everyone wears a Persona. The only question is whether you know you're wearing it.",
      },
    ],
    quote: {
      text: "Fundamentally the persona is nothing real: it is a compromise between individual and society as to what a man should appear to be.",
      source: "C. G. Jung, Two Essays on Analytical Psychology",
    },
  },
  {
    id: "riddle-soul",
    kind: "riddle",
    place: "The Well · Riddle IV",
    title: "The Stranger Within",
    practice: "dream-journal",
    speaker: "A voice from the well",
    prompt:
      "“I am the stranger who knows you best. In your dreams I wear the face of the other sex. Ignore me and I rule your moods. Befriend me and I lead you into the depths. Who am I?”",
    choices: [
      {
        label: "Your ex",
        line: "“My ex. Definitely my ex.”",
        deltas: { soul: 5, self: -1 },
        insight: {
          man: "Funny, and not entirely wrong: the women who fascinate you often carry the Anima for a while. But the stranger lives inside you. The ex only wore the costume.",
          woman:
            "Funny, and not entirely wrong: the men who fascinate you often carry the Animus for a while. But the stranger lives inside you. The ex only wore the costume.",
        },
      },
      {
        label: "Your conscience",
        line: "“The voice that tells me right from wrong.”",
        deltas: { soul: 2, persona: 2 },
        insight: {
          man: "Not quite. Conscience weighs right and wrong. The soul-image is wilder: it stirs your moods, fascinates you, and leads you into the depths.",
          woman:
            "Not quite, but a revealing guess: the negative Animus often disguises itself as conscience, all 'shoulds' and verdicts. The soul-image is bigger than that. Befriended, it leads you into the depths.",
        },
      },
      {
        label: "Just your imagination",
        line: "“It's only my imagination.”",
        deltas: { persona: 3, soul: -2 },
        insight:
          "'Only' is the giveaway. The rationalist mask dismisses inner figures as mere fantasy, and they go on acting from the dark, as moods and fascinations.",
      },
      {
        label: "Your soul-image",
        line: "“The other within me.”",
        deltas: { self: 6, soul: 4, shadow: -2 },
        insight: {
          man: "Correct. In a man she is the Anima: the feminine image that guides, tempts and colours his moods from within. Befriended, she becomes his bridge to the unconscious.",
          woman:
            "Correct. In a woman he is the Animus: the masculine image that judges, rescues and guides from within. Befriended, he becomes her bridge to the unconscious.",
        },
      },
    ],
  },
];

/** One playthrough ("a day") holds this many situations and riddles, drawn fresh from the pool each time. */
const SITUATIONS_PER_DAY = 10;
const RIDDLES_PER_DAY = 2;
export const DAY_LENGTH = SITUATIONS_PER_DAY + RIDDLES_PER_DAY;

function shuffle<T>(xs: T[]): T[] {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** A fresh day as indexes into SCENARIOS: random situations, with the riddles spread out and never first. */
export function drawDay(): number[] {
  const of = (kind: Scenario["kind"]) => shuffle(SCENARIOS.flatMap((s, i) => (s.kind === kind ? [i] : [])));
  const situations = of("situation").slice(0, SITUATIONS_PER_DAY);
  const riddles = of("riddle").slice(0, RIDDLES_PER_DAY);
  // One stretch of the day per riddle; each riddle lands somewhere after its stretch's first card.
  const per = Math.ceil(situations.length / riddles.length);
  return riddles.flatMap((r, j) => {
    const stretch = situations.slice(j * per, (j + 1) * per);
    stretch.splice(1 + Math.floor(Math.random() * stretch.length), 0, r);
    return stretch;
  });
}

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
