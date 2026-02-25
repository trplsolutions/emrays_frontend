"use client";

import * as React from "react";
import { Calendar, CloudUpload, FileText, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const LABEL_GRAY = "#A5A5A5";
const BTN = "#22A3C4";

type UploadRow = { id: string; name: string; sizeLabel: string };

function FieldRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  // ✅ Always label LEFT, field RIGHT (like image) — no stacking.
  return (
    <div className="grid items-center gap-4 [grid-template-columns:minmax(120px,160px)_minmax(0,260px)]">
      <div className="whitespace-nowrap text-right text-[13px]" style={{ color: LABEL_GRAY }}>
        {label}
      </div>
      <div className="w-full">{children}</div>
    </div>
  );
}

function SelectField({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "h-8 w-full appearance-none rounded-md border border-[#E5E7EB] bg-white px-3 pr-9",
          "text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-100"
        )}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>

      <ChevronDown
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2"
        style={{ color: LABEL_GRAY }}
      />
    </div>
  );
}

function InputField({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        "h-8 w-full rounded-md border border-[#E5E7EB] bg-white px-3",
        "text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-100"
      )}
    />
  );
}

function InputWithCalendar({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "h-8 w-full rounded-md border border-[#E5E7EB] bg-white px-3 pr-9",
          "text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-100"
        )}
      />
      <Calendar
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2"
        style={{ color: LABEL_GRAY }}
      />
    </div>
  );
}

function UploadArea() {
  return (
    <div className="rounded-xl border border-[#E5E7EB] bg-white px-4 py-8 text-center">
      <CloudUpload className="mx-auto mb-2 h-5 w-5" style={{ color: LABEL_GRAY }} />
      <div className="text-[11px] text-slate-700">
        Click to Upload or Drag &amp; Drop files here
      </div>
      <div className="mt-1 text-[10px]" style={{ color: LABEL_GRAY }}>
        Maximum file size 50 MB
      </div>
    </div>
  );
}

function FileRow({
  row,
  onRemove,
}: {
  row: UploadRow;
  onRemove: () => void;
}) {
  return (
    <div className="rounded-xl border border-[#E5E7EB] bg-white px-4 py-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-md border border-[#E5E7EB]">
            <FileText className="h-4 w-4" style={{ color: LABEL_GRAY }} />
          </div>
          <div>
            <div className="text-xs text-slate-800">{row.name}</div>
            <div className="text-[10px]" style={{ color: LABEL_GRAY }}>
              {row.sizeLabel}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onRemove}
          className="rounded-md p-1 hover:bg-slate-50"
          aria-label="Remove file"
          style={{ color: LABEL_GRAY }}
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-3 h-1.5 w-full rounded-full bg-slate-200">
        <div className="h-1.5 w-full rounded-full bg-slate-700" />
      </div>
    </div>
  );
}

function OutlineActionButton({ children }: { children: React.ReactNode }) {
  // outline by default, teal on hover (requested BTN color)
  return (
    <button
      type="button"
      className={cn(
        "h-9 rounded-md border px-6 text-xs font-medium transition",
        "hover:text-white"
      )}
      style={{ borderColor: BTN, color: BTN }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.backgroundColor = BTN;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
      }}
    >
      {children}
    </button>
  );
}

