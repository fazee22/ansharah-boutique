import { SettingsTabs } from "@/components/admin/settings/settings-tabs";
import { WhatsAppSettingsForm } from "@/components/admin/settings/whatsapp-settings-form";

export default function AdminWhatsAppSettingsPage() {
  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <div>
        <h1 className="font-display text-display-sm font-light text-foreground">Settings</h1>
        <p className="text-body-sm text-muted-foreground">Everything about how the store presents itself.</p>
      </div>
      <SettingsTabs />
      <WhatsAppSettingsForm />
    </div>
  );
}
