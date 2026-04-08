export const pcNavLinks = [
    { name: "HOME", href: "#home" },
    { name: "YOUR CHALLENGES", href: "#challenges" },
    { name: "KEY PROJECT", href: "#project" },
    { name: "ABOUT", href: "#about" },
    { name: "FAQ", href: "#faq" },
    { name: "CONTACT", href: "#contact" },
] as const;

export type PcNavName = (typeof pcNavLinks)[number]["name"];

export const pcPrimaryCtaClassName =
    "inline-flex h-[34px] min-w-[162px] items-center justify-center rounded-[10px] bg-white px-7 text-[16px] font-bold text-[#151515] transition-colors hover:bg-white/90";