function StatsCard() {
  return (
    <div className="mt-6 rounded-2xl border border-[#E5E7EB] bg-white">
      <div className="px-6 py-4 text-center text-xs font-medium text-slate-600">
        Stock Movement Tracking
      </div>

      <div className="px-6 pb-5">
        <div className="mx-auto flex max-w-[820px] flex-wrap items-center justify-center gap-x-16 gap-y-6">
          {[
            { value: "12", label: "Ordered" },
            { value: "15", label: "In-Transit" },
            { value: "50", label: "Available" },
            { value: "8", label: "Reserved" },
          ].map((m) => (
            <div key={m.label} className="flex items-center gap-2">
              <div className="text-5xl font-semibold text-slate-600">{m.value}</div>
              <div className="text-sm" style={{ color: LABEL_GRAY }}>
                {m.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        className="border-t border-[#E5E7EB] px-6 py-3 text-center text-[11px]"
        style={{ color: LABEL_GRAY }}
      >
        Stock levels updated based on sales orders
      </div>
    </div>
  );
}

export default function StockInwardOutwardTransactions() {
  const products = ["Exemplar Widget", "Premium Widget", "Standard Widget"];
  const suppliers = ["Global Supplies", "Alpha Traders", "Sunrise Vendors"];
  const customers = ["Horizon Enterprises", "BlueSky Retail", "Nova Stores"];

  // inward
  const [inProduct, setInProduct] = React.useState(products[0]);
  const [inQty, setInQty] = React.useState("500");
  const [inSupplier, setInSupplier] = React.useState(suppliers[0]);
  const [inGrn, setInGrn] = React.useState("GRN-2026-003");
  const [inDate, setInDate] = React.useState("04-18-2026");
  const [inBatch, setInBatch] = React.useState("Batch-12345");
  const [inFiles, setInFiles] = React.useState<UploadRow[]>([
    { id: "1", name: "Proof_of_Delivery.pdf", sizeLabel: "20 MB" },
    { id: "2", name: "Packing_list.xlsx", sizeLabel: "20 MB" },
  ]);

  // outward
  const [outProduct, setOutProduct] = React.useState(products[0]);
  const [outQty, setOutQty] = React.useState("300");
  const [outCustomer, setOutCustomer] = React.useState(customers[0]);
  const [outDn, setOutDn] = React.useState("DN-1506");
  const [outDate, setOutDate] = React.useState("so-2026-078");
  const [outSoLink, setOutSoLink] = React.useState("Link");
  const [outFiles, setOutFiles] = React.useState<UploadRow[]>([
    { id: "3", name: "Proof_of_Delivery.pdf", sizeLabel: "20 MB" },
    { id: "4", name: "Packing_list.xlsx", sizeLabel: "20 MB" },
  ]);

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-[1050px] px-4 py-8 sm:px-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-semibold text-slate-900">
            Stock Inward &amp; Outward{" "}
            <span className="font-medium text-slate-400">Transactions</span>
          </h1>

          <div className="inline-flex items-center gap-2 rounded-full border border-[#D1D5DB] bg-white px-4 py-2 text-xs text-slate-700">
            <Calendar className="h-4 w-4" style={{ color: LABEL_GRAY }} />
            <span>Dec 23, 2024 - Dec 30, 2023</span>
          </div>
        </div>

        <StatsCard />

        {/* Two Forms */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* Inward */}
          <div className="rounded-2xl border border-[#E5E7EB] bg-white">
            <div className="p-6 sm:p-8">
              <div className="mb-6 text-center text-base font-semibold text-slate-900">
                Stock Inward
              </div>

              <div className="mx-auto w-full max-w-[520px] space-y-4">
                <FieldRow label="Product Name">
                  <SelectField value={inProduct} onChange={setInProduct} options={products} />
                </FieldRow>

                <FieldRow label="Quantity Received">
                  <InputField value={inQty} onChange={setInQty} />
                </FieldRow>

                <FieldRow label="Supplier">
                  <SelectField value={inSupplier} onChange={setInSupplier} options={suppliers} />
                </FieldRow>

                <FieldRow label="GRN Number">
                  <InputWithCalendar value={inGrn} onChange={setInGrn} />
                </FieldRow>

                <FieldRow label="Date Received">
                  <InputWithCalendar value={inDate} onChange={setInDate} />
                </FieldRow>

                <FieldRow label="Batch Number">
                  <InputField value={inBatch} onChange={setInBatch} />
                </FieldRow>

                <div className="pt-2">
                  <UploadArea />
                </div>

                <div className="space-y-4 pt-4">
                  {inFiles.map((f) => (
                    <FileRow
                      key={f.id}
                      row={f}
                      onRemove={() => setInFiles((prev) => prev.filter((x) => x.id !== f.id))}
                    />
                  ))}
                </div>

                <div className="pt-6 text-center">
                  <OutlineActionButton>Record Inward Stock</OutlineActionButton>
                </div>
              </div>
            </div>
          </div>

          {/* Outward */}
          <div className="rounded-2xl border border-[#E5E7EB] bg-white">
            <div className="p-6 sm:p-8">
              <div className="mb-6 text-center text-base font-semibold text-slate-900">
                Stock Outward
              </div>

              <div className="mx-auto w-full max-w-[520px] space-y-4">
                <FieldRow label="Product Name">
                  <SelectField value={outProduct} onChange={setOutProduct} options={products} />
                </FieldRow>

                <FieldRow label="Quantity Dispatched">
                  <InputField value={outQty} onChange={setOutQty} />
                </FieldRow>

                <FieldRow label="Customer">
                  <SelectField value={outCustomer} onChange={setOutCustomer} options={customers} />
                </FieldRow>

                <FieldRow label="Delivery Note">
                  <InputWithCalendar value={outDn} onChange={setOutDn} />
                </FieldRow>

                <FieldRow label="Date Dispatched">
                  <div className="relative">
                    <input
                      value={outDate}
                      onChange={(e) => setOutDate(e.target.value)}
                      className={cn(
                        "h-8 w-full rounded-md border border-[#E5E7EB] bg-white px-3 pr-[70px]",
                        "text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-100"
                      )}
                    />
                    <button
                      type="button"
                      className="absolute right-1 top-1/2 flex h-6 -translate-y-1/2 items-center gap-1 rounded-md border border-[#E5E7EB] bg-white px-3 text-[10px] text-slate-600"
                    >
                      View <ChevronDown className="h-3 w-3" />
                    </button>
                  </div>
                </FieldRow>

                <FieldRow label="Sales Order Link">
                  <InputField value={outSoLink} onChange={setOutSoLink} />
                </FieldRow>

                <div className="pt-2">
                  <UploadArea />
                </div>

                <div className="space-y-4 pt-4">
                  {outFiles.map((f) => (
                    <FileRow
                      key={f.id}
                      row={f}
                      onRemove={() =>
                        setOutFiles((prev) => prev.filter((x) => x.id !== f.id))
                      }
                    />
                  ))}
                </div>

                <div className="pt-6 text-center">
                  <OutlineActionButton>Record Outward Stock</OutlineActionButton>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="h-8" />
      </div>
    </div>
  );
}