export const formatRp = (number: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);

export const formatNumberInput = (value: number | string | null | undefined) => {
  if (value === null || value === undefined || value === "") return "";

  const normalized = typeof value === "number" ? String(value) : String(value).replace(/\D/g, "");
  if (normalized === "") return "";

  const parsed = Number(normalized);
  if (!Number.isFinite(parsed)) return "";

  return new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: 0,
  }).format(parsed);
};

export const parseNumberInput = (value: string) => {
  const normalized = value.replace(/\D/g, "");
  return normalized === "" ? 0 : Number(normalized);
};

export const formatDate = (dateString: string) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const getLocalDate = () => {
  const d = new Date();
  return (
    d.getFullYear() +
    "-" +
    String(d.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(d.getDate()).padStart(2, "0")
  );
};
