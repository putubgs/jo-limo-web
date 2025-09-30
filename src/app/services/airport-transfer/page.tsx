import ServiceInfoPage from "@/components/ServiceInfoPage";
import { serviceInfoContent } from "@/data/serviceInfoContent";

export default function AirportTransfer() {
  return <ServiceInfoPage content={serviceInfoContent["airport-transfer"]} />;
}
