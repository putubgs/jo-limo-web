import ServiceInfoPage from "@/components/ServiceInfoPage";
import { serviceInfoContent } from "@/data/serviceInfoContent";

export default function IntercityTransfer() {
  return (
    <ServiceInfoPage content={serviceInfoContent["city-to-city-transfer"]} />
  );
}
