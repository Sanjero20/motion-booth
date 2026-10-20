import { SectionHeading } from "@/components/shared/SectionHeading";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQ_ITEMS } from "@/data/landing";

function FAQ() {
  return (
    <section
      id="faq"
      className="bg-card scroll-mt-16 border-t px-4 py-20 md:px-0 lg:py-28"
    >
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-6 lg:grid-cols-[1fr_1.4fr] lg:px-10">
        <SectionHeading
          eyebrow="FAQ"
          title="Good questions."
          body="Everything guests and hosts usually ask."
        />

        <Accordion className="w-full rounded-sm border-0">
          {FAQ_ITEMS.map((f, i) => (
            <AccordionItem
              key={f.q}
              value={`faq-${i}`}
              className="data-open:bg-transparent"
            >
              <AccordionTrigger>{f.q}</AccordionTrigger>
              <AccordionContent>{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

export default FAQ;
