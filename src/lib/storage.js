export const loadChat = () =>
  JSON.parse(localStorage.getItem("chat") || "[]");

export const saveChat = chat =>
  localStorage.setItem("chat", JSON.stringify(chat));
