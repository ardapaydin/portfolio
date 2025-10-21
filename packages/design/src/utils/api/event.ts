import axios from "axios";

export async function SendEvent(
  subdomain: string,
  event: "clickLink",
  data: any
) {
  if (!subdomain && subdomain == "design") return;
  return await axios.post("/data/event", {
    subdomain,
    event,
    data,
    timestamp: Date.now(),
  });
}
