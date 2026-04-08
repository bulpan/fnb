"use client";

import { fnbContactFields } from "@/app/fnb/shared/contactForm";
import { useFnbContactForm } from "@/app/fnb/shared/useFnbContactForm";
import SectionHeading from "./SectionHeading";

export default function FnbNewContact() {
  const placeholderMap = Object.fromEntries(
    fnbContactFields.map((field) => [field.name, field.pcPlaceholder]),
  ) as Record<(typeof fnbContactFields)[number]["name"], string>;

  const { formData, isSubmitting, submitMessage, submitState, setFieldValue, handleSubmit } = useFnbContactForm("pc");

  return (
    <section id="new-contact" className="relative bg-[#0c0d10] scroll-mt-6 break-keep">
      <div className="mx-auto max-w-[1240px] px-5 py-14 md:py-20">
        <SectionHeading
          eyebrow="CONTACT"
          title="프로젝트 정보를 남겨주세요"
          description="공상플래닛에서는 매월 한정된 프로젝트만 진행합니다."
        />

        <div className="mt-8 grid grid-cols-1 gap-6 md:mt-16 md:grid-cols-12 md:gap-8">
          <div className="rounded-3xl bg-[#171b24] p-4 shadow-[0_16px_40px_rgba(0,0,0,0.26)] md:col-span-7 md:p-9">
            <form className="space-y-4 md:space-y-5" onSubmit={handleSubmit}>
              {fnbContactFields.map((field) => (
                <label key={field.name} className="flex min-h-[44px] items-center gap-3 md:block">
                  <span className="w-[68px] shrink-0 text-[12px] font-semibold tracking-[-0.02em] text-[#b9b4ab] md:mb-2 md:block md:w-auto md:text-[13px]">
                    {field.label}
                  </span>
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    placeholder={placeholderMap[field.name]}
                    onChange={(e) => setFieldValue(field.name, e.target.value)}
                    required
                    className="h-[44px] min-w-0 flex-1 rounded-xl bg-black/30 px-3.5 text-[16px] font-medium text-[#f0ece3] outline-none transition-all placeholder:text-[#8d8a84] focus:bg-black/40 focus:ring-1 focus:ring-[#7f6a46]/70 md:w-full md:text-[14px]"
                  />
                </label>
              ))}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex h-[44px] w-full items-center justify-center rounded-2xl bg-white text-[14px] font-extrabold text-[#121212] transition-colors hover:bg-white/92 disabled:opacity-60"
                >
                  {isSubmitting ? "전송 중..." : "상담 신청하기"}
                </button>
                {submitMessage ? (
                  <p className={`mt-3 text-[13px] font-semibold ${submitState === "success" ? "text-[#99d979]" : "text-[#ff9090]"}`}>
                    {submitMessage}
                  </p>
                ) : null}
              </div>
            </form>
          </div>

          <div className="rounded-3xl bg-[#171b24] p-5 shadow-[0_16px_40px_rgba(0,0,0,0.26)] md:col-span-5 md:p-9">
            <p className="text-[16px] font-bold tracking-[-0.02em] text-[#f2ede4]">상담 안내</p>
            <ul className="mt-3 space-y-2 text-[14px] font-medium leading-[1.8] text-[#c7c2b8] md:mt-4 md:space-y-3">
              <li className="flex items-start">
                <span className="shrink-0">-</span>
                <span className="ml-1">일정은 빠른 상담 순으로 마감될 수 있습니다.</span>
              </li>
              <li className="flex items-start">
                <span className="shrink-0">-</span>
                <span className="ml-1">디자인의 완성도를 위해 선택된 프로젝트에 집중합니다.</span>
              </li>
            </ul>

            <div className="mt-6 rounded-2xl bg-black/30 p-4 md:mt-8 md:p-5">
              <p className="font-eng text-[11px] font-bold uppercase tracking-[0.22em] text-[#cfb27f]">STUDIO</p>
              <div className="mt-3 space-y-1 text-[13px] font-medium leading-[1.7] text-[#bcb7ad]">
                <p>gongsangplanet@gmail.com</p>
                <p>서울시 마포구 동교로17길 51 푸른감성빌딩 2층</p>
                <p>T.02 6925 3206</p>
                <p>F.02 6925 3207</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
