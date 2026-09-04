import { pages } from "@/content/profile";
import { SpanChart } from "../experience/span-chart";
import { Timeline } from "../experience/timeline";
import { Section } from "../ui/section";

const page = pages[4];

export function Experience() {
  return (
    <Section id="experience" index="04" title={page.label} aside={page.aside}>
      <SpanChart />
      <Timeline />
    </Section>
  );
}
