import type { ReactNode } from "react";
import type { Gender } from "./archetypes";
import type { Lang } from "./locale";

// Interface strings. *word* renders as emphasis via rich().

const en = {
  nav: {
    logoSub: "hermetic vessel",
    archetypes: "Archetypes",
    experience: "Experience",
    practices: "Practices",
    soundOn: "sound on",
    soundOff: "enable sound",
    menu: "Main",
  },
  footer: {
    about: "VAS · an educational game on C. G. Jung's analytical psychology",
    care: "Not therapy. If you are struggling, please talk to a professional.",
  },
  hero: {
    kicker: "Analytical psychology · a playable lesson",
    title1: "Four waters",
    title2: "live in you.",
    sub: "Persona, Shadow, Anima or Animus, and Self: the four great archetypes C. G. Jung found in every human psyche. Here they become fluids inside a glass body. Every choice you make (a joke, a craving, a riddle) changes how much of each one fills the vessel.",
    scroll: "scroll to descend",
  },
  waters: {
    label: "01 — The Waters",
    title1: "Meet what you are",
    title2: "made of.",
    integrated: "integrated",
    unconscious: "unconscious",
    soulText:
      "The soul-image, always of the other sex. A man carries the feminine Anima. A woman carries the masculine Animus. Each is the bridge to the unconscious.",
    animaInMan: "anima · in a man",
    animusInWoman: "animus · in a woman",
    soulDark:
      "Moods and fascinations (Anima), rigid verdicts and an inner critic (Animus), and in both, projection onto the other sex.",
    noteLabel: "A note on the model ·",
    note: "Jung never measured archetypes in percentages. This is a teaching metaphor. The vessel is stacked like the psyche seen from outside to inside: the *Persona* covers the face like a mask, the *Self* holds the heart, the soul-image lies deeper, and the *Shadow* sits underground. The Shadow can't be removed, only integrated, so “Shadow %” means the part that is still unconscious. The Persona is needed, but in measure: too thick and you become your role, too thin and you're exposed. Following Jung's classical model, a man's soul-image is the Anima and a woman's is the Animus.",
  },
  game: {
    label: "02 — The Experience",
    title1: "Live a day.",
    title2: "Watch the waters move.",
    insight: "insight",
    vesselLabel: "Glass vessel filled with four archetypes",
    dragHint: "drag to turn the vessel",
    loading: "filling the vessel…",
    beforeBegin: "Before you begin",
    choose1: "Choose your",
    choose2: "vessel.",
    genderIntro: (anima: ReactNode, animus: ReactNode): ReactNode => (
      <>
        In Jung&apos;s model the soul-image is contrasexual. A man carries a feminine inner figure, the {anima}. A
        woman carries a masculine one, the {animus}. Your choice decides which one flows in your vessel, next to the
        Persona, the Shadow and the Self.
      </>
    ),
    gender: { man: "Man", woman: "Woman" } as Record<Gender, string>,
    carries: { man: "carries the Anima", woman: "carries the Animus" } as Record<Gender, string>,
    situation: "Situation",
    riddle: "Riddle",
    predictToggle: "predict before reveal",
    youChose: "You chose",
    predict1: "Before the waters move,",
    predict2: "which archetype will shift the most?",
    skip: "skip prediction →",
    right: "✦ Your intuition was right.",
    notQuite: (names: string) => `✕ Not quite. ${names} moved most.`,
    and: " & ",
    next: "Continue",
    seeVessel: "See your vessel",
    again: "Begin again",
    toPractices: "Practices of balance →",
    ringTitle:
      "Individuation index: a strong Self, an integrated Shadow, a flexible Persona, and a soul-image you relate to without being possessed by it",
    individuation: "individuation",
    soulBoth: "Anima / Animus",
    afterDay: "Your vessel after one day",
    bandClear: "A clear vessel",
    bandUnderway: "The work is underway",
    bandNigredo: "The nigredo: the dark beginning",
    dominant: "Dominant water:",
    intuition: "archetype intuition",
    unintegrated: "unintegrated shadow",
    mask: "living through the mask",
    path: "Your path, step by step",
    readings: {
      persona:
        "The Persona fills most of your vessel. The mask is working hard, and quicksilver covers your face. You may be very good at being who others expect. Jung's warning was identification: forgetting there is a face behind the mask. Start with one true answer a day.",
      shadow:
        "The Shadow fills most of your vessel. That doesn't make you bad. It means a lot of energy is locked in what you haven't looked at yet. Start where the irritation is strongest: that's where the gold is buried.",
      soul: {
        man: "The Anima leads. You have a rich inner life of feeling, imagination and longing, but watch for moods that carry you away and fascinations you project onto women. Give your feelings a clear word, and live the inspiration yourself.",
        woman:
          "The Animus leads. You have conviction, drive and a sharp mind, but watch for the inner judge's verdicts and the heroes you project onto men. Let the Animus serve your own word and deed, not condemn you.",
      } as Record<Gender, string>,
      self: "The Self holds the center. You met opposites instead of splitting them: honesty with warmth, desire with awareness, the mask worn lightly. That is the taste of individuation.",
    },
  },
  practices: {
    label: "03 — Practices of balance",
    title1: "Face it.",
    title2: "Then live it.",
    sub: "Wear the mask lightly, make the Shadow conscious, and turn the Anima or Animus from a possession into a guide. Tick the practices you'd commit to this week and watch the vessel rebalance. Jung's word for this lifelong process is *individuation*.",
    all: "All",
    vessel: { man: "Man · Anima", woman: "Woman · Animus" } as Record<Gender, string>,
    chosen: "practices chosen",
  },
  faq: {
    label: "04 — Questions",
    title1: "What students",
    title2: "usually ask.",
    items: [
      {
        q: "What are Jung's four main archetypes?",
        a: "In Carl Gustav Jung's analytical psychology, four archetypes shape the personality most directly: the Persona (the social mask), the Shadow (what we repress or deny), the Anima or Animus (the inner image of the other sex, a bridge to the unconscious) and the Self (the center and totality of the psyche).",
      },
      {
        q: "What is the Shadow in Jungian psychology?",
        a: "The Shadow holds everything we don't want to see in ourselves: anger, envy and desire, but also talents we never lived. When we deny it, we project it onto other people. Jung's aim was not to get rid of the Shadow but to make it conscious and integrate it.",
      },
      {
        q: "What is the difference between the Anima and the Animus?",
        a: "In Jung's classical model, a man's soul-image is feminine (the Anima: feeling, Eros, imagination) and a woman's is masculine (the Animus: Logos, will, discernment). Both lead toward the unconscious. While they stay unconscious they show up as moods or rigid opinions and get projected onto the other sex.",
      },
      {
        q: "What is individuation?",
        a: "Individuation is Jung's word for the lifelong process of becoming whole: wearing the Persona lightly, integrating the Shadow, relating consciously to the Anima or Animus, and living more and more from the Self.",
      },
      {
        q: "Is this a psychological test?",
        a: "No. The percentages are a teaching metaphor, not a measurement. The game shows how archetypes work in everyday situations. It is not a diagnosis or therapy.",
      },
    ],
  },
};

