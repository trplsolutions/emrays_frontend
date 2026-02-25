'use client';

import React, { useId, useMemo, useState } from 'react';
import { Calendar, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

const PRIMARY = '#22A3C4';
const UPLOAD_GRAY = '#A5A5A5';

function SectionTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 className={cn('text-base font-semibold text-gray-800', className)}>
      {children}
    </h2>
  );
}

function FieldRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] items-center gap-2 sm:gap-4">
      <label className="text-sm text-gray-500 sm:text-right">{label}</label>
      <div>{children}</div>
    </div>
  );
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        'w-full h-9 rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none',
        'placeholder:text-gray-400 focus:border-[color:var(--primary)] focus:ring-2 focus:ring-[color:var(--primary)]/15',
        props.className
      )}
      style={{ ['--primary' as any]: PRIMARY }}
    />
  );
}

function SelectInput(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        'w-full h-9 rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none',
        'focus:border-[color:var(--primary)] focus:ring-2 focus:ring-[color:var(--primary)]/15',
        props.className
      )}
      style={{ ['--primary' as any]: PRIMARY }}
    />
  );
}

function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        'w-full min-h-[92px] rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none',
        'placeholder:text-gray-400 focus:border-[color:var(--primary)] focus:ring-2 focus:ring-[color:var(--primary)]/15',
        props.className
      )}
      style={{ ['--primary' as any]: PRIMARY }}
    />
  );
}

function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="inline-flex items-center gap-2 text-sm text-gray-500">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-gray-300 text-[color:var(--primary)] focus:ring-[color:var(--primary)]/30"
        style={{ ['--primary' as any]: PRIMARY }}
      />
      {label}
    </label>
  );
}

