import { getPage } from "@/content/profile";
import { SpanChart } from "../experience/span-chart";
import { Timeline } from "../experience/timeline";
import { Section } from "../ui/section";

const page = getPage("experience");

export function Experience() {
  return (
    <Section id="experience" index="03" title={page.label} aside={page.aside}>
      <SpanChart />
      <Timeline />
    </Section>
  );
}
