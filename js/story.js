const STORY_TIMING = {
  fadeIn: 900,
  fadeOut: 900,
  readingPerChar: 80,
  minReading: 3500,
  maxReading: 7000,
  chapterPause: 1200,
  titleHold: 2500,
  interactionDelay: 5000,
  interactionFade: 800,
  transitionBlurIn: 800,
  transitionBlurOut: 600,
  finalHoldShort: 3000,
  finalHoldMedium: 3500,
  finalHoldLong: 5000,
  introLinePause: 600,
  breakPause: 500
};

const STORY_CONFIG = {
  title: "I Mean...",
  subtitle: "A little story about us.",
  totalChapters: 7,

  music: {
    tracks: [
      { src: "assets/audio/better-days.mp3", name: "Better Days" },
      { src: "assets/audio/Apocalypse - Cigarettes After Sex.mp3", name: "Apocalypse" },
      { src: "assets/audio/here-without-you.mp3", name: "Here Without You" },
      { src: "assets/audio/Ravyn Lenae - Love Me Not (Lyrics).mp3", name: "Love Me Not" }
    ]
  },

  intro: {
    lines: [
      "Some stories are planned.",
      "Ours wasn't.",
      "This isn't just a website.",
      "It's a little story about us."
    ],
    musicPrompt: "Some stories sound better with music.",
    musicButton: "ENABLE SOUND"
  },

  chapters: {
    chapter01: {
      number: 1,
      title: "A Random Conversation",
      scenes: [
        { type: "text", lines: ["Two months ago..."] },
        { type: "text", lines: ["Two people who didn\u2019t know each other..."] },
        { type: "text", lines: ["met on Discord."] },
        { type: "text", lines: ["Had a really good conversation.", "Religion.", "Different thoughts."] },
        { type: "text", lines: ["We said we\u2019d talk again.", "And we actually did."] },
        { type: "text", lines: ["But I don\u2019t think either of us knew what came next."] },
        { type: "title", text: "BLAZING", style: "game-title" },
        { type: "text", lines: ["You were the one who asked me to play."] },
        { type: "text", lines: ["One game.", "One more night.", "Another conversation.", "Another night."] },
        { type: "text", lines: ["Until \u2018another night\u2019 became our nights."] },
        { type: "text", lines: ["And somehow...", "those became my favorite hours of the day."] },
        { type: "text", lines: ["I didn\u2019t know you yet.", "But I wanted to."] }
      ]
    },

    chapter02: {
      number: 2,
      title: "The Nights",
      scenes: [
        { type: "text", lines: ["It started with one night."] },
        { type: "text", lines: ["Then somehow, one night became many."] },
        { type: "timeProgression" },
        { type: "text", lines: ["We would start talking...", "...and suddenly hours were gone."] },
        { type: "text", lines: ["And I never really minded."] },
        { type: "text", lines: ["The way you talked.", "The jokes you made.", "The random things we\u2019d talk about.", "The little moments I\u2019d probably forget...", "...but somehow remember."] },
        { type: "text", lines: ["At some point, I noticed something.", "I wasn\u2019t just waiting for the night anymore.", "I was waiting for you."] },
        { type: "memoryChoice", prompt: "Which memory should we revisit?", options: [
          { id: "games", label: "THE GAMES", memory: "Those hours that felt like minutes." },
          { id: "latenights", label: "THE LATE NIGHTS", memory: "When the world got quiet and it was just us." },
          { id: "conversations", label: "THE CONVERSATIONS", memory: "The kind where you forget what time it is." },
          { id: "random", label: "THE RANDOM MOMENTS", memory: "The ones that meant something without trying to." }
        ]},
        { type: "text", lines: ["I don\u2019t remember the exact moment it happened.", "There wasn\u2019t a big moment.", "It was just...", "little by little.", "You became someone I wanted around."] }
      ]
    },

    chapter03: {
      number: 3,
      title: "I Mean...",
      scenes: [
        { type: "text", lines: ["Every story has its serious moments.", "Ours has something else.", "A lot of nonsense."] },
        { type: "text", lines: ["And somehow... I wouldn\u2019t change it."] },
        { type: "multiJoke", jokes: [
          { word: "GAY", context: "Remember when... you\u2019d say it just to mess with me." },
          { word: "LESBIANA", context: "Because apparently we needed another one." }
        ]},
        { type: "text", lines: ["Some jokes don\u2019t make sense to anyone else.", "And that\u2019s exactly why they\u2019re ours."] },
        { type: "phrase", word: "A777 3lik" },
        { type: "phrase", word: "I mean..." },
        { type: "text", lines: ["ayeh ayeh... hadik rah frasi LOL."] },
        { type: "bubbles", words: ["i mean...", "i mean...", "i mean..."] },
        { type: "text", lines: ["Somehow, even correcting ourselves became part of our language."] },
        { type: "text", lines: ["We have our own little language."] },
        { type: "interactiveWords", words: ["i mean...", "gay", "lesbiana"] },
        { type: "text", lines: ["But it\u2019s not really the words I remember.", "It\u2019s the way you said them.", "The way you talked to me.", "The little jokes.", "The little things you probably didn\u2019t even notice.", "That\u2019s what I remember."] },
        { type: "text", lines: ["Funny how something can start as a joke...", "...and slowly become something you don\u2019t want to lose."] }
      ]
    },

    chapter04: {
      number: 4,
      title: "What I Fell For",
      scenes: [
        { type: "text", lines: ["You might think I fell for one thing about you.", "But honestly...", "It wasn\u2019t one thing."] },
        { type: "fragments", words: ["The way you think.", "The way you talk.", "The way you see things.", "The way you joke.", "The way you make ordinary conversations interesting."] },
        { type: "text", lines: ["The first thing that really caught my attention...", "...was your mind.", "I liked the way you think.", "The way you see things from your own perspective.", "The way you can make me want to keep a conversation going.", "I wanted to know more."] },
        { type: "timeline", milestones: [
          { day: "DAY 1", text: "A random conversation about religion." },
          { day: "WEEK 1", text: "Starting to look forward to your messages." },
          { day: "WEEK 2", text: "Realizing our conversations had no ending." },
          { day: "WEEK 4", text: "Knowing this was becoming something more." },
          { day: "MONTH 2", text: "Not imagining my days without you in them." }
        ]},
        { type: "text", lines: ["And the more I knew...", "I wasn\u2019t looking for this.", "I wasn\u2019t expecting someone I met on Discord...", "...to become someone I\u2019d think about after we stopped talking.", "But you did."] },
        { type: "text", lines: ["There wasn\u2019t one moment where everything changed.", "It happened quietly.", "A little bit at a time.", "Until you mattered."] },
        { type: "cyclingWords", question: "What did I fall for?", words: ["Your mind", "Your personality", "Your humor", "The way you talk", "The little things"], final: "You." },
        { type: "text", lines: ["That\u2019s probably the simplest answer."] },
        { type: "text", lines: ["I mean...", "there\u2019s still a lot I haven\u2019t told you."] }
      ]
    },

    chapter05: {
      number: 5,
      title: "Two Months",
      scenes: [
        { type: "counter", from: 0, to: 60, text: "Two months." },
        { type: "text", lines: ["That\u2019s all it\u2019s been."] },
        { type: "text", lines: ["Countless conversations.", "Late nights.", "Games.", "Jokes.", "Things we never planned to talk about.", "Things we probably talked about way too much.", "A lot of memories."] },
        { type: "text", lines: ["If someone asked me what my favorite part was...", "The games?", "No.", "The jokes?", "No.", "The conversations?", "No.", "The nights!!!"] },
        { type: "text", lines: ["Because somehow, you were always there."] },
        { type: "text", lines: ["Look how much can change in 60 days."] },
        { type: "interactiveQuestion", question: "Do you remember when it stopped feeling like just Discord?", options: ["I think I do.", "I don\u2019t know.", "Maybe it happened slowly."], response: "Maybe that\u2019s the point. Some things don\u2019t have a specific moment." },
        { type: "text", lines: ["There\u2019s only one thing missing.", "Being in the same place."] },
        { type: "text", lines: ["Because there are some memories you can\u2019t make through a screen."] }
      ]
    },

    chapter06: {
      number: 6,
      title: "Distance",
      scenes: [
        { type: "text", lines: ["There\u2019s just one problem with our story."] },
        { type: "title", text: "DISTANCE", style: "distance-title" },
        { type: "text", lines: ["200 km can feel like a lot...", "...when the person you\u2019d rather have next to you isn\u2019t there."] },
        { type: "text", lines: ["We\u2019ve shared nights.", "We\u2019ve shared conversations.", "We\u2019ve shared parts of our lives.", "But not the same room."] },
        { type: "text", lines: ["But there\u2019s something I keep imagining.", "The first time we finally meet."] },
        { type: "text", lines: ["No screen between us."] },
        { type: "text", lines: ["I don\u2019t just want to meet you once.", "I want us to have places we can say...", "Remember when we were here?"] },
        { type: "text", lines: ["Nothing perfect.", "Just somewhere that feels like home."] },
        { type: "text", lines: ["I don\u2019t know exactly what the future looks like.", "I don\u2019t know where we\u2019ll be.", "I don\u2019t know how many countries we\u2019ll discover.", "But I\u2019d like to find out."] },
        { type: "text", lines: ["Distance is just where the story is right now.", "Not where it has to end."] }
      ]
    },

    chapter07: {
      number: 7,
      title: "Someday",
      scenes: [
        { type: "title", text: "SOMEDAY", style: "someday-title" },
        { type: "text", lines: ["Maybe we don\u2019t know exactly what the future looks like.", "So let\u2019s imagine it."] },
        { type: "interactiveChoice", question: "If we could disappear somewhere together...", options: ["Somewhere by the sea", "Somewhere in the mountains", "A city we\u2019ve never seen", "Somewhere under a sky full of stars"], responses: {
          "Somewhere by the sea": { scene: "sea", text: "We\u2019re there. The sound of waves. The salt in the air. Just us." },
          "Somewhere in the mountains": { scene: "mountains", text: "We\u2019re there. Quiet. Fresh air. Nothing but the sky above us." },
          "A city we\u2019ve never seen": { scene: "city", text: "We\u2019re there. New streets. New food. New memories waiting to happen." },
          "Somewhere under a sky full of stars": { scene: "stars", text: "We\u2019re there. Just us and a million stars." }
        }},
        { type: "text", lines: ["Okay... we\u2019re there.", "What\u2019s the first thing we do?"] },
        { type: "interactiveChoice", question: "", options: ["Try something we\u2019ve never done", "Find the best food", "Get lost somewhere and explore", "Take pictures we\u2019ll laugh at years later"], responses: {
          "Try something we\u2019ve never done": "And just like that... we\u2019re making a memory.",
          "Find the best food": "Finding the best food is always the first mission.",
          "Get lost somewhere and explore": "The best adventures start with no plan.",
          "Take pictures we\u2019ll laugh at years later": "Years from now, we\u2019ll look at those pictures and laugh."
        }},
        { type: "text", lines: ["And after all the places we visit...", "Maybe we\u2019d want a place of our own."] },
        { type: "homeScene" },
        { type: "timeLapse", stages: ["TODAY", "SOMEDAY", "YEARS LATER"] },
        { type: "text", lines: ["Imagine looking back at where this started.", "One random conversation.", "One game.", "A lot of nights.", "And somehow... all of this."] },
        { type: "text", lines: ["There are still so many places...", "...so many things...", "...so many nights...", "we haven\u2019t experienced yet."] }
      ]
    }
  },

  finalMessage: {
    lines: [
      { text: "I Mean...", style: "final-title" },
      { text: "", style: "break" },
      { text: "If you made it this far...", style: "normal" },
      { text: "then I guess you know a little bit more about what was going through my head while all of this was happening.", style: "normal" },
      { text: "", style: "break" },
      { text: "Two months.", style: "emphasis" },
      { text: "It doesn\u2019t sound like a very long time.", style: "normal" },
      { text: "And honestly, if someone told me two months ago that a random conversation on Discord would become this important to me, I probably wouldn\u2019t have believed them.", style: "normal" },
      { text: "", style: "break" },
      { text: "I\u2019m really glad that random conversation happened.", style: "normal" },
      { text: "I\u2019m glad you asked me to play that game.", style: "normal" },
      { text: "I\u2019m glad we kept talking.", style: "normal" },
      { text: "I\u2019m glad those nights became our nights.", style: "normal" },
      { text: "And most of all...", style: "normal" },
      { text: "I\u2019m glad I got to know you.", style: "emphasis" },
      { text: "", style: "break" },
      { text: "So if there is one thing I want you to take from this whole little story, it\u2019s this:", style: "normal" },
      { text: "", style: "break" },
      { text: "I didn\u2019t plan for any of this.", style: "normal" },
      { text: "I wasn\u2019t looking for it.", style: "normal" },
      { text: "It just happened.", style: "normal" },
      { text: "Little by little.", style: "normal" },
      { text: "Night by night.", style: "normal" },
      { text: "Conversation by conversation.", style: "normal" },
      { text: "Until somehow...", style: "normal" },
      { text: "you became one of the best parts of my days.", style: "emphasis" },
      { text: "", style: "break" },
      { text: "And yeah...", style: "normal" },
      { text: "", style: "break" },
      { text: "I mean...", style: "i-mean" },
      { text: "", style: "break" },
      { text: "I really, really love having you in my life. \u2764\uFE0F", style: "emphasis" },
      { text: "", style: "break" },
      { text: "---", style: "break" },
      { text: "", style: "break" },
      { text: "These chapters wasn\u2019t the beginning.", style: "normal" },
      { text: "This isn\u2019t the ending.", style: "normal" },
      { text: "", style: "break" },
      { text: "It\u2019s just our first chapters.", style: "emphasis" },
      { text: "", style: "break" },
      { text: "To be continued... mmuah i love you pookie", style: "to-be-continued" }
    ]
  },

  wordMemories: {
    "i mean...": "That little correction that became our thing.",
    "gay": "The joke that started it all.",
    "lesbiana": "Because we needed a sequel to that joke."
  }
};