function Segmented({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
}) {
  return (
    <div className="inline-flex rounded-md border border-gray-200 bg-white p-0.5">
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              'h-8 px-4 text-sm font-medium rounded-[6px] transition',
              active
                ? 'text-white'
                : 'text-gray-600 hover:bg-gray-50'
            )}
            style={active ? { backgroundColor: PRIMARY } : undefined}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export default function UserManagementPage() {
  const fileInputId = useId();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    department: '',
    password: '',
    confirmPassword: '',
    passwordExpDate: '',
    role: '',
    permAdd: false,
    permEdit: false,
    permDelete: false,
    status: 'active',
    lastLoginDate: '',
    auditSection: '',
  });

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const dateRangeText = useMemo(() => 'Dec 23, 2024 – Dec 30, 2023', []);

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900">
          User <span className="text-gray-400 font-normal">Creation</span>
        </h1>

        <button
          type="button"
          className={cn(
            'inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2',
            'text-sm text-gray-500 hover:bg-gray-50'
          )}
        >
          <Calendar className="h-4 w-4 text-gray-500" />
          {dateRangeText}
        </button>
      </div>

      {/* Card */}
      <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 p-6 sm:p-10 lg:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-14">
          {/* LEFT COLUMN */}
          <div className="space-y-10">
            {/* User Information */}
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">Image Upload</span>

                  <div className="relative">
                    <input
                      id={fileInputId}
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (!f) return;
                        const url = URL.createObjectURL(f);
                        setAvatarPreview(url);
                      }}
                    />
                    <label
                      htmlFor={fileInputId}
                      className={cn(
                        'grid place-items-center h-10 w-10 rounded-md cursor-pointer',
                        'shadow-sm border border-gray-200'
                      )}
                      style={{ backgroundColor: UPLOAD_GRAY }}
                      title="Upload"
                    >
                      <Upload className="h-5 w-5 text-white" />
                    </label>
                  </div>

                  {avatarPreview && (
                    <div className="hidden sm:flex items-center gap-2">
                      <img
                        src={avatarPreview}
                        alt="Preview"
                        className="h-10 w-10 rounded-md object-cover border border-gray-200"
                      />
                    </div>
                  )}
                </div>

                <SectionTitle className="ml-2">User Information</SectionTitle>
              </div>

              <div className="space-y-3">
                <FieldRow label="First Name">
                  <TextInput
                    value={form.firstName}
                    onChange={(e) => setForm((p) => ({ ...p, firstName: e.target.value }))}
                  />
                </FieldRow>

                <FieldRow label="Last Name">
                  <TextInput
                    value={form.lastName}
                    onChange={(e) => setForm((p) => ({ ...p, lastName: e.target.value }))}
                  />
                </FieldRow>

                <FieldRow label="Phone">
                  <TextInput
                    value={form.phone}
                    onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                  />
                </FieldRow>

                <FieldRow label="Email">
                  <TextInput
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  />
                </FieldRow>

                <FieldRow label="Department">
                  <TextInput
                    placeholder="Sales, Sourcing, Finance & etc"
                    value={form.department}
                    onChange={(e) => setForm((p) => ({ ...p, department: e.target.value }))}
                  />
                </FieldRow>
              </div>
            </div>

            {/* Password Setting */}
            <div>
              <SectionTitle className="text-center sm:text-left sm:pl-[140px] mb-5">
                Password Setting
              </SectionTitle>

              <div className="space-y-3">
                <FieldRow label="Set Password">
                  <TextInput
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                  />
                </FieldRow>

                <FieldRow label="Confirm Password">
                  <TextInput
                    type="password"
                    value={form.confirmPassword}
                    onChange={(e) => setForm((p) => ({ ...p, confirmPassword: e.target.value }))}
                  />
                </FieldRow>

                <FieldRow label="Password Exp Date">
                  <TextInput
                    type="date"
                    value={form.passwordExpDate}
                    onChange={(e) => setForm((p) => ({ ...p, passwordExpDate: e.target.value }))}
                  />
                </FieldRow>
              </div>

              {/* Buttons */}
              <div className="flex flex-wrap items-center gap-3 mt-6 sm:pl-[140px]">
                <button
                  type="button"
                  className="h-9 px-5 rounded-md text-sm font-semibold text-white shadow-sm"
                  style={{ backgroundColor: PRIMARY }}
                >
                  Save
                </button>

                <button
                  type="button"
                  className="h-9 px-5 rounded-md text-sm font-semibold border shadow-sm"
                  style={{ borderColor: PRIMARY, color: PRIMARY }}
                >
                  Submit
                </button>

                <button
                  type="button"
                  className="h-9 px-5 rounded-md text-sm font-semibold border border-gray-300 text-gray-700 shadow-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-10">
            {/* Role Assignment */}
            <div>
              <SectionTitle className="text-center sm:text-left mb-6">
                Role Assignment
              </SectionTitle>

              <div className="space-y-4">
                <FieldRow label="Select User Role">
                  <SelectInput
                    value={form.role}
                    onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
                  >
                    <option value=""> </option>
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="user">User</option>
                  </SelectInput>
                </FieldRow>

                <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] items-start gap-2 sm:gap-4">
                  <div className="text-sm text-gray-500 sm:text-right leading-tight">
                    <div>Permissions</div>
                    <div className="text-xs text-gray-400">Checkboxes</div>
                  </div>

                  <div className="flex flex-wrap items-center gap-10 pt-1">
                    <Checkbox
                      label="Add"
                      checked={form.permAdd}
                      onChange={(v) => setForm((p) => ({ ...p, permAdd: v }))}
                    />
                    <Checkbox
                      label="Edit"
                      checked={form.permEdit}
                      onChange={(v) => setForm((p) => ({ ...p, permEdit: v }))}
                    />
                    <Checkbox
                      label="Delete"
                      checked={form.permDelete}
                      onChange={(v) => setForm((p) => ({ ...p, permDelete: v }))}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Account Status */}
            <div>
              <SectionTitle className="text-center sm:text-left mb-6">
                Account Status
              </SectionTitle>

              <div className="space-y-4">
                <div className="sm:pl-[140px]">
                  <Segmented
                    value={form.status}
                    onChange={(v) => setForm((p) => ({ ...p, status: v }))}
                    options={[
                      { label: 'Active', value: 'active' },
                      { label: 'Inactive', value: 'inactive' },
                    ]}
                  />
                </div>

                <FieldRow label="Last Login Date">
                  <TextInput
                    type="date"
                    value={form.lastLoginDate}
                    onChange={(e) => setForm((p) => ({ ...p, lastLoginDate: e.target.value }))}
                  />
                </FieldRow>

                <FieldRow label="Audit Section">
                  <TextArea
                    value={form.auditSection}
                    onChange={(e) => setForm((p) => ({ ...p, auditSection: e.target.value }))}
                  />
                </FieldRow>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}