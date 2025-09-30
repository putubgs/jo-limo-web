import SimpleServicePage from "@/components/SimpleServicePage";
import { simpleServiceContent } from "@/data/simpleServiceContent";

export default function TravelPartner() {
  return (
    <SimpleServicePage
      content={simpleServiceContent["travel-partner-concierge-assistant"]}
    />
  );
}
