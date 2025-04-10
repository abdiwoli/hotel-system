import ClientComponent from "./ClientComponent";
import { headingText, imagesSection } from "./ServerComponent";

export default function Page() {
    return (
        <ClientComponent headingText={headingText} imagesSection={imagesSection} />
    );
}
