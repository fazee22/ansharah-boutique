import { SlideManager } from "@/components/admin/content/slide-manager";
import { MarqueeSettingsForm } from "@/components/admin/content/marquee-settings-form";

export default function AdminAutoMovingSliderPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-display-sm font-light text-foreground">Auto Moving Slider</h1>
        <p className="text-body-sm text-muted-foreground">
        The homepage&apos;s continuously scrolling category strip — upload images, reorder by
          drag-and-drop, and tune exactly how it moves.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
        <SlideManager type="marquee" showEditorialFields={false} />
        <MarqueeSettingsForm />
      </div>
    </div>
  );
}
