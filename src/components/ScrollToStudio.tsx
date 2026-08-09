"use client";

export default function ScrollToStudio() {
  return (
    <a
      href="#studio"
      onClick={(e) => {
        e.preventDefault();
        document
          .getElementById("studio")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
        window.history.replaceState(null, "", window.location.pathname);
      }}
      className="border-2 border-black bg-[#fee101] px-6 py-3.5 text-sm font-bold text-black transition hover:-translate-y-0.5"
    >
      Make your pass
    </a>
  );
}
