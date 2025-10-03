import { v4 as uuidv4 } from "uuid";

export default function getOrCreateSessionId() {
  const cookies = document.cookie.split("; ").reduce((acc, curr) => {
    const [name, value] = curr.split("=");
    acc[name] = value;
    return acc;
  }, {});

  let sessionId = cookies["sessionId"];
  if (!sessionId) {
    sessionId = uuidv4();
    document.cookie = `sessionId=${sessionId}; path=/; max-age=${
      60 * 60 * 24 * 30
    };`; 
  }
  return sessionId;
}
