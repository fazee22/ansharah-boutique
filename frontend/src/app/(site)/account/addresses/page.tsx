"use client";

import { useState } from "react";
import { Plus, Star, Pencil, Trash2, MapPin } from "lucide-react";
import { CustomerGuard } from "@/components/account/customer-guard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAccountAddresses,
  useCreateAddress,
  useUpdateAddress,
  useDeleteAddress,
  useSetDefaultAddress,
} from "@/hooks/account/use-account-addresses";
import type { AccountAddress, AddressFormValues } from "@/types/account/address";

const inputClass =
  "h-11 rounded-md border border-hairline bg-canvas px-3 text-body-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass";
const labelClass = "font-mono text-caption uppercase tracking-wide text-muted-foreground";

const emptyValues: AddressFormValues = {
  type: "shipping",
  label: "",
  fullName: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "Pakistan",
  isDefault: false,
};

function AddressFormDialog({
  open,
  onOpenChange,
  address,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  address?: AccountAddress;
}) {
  const [values, setValues] = useState<AddressFormValues>(
    address
      ? {
          type: address.type,
          label: address.label ?? "",
          fullName: address.fullName,
          phone: address.phone,
          line1: address.line1,
          line2: address.line2 ?? "",
          city: address.city,
          state: address.state ?? "",
          postalCode: address.postalCode ?? "",
          country: address.country,
          isDefault: address.isDefault,
        }
      : emptyValues,
  );
  const createAddress = useCreateAddress();
  const updateAddress = useUpdateAddress();
  const isSaving = createAddress.isPending || updateAddress.isPending;

  function handleSubmit() {
    const onSuccess = () => onOpenChange(false);
    if (address) {
      updateAddress.mutate({ id: address.id, values }, { onSuccess });
    } else {
      createAddress.mutate(values, { onSuccess });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent title={address ? "Edit Address" : "Add Address"} showHeader className="max-w-md">
        <div className="flex flex-col gap-4 p-6">
          <h2 className="font-display text-heading-md text-foreground">{address ? "Edit Address" : "Add Address"}</h2>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="addr-label" className={labelClass}>Label</label>
              <input id="addr-label" value={values.label} onChange={(e) => setValues({ ...values, label: e.target.value })} placeholder="Home" className={inputClass} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="addr-type" className={labelClass}>Type</label>
              <select id="addr-type" value={values.type} onChange={(e) => setValues({ ...values, type: e.target.value as "shipping" | "billing" })} className={inputClass}>
                <option value="shipping">Shipping</option>
                <option value="billing">Billing</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="addr-name" className={labelClass}>Full Name</label>
            <input id="addr-name" value={values.fullName} onChange={(e) => setValues({ ...values, fullName: e.target.value })} className={inputClass} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="addr-phone" className={labelClass}>Phone</label>
            <input id="addr-phone" value={values.phone} onChange={(e) => setValues({ ...values, phone: e.target.value })} className={inputClass} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="addr-line1" className={labelClass}>Address Line 1</label>
            <input id="addr-line1" value={values.line1} onChange={(e) => setValues({ ...values, line1: e.target.value })} className={inputClass} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="addr-line2" className={labelClass}>Address Line 2 (optional)</label>
            <input id="addr-line2" value={values.line2} onChange={(e) => setValues({ ...values, line2: e.target.value })} className={inputClass} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="addr-city" className={labelClass}>City</label>
              <input id="addr-city" value={values.city} onChange={(e) => setValues({ ...values, city: e.target.value })} className={inputClass} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="addr-postal" className={labelClass}>Postal Code</label>
              <input id="addr-postal" value={values.postalCode} onChange={(e) => setValues({ ...values, postalCode: e.target.value })} className={inputClass} />
            </div>
          </div>

          <label className="flex items-center gap-2.5 text-body-sm text-ink">
            <input type="checkbox" checked={values.isDefault} onChange={(e) => setValues({ ...values, isDefault: e.target.checked })} className="h-4 w-4 accent-brass" />
            Set as default address
          </label>

          <div className="mt-2 flex gap-3">
            <Button type="button" variant="primary" size="md" isLoading={isSaving} onClick={handleSubmit} className="flex-1">
              {address ? "Save Changes" : "Add Address"}
            </Button>
            <Button type="button" variant="outline" size="md" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function AddressesContent() {
  const { data: addresses, isLoading } = useAccountAddresses();
  const deleteAddress = useDeleteAddress();
  const setDefault = useSetDefaultAddress();
  const [dialogState, setDialogState] = useState<{ open: boolean; address?: AccountAddress }>({ open: false });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-display-sm font-light text-foreground">Addresses</h1>
          <p className="text-body-sm text-muted-foreground">Manage your saved shipping and billing addresses.</p>
        </div>
        <Button variant="primary" size="md" onClick={() => setDialogState({ open: true })}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add Address
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Array.from({ length: 2 }, (_, i) => (
            <Skeleton key={i} className="h-40 rounded-lg" />
          ))}
        </div>
      ) : addresses && addresses.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {addresses.map((address) => (
            <div key={address.id} className="flex flex-col gap-2 rounded-lg border border-hairline bg-porcelain p-5">
              <div className="flex items-start justify-between gap-2">
                <span className="flex items-center gap-1.5 text-body-sm text-ink">
                  {address.label || (address.type === "shipping" ? "Shipping" : "Billing")}
                  {address.isDefault ? <Star className="h-3.5 w-3.5 fill-brass-dark text-brass-dark" aria-hidden="true" /> : null}
                </span>
                <div className="flex gap-1">
                  <button type="button" aria-label="Edit address" onClick={() => setDialogState({ open: true, address })} className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-ink/5">
                    <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                  <button type="button" aria-label="Delete address" onClick={() => deleteAddress.mutate(address.id)} className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>
              <p className="text-body-sm text-ink">{address.fullName}</p>
              <p className="text-caption text-muted-foreground">{address.phone}</p>
              <p className="text-caption text-muted-foreground">
                {address.line1}{address.line2 ? `, ${address.line2}` : ""}, {address.city}
                {address.postalCode ? ` ${address.postalCode}` : ""}, {address.country}
              </p>
              {!address.isDefault ? (
                <button
                  type="button"
                  onClick={() => setDefault.mutate(address.id)}
                  className="mt-1 w-fit text-caption text-brass-dark hover:underline"
                >
                  Set as default
                </button>
              ) : null}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-hairline py-16 text-center text-muted-foreground">
          <MapPin className="h-8 w-8" aria-hidden="true" />
          <p className="text-body-sm">No saved addresses yet.</p>
        </div>
      )}

      <AddressFormDialog
        open={dialogState.open}
        onOpenChange={(open) => setDialogState((current) => ({ ...current, open }))}
        address={dialogState.address}
      />
    </div>
  );
}

export default function AddressesPage() {
  return (
    <CustomerGuard>
      <AddressesContent />
    </CustomerGuard>
  );
}
