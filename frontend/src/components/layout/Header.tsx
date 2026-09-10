import { Container } from "@/components/ui/Container";
import { catalogService } from "@/services/catalog.service";
import { collectionService } from "@/services/collection.service";
import { AnnouncementBar } from "./AnnouncementBar";
import { DesktopNav } from "./DesktopNav";
import { HeaderActions } from "./HeaderActions";
import { Logo } from "./Logo";
import { MobileNav } from "./MobileNav";
import { MobileSearchBar } from "./MobileSearchBar";
import { buildNavData } from "./navigation";

/**
 * A Server Component. Navigation data is resolved on the server and handed to
 * the three small client islands that actually need interactivity, so opening
 * a menu never costs a client-side data fetch.
 */
export async function Header() {
  const [categories, occasions, collections] = await Promise.all([
    catalogService.getCategories(),
    catalogService.getOccasions(),
    collectionService.getFeaturedCollections(),
  ]);

  const nav = buildNavData(categories, occasions, collections);

  return (
    <>
      <AnnouncementBar />
      <header className="sticky top-0 z-80 border-b border-border bg-background/85 backdrop-blur-md">
        <Container>
          <div className="flex h-16 items-center gap-2 xl:h-[4.5rem] xl:gap-8">
            <MobileNav nav={nav} className="-ml-2 xl:hidden" />
            <Logo />
            <DesktopNav nav={nav} className="hidden xl:flex" />
            <HeaderActions className="-mr-2 ml-auto" />
          </div>
          <div className="pb-3 md:hidden">
            <MobileSearchBar />
          </div>
        </Container>
      </header>
    </>
  );
}
