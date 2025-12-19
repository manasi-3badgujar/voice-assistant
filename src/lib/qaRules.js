export const QA_RULES = [
  {
    intent: "greeting",
    keywords: ["hello", "hi", "hey", "good morning", "good evening"],
    response: "Hello! How can I assist you today?"
  },
  {
    intent: "introduction",
    keywords: ["who are you", "who r u", "your name", "what are you"],
    response: "I am your smart hotel voice assistant, here to help you with anything you need during your stay."
  },
  {
    intent: "thanks",
    keywords: ["thank you", "thanks", "thx", "appreciate it"],
    response: "You're welcome! Happy to help."
  },
  {
    intent: "food",
    keywords: ["food", "breakfast", "menu", "order", "lunch", "dinner", "meal"],
    response: "Our restaurant operates 24/7. You can order food using the in-room tablet or by calling extension 9."
  },
  {
    intent: "water",
    keywords: ["water", "bottle", "drinking water", "mineral water"],
    response: "Certainly. Housekeeping will deliver two bottles of drinking water to your room shortly."
  },
  {
    intent: "housekeeping",
    keywords: ["clean room", "housekeeping", "towel", "towels", "linen", "bedsheet", "cleaning"],
    response: "Housekeeping has been notified. Our staff will attend to your room within the next 10–15 minutes."
  },
  {
    intent: "wifi",
    keywords: ["wifi", "internet", "network"],
    response: "The WiFi password is: ROOM1234."
  },
  {
    intent: "pool",
    keywords: ["swimming pool", "pool", "swim"],
    response: "The swimming pool is open daily from 6:00 AM to 8:00 PM."
  },
  {
    intent: "gym",
    keywords: ["gym", "fitness", "workout", "exercise"],
    response: "Our gym is open 24 hours a day and can be accessed using your room card."
  },
  {
    intent: "checkout",
    keywords: ["check out", "checkout", "check-out", "departure"],
    response: "Standard checkout time is 11:00 AM. Late checkout may be requested based on availability."
  },
  {
    intent: "location",
    keywords: ["location", "address", "where are we", "hotel address"],
    response: "We are located at 12th Cross, MG Road, Bangalore."
  }
];
