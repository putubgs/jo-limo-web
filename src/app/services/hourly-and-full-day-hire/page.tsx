import ServiceInfoPage from "@/components/ServiceInfoPage";
import { serviceInfoContent } from "@/data/serviceInfoContent";

export default function HourlyAndFullDayHire() {
  return (
    <ServiceInfoPage content={serviceInfoContent["hourly-and-full-day-hire"]} />
  );
}
