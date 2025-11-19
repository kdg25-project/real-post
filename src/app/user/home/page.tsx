import Header from "@/components/layouts/Header/Header";
import { Button } from "@/components/ui/button"

export default function HomePage() {
    return (
        <div>
            <Header searchArea={true} />
            <Button variant="outline">Button</Button>
        </div>
    );
}
