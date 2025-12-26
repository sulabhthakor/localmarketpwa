
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQPage() {
    return (
        <div className="container mx-auto py-12 px-4 max-w-3xl">
            <h1 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h1>

            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                    <AccordionTrigger>How do I track my order?</AccordionTrigger>
                    <AccordionContent>
                        You can track your order status in the "My Orders" section of your profile after logging in.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                    <AccordionTrigger>Do you offer same-day delivery?</AccordionTrigger>
                    <AccordionContent>
                        Yes, for orders placed before 2 PM within major Gujarat cities
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                    <AccordionTrigger>Can I become a seller?</AccordionTrigger>
                    <AccordionContent>
                        Absolutely! Click on "Business" in the menu and register your shop to start selling.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                    <AccordionTrigger>What payment methods are accepted?</AccordionTrigger>
                    <AccordionContent>
                        We accept UPI, Credit/Debit Cards, and Cash on Delivery (COD).
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}