export type UI = typeof en;

const ka: UI = {
  nav: {
    logoSub: "ჰერმეტული ჭურჭელი",
    archetypes: "არქეტიპები",
    experience: "თამაში",
    practices: "პრაქტიკები",
    soundOn: "ხმა ჩართულია",
    soundOff: "ხმის ჩართვა",
    menu: "მთავარი მენიუ",
  },
  footer: {
    about: "VAS · საგანმანათლებლო თამაში კ. გ. იუნგის ანალიტიკურ ფსიქოლოგიაზე",
    care: "ეს არ არის თერაპია. თუ გიჭირს, მიმართე სპეციალისტს.",
  },
  hero: {
    kicker: "ანალიტიკური ფსიქოლოგია · გაკვეთილი, რომელსაც თამაშობ",
    title1: "ოთხი წყალი",
    title2: "შენში ცოცხლობს.",
    sub: "პერსონა, ჩრდილი, ანიმა ან ანიმუსი და თვითობა: ოთხი დიდი არქეტიპი, რომლებიც კ. გ. იუნგმა ყველა ადამიანის ფსიქიკაში აღმოაჩინა. აქ ისინი მინის სხეულში ჩასხმულ სითხეებად იქცევიან. შენი ყოველი არჩევანი (ხუმრობა, სურვილი, გამოცანა) ცვლის, რამდენს იკავებს თითოეული ჭურჭელში.",
    scroll: "ჩაეშვი ქვემოთ",
  },
  waters: {
    label: "01 — წყლები",
    title1: "გაიცანი, რისგან",
    title2: "შედგები.",
    integrated: "ინტეგრირებული",
    unconscious: "არაცნობიერი",
    soulText:
      "სულის ხატი, ყოველთვის საპირისპირო სქესისა. მამაკაცი ქალურ ანიმას ატარებს, ქალი კი მამაკაცურ ანიმუსს. ორივე ხიდია არაცნობიერისკენ.",
    animaInMan: "ანიმა · მამაკაცში",
    animusInWoman: "ანიმუსი · ქალში",
    soulDark:
      "ცვალებადი გუნება და მოხიბვლა (ანიმა), ხისტი განაჩენები და შინაგანი კრიტიკოსი (ანიმუსი), ორივეში კი პროექცია საპირისპირო სქესზე.",
    noteLabel: "შენიშვნა მოდელზე ·",
    note: "იუნგს არქეტიპები პროცენტებით არასდროს გაუზომავს. ეს სასწავლო მეტაფორაა. ჭურჭელი ისეა დალაგებული, როგორც ფსიქიკა გარედან შიგნით: *პერსონა* სახეს ნიღაბივით ფარავს, *თვითობა* გულშია, სულის ხატი უფრო ღრმად დევს, *ჩრდილი* კი მიწისქვეშაა. ჩრდილის მოშორება შეუძლებელია, მხოლოდ მისი ინტეგრაციაა შესაძლებელი, ამიტომ „ჩრდილი %“ ნიშნავს იმ ნაწილს, რომელიც ჯერ კიდევ არაცნობიერია. პერსონა საჭიროა, მაგრამ ზომიერად: ზედმეტად სქელი და შენი როლი ხდები, ზედმეტად თხელი და დაუცველი რჩები. იუნგის კლასიკური მოდელის მიხედვით, მამაკაცის სულის ხატი ანიმაა, ქალისა კი ანიმუსი.",
  },
  game: {
    label: "02 — თამაში",
    title1: "გაატარე ერთი დღე.",
    title2: "უყურე, როგორ მოძრაობს წყალი.",
    insight: "ინტუიცია",
    vesselLabel: "მინის ჭურჭელი, ოთხი არქეტიპით სავსე",
    dragHint: "გადაათრიე ჭურჭლის მოსაბრუნებლად",
    loading: "ჭურჭელი ივსება…",
    beforeBegin: "სანამ დაიწყებ",
    choose1: "აირჩიე შენი",
    choose2: "ჭურჭელი.",
    genderIntro: (anima, animus) => (
      <>
        იუნგის მოდელში სულის ხატი საპირისპირო სქესისაა. მამაკაცი შინაგან ქალურ ფიგურას ატარებს, {anima}. ქალი კი
        მამაკაცურს, {animus}. შენი არჩევანი განსაზღვრავს, რომელი მათგანი იდინებს შენს ჭურჭელში პერსონის, ჩრდილისა და
        თვითობის გვერდით.
      </>
    ),
    gender: { man: "მამაკაცი", woman: "ქალი" },
    carries: { man: "ატარებს ანიმას", woman: "ატარებს ანიმუსს" },
    situation: "სიტუაცია",
    riddle: "გამოცანა",
    predictToggle: "გამოიცანი შედეგამდე",
    youChose: "შენ აირჩიე",
    predict1: "სანამ წყალი შეირხევა,",
    predict2: "რომელი არქეტიპი შეიცვლება ყველაზე მეტად?",
    skip: "გამოტოვება →",
    right: "✦ ინტუიციამ არ გიღალატა.",
    notQuite: (names) => `✕ ვერ გამოიცანი. ყველაზე მეტად შეიცვალა: ${names}.`,
    and: " და ",
    next: "გაგრძელება",
    seeVessel: "ნახე შენი ჭურჭელი",
    again: "თავიდან დაწყება",
    toPractices: "ბალანსის პრაქტიკები →",
    ringTitle:
      "ინდივიდუაციის ინდექსი: ძლიერი თვითობა, ინტეგრირებული ჩრდილი, მოქნილი პერსონა და სულის ხატთან ცნობიერი კავშირი, მისი შეპყრობის გარეშე",
    individuation: "ინდივიდუაცია",
    soulBoth: "ანიმა / ანიმუსი",
    afterDay: "შენი ჭურჭელი ერთი დღის შემდეგ",
    bandClear: "სუფთა ჭურჭელი",
    bandUnderway: "გზა დაწყებულია",
    bandNigredo: "ნიგრედო: ბნელი დასაწყისი",
    dominant: "გაბატონებული წყალი:",
    intuition: "არქეტიპული ინტუიცია",
    unintegrated: "არაინტეგრირებული ჩრდილი",
    mask: "ცხოვრება ნიღბით",
    path: "შენი გზა, ნაბიჯ-ნაბიჯ",
    readings: {
      persona:
        "შენს ჭურჭელს უმეტესად პერსონა ავსებს. ნიღაბი ბევრს შრომობს და ვერცხლისწყალი სახეს გიფარავს. შესაძლოა, ძალიან კარგად ახერხებ იყო ის, ვისაც სხვები ელიან. იუნგი გაიგივებაზე გვაფრთხილებდა: როცა გავიწყდება, რომ ნიღბის მიღმა სახეა. დაიწყე დღეში ერთი გულწრფელი პასუხით.",
      shadow:
        "შენს ჭურჭელს უმეტესად ჩრდილი ავსებს. ეს იმას არ ნიშნავს, რომ ცუდი ხარ. ეს ნიშნავს, რომ ბევრი ენერგია ჩაკეტილია იმაში, რასაც ჯერ არ შეხედე. დაიწყე იქიდან, სადაც გაღიზიანება ყველაზე ძლიერია: სწორედ იქ არის ჩაფლული ოქრო.",
      soul: {
        man: "წინ ანიმა მიდის. გაქვს მდიდარი შინაგანი სამყარო: გრძნობა, წარმოსახვა, ლტოლვა. მაგრამ ფრთხილად იყავი გუნებასთან, რომელიც თან მიგიტაცებს, და მოხიბვლასთან, რომელსაც ქალებზე აპროექტებ. შენს გრძნობას ზუსტი სიტყვა მიეცი, შთაგონებით კი თავად იცხოვრე.",
        woman:
          "წინ ანიმუსი მიდის. გაქვს რწმენა, ენერგია და მახვილი გონება. მაგრამ ფრთხილად იყავი შინაგანი მსაჯულის განაჩენებთან და გმირებთან, რომლებსაც მამაკაცებზე აპროექტებ. დაე, ანიმუსი შენს სიტყვასა და საქმეს ემსახურებოდეს და არა შენს გასამართლებას.",
      },
      self: "ცენტრს თვითობა იკავებს. დაპირისპირებულებს შეხვდი და არ გახლიჩე: გულწრფელობა სითბოსთან ერთად, სურვილი ცნობიერებასთან ერთად, ნიღაბი მსუბუქად ნატარები. ეს ინდივიდუაციის გემოა.",
    },
  },
  practices: {
    label: "03 — ბალანსის პრაქტიკები",
    title1: "შეხედე მას.",
    title2: "მერე იცხოვრე.",
    sub: "ნიღაბი მსუბუქად ატარე, ჩრდილი გააცნობიერე, ანიმა ან ანიმუსი კი შეპყრობილობიდან მეგზურად აქციე. მონიშნე პრაქტიკები, რომლებსაც ამ კვირაში შეასრულებ, და უყურე, როგორ ბალანსდება ჭურჭელი. მთელი ცხოვრების ამ პროცესს იუნგი *ინდივიდუაციას* უწოდებდა.",
    all: "ყველა",
    vessel: { man: "მამაკაცი · ანიმა", woman: "ქალი · ანიმუსი" },
    chosen: "არჩეული პრაქტიკა",
  },
  faq: {
    label: "04 — კითხვები",
    title1: "რას კითხულობენ",
    title2: "ყველაზე ხშირად.",
    items: [
      {
        q: "რომელია იუნგის ოთხი მთავარი არქეტიპი?",
        a: "კარლ გუსტავ იუნგის ანალიტიკურ ფსიქოლოგიაში პიროვნებას ყველაზე პირდაპირ ოთხი არქეტიპი აყალიბებს: პერსონა (სოციალური ნიღაბი), ჩრდილი (ის, რასაც ვდევნით ან უარვყოფთ), ანიმა ან ანიმუსი (საპირისპირო სქესის შინაგანი ხატი, ხიდი არაცნობიერისკენ) და თვითობა (ფსიქიკის ცენტრი და მთლიანობა).",
      },
      {
        q: "რა არის ჩრდილი იუნგიანურ ფსიქოლოგიაში?",
        a: "ჩრდილი მოიცავს ყველაფერს, რისი დანახვაც საკუთარ თავში არ გვინდა: ბრაზს, შურს და სურვილს, მაგრამ ასევე ნიჭს, რომლითაც არასდროს გვიცხოვრია. როცა მას უარვყოფთ, სხვა ადამიანებზე ვაპროექტებთ. იუნგის მიზანი ჩრდილის მოშორება კი არ იყო, არამედ მისი გაცნობიერება და ინტეგრაცია.",
      },
      {
        q: "რით განსხვავდება ანიმა ანიმუსისგან?",
        a: "იუნგის კლასიკურ მოდელში მამაკაცის სულის ხატი ქალურია (ანიმა: გრძნობა, ეროსი, წარმოსახვა), ქალისა კი მამაკაცური (ანიმუსი: ლოგოსი, ნება, გარჩევის უნარი). ორივე არაცნობიერისკენ მიგვიძღვება. სანამ არაცნობიერია, ცვალებად გუნებად ან ხისტ აზრებად ვლინდება და საპირისპირო სქესზე პროეცირდება.",
      },
      {
        q: "რა არის ინდივიდუაცია?",
        a: "ინდივიდუაცია იუნგის ტერმინია მთლიანობისკენ მიმავალი, მთელი ცხოვრების პროცესისთვის: პერსონის მსუბუქად ტარება, ჩრდილის ინტეგრაცია, ანიმასთან ან ანიმუსთან ცნობიერი ურთიერთობა და სულ უფრო მეტად თვითობიდან ცხოვრება.",
      },
      {
        q: "ეს ფსიქოლოგიური ტესტია?",
        a: "არა. პროცენტები სასწავლო მეტაფორაა და არა გაზომვა. თამაში აჩვენებს, როგორ მუშაობენ არქეტიპები ყოველდღიურ სიტუაციებში. ეს არ არის დიაგნოზი ან თერაპია.",
      },
    ],
  },
};

export const UI_TEXT: Record<Lang, UI> = { en, ka };
