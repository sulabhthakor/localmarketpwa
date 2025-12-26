import { redirect } from "next/navigation";

export default function BusinessRegisterPage() {
    // For now, redirect to the main register page. 
    // Ideally, we could pass a query param ?role=seller to pre-select it.
    // But let's just let them choose on the main page for simplicity 
    // or build a specific one later.
    redirect("/register");
}
