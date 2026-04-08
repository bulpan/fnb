"use client";

interface ProjectGalleryProps {
    projectId: string;
    images: string[];
    isMobile?: boolean;
}

function GalleryImage({
    src,
    alt,
    className,
}: {
    src?: string;
    alt: string;
    className?: string;
}) {
    if (!src) {
        return <div className={`bg-[#111] ${className ?? ""}`} />;
    }

    return (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} className={`h-full w-full object-cover ${className ?? ""}`} />
    );
}

function PcGallery({ projectId, images }: { projectId: string; images: string[] }) {
    if (projectId === "gongdabang") {
        return (
            <div className="grid h-full w-full grid-cols-2 grid-rows-3">
                <div className="col-span-2 overflow-hidden border-b border-white/10">
                    <GalleryImage src={images[0]} alt="gongdabang-1" />
                </div>
                <div className="border-b border-r border-white/10">
                    <GalleryImage src={images[1]} alt="gongdabang-2" />
                </div>
                <div className="border-b border-white/10">
                    <GalleryImage src={images[2]} alt="gongdabang-3" />
                </div>
                <div className="border-r border-white/10">
                    <GalleryImage src={images[3]} alt="gongdabang-4" />
                </div>
                <div>
                    <GalleryImage src={images[4]} alt="gongdabang-5" />
                </div>
            </div>
        );
    }

    if (projectId === "ba") {
        return (
            <div className="grid h-full w-full grid-cols-2 grid-rows-3">
                <div className="border-b border-r border-white/10">
                    <GalleryImage src={images[0]} alt="ba-1" />
                </div>
                <div className="border-b border-white/10">
                    <GalleryImage src={images[1]} alt="ba-2" />
                </div>
                <div className="border-b border-r border-white/10">
                    <GalleryImage src={images[2]} alt="ba-3" />
                </div>
                <div className="border-b border-white/10">
                    <GalleryImage src={images[3]} alt="ba-4" />
                </div>
                <div className="border-r border-white/10">
                    <GalleryImage src={images[4]} alt="ba-5" />
                </div>
                <div>
                    <div className="grid h-full grid-cols-2 overflow-hidden">
                        <div className="border-r border-white/10">
                            <GalleryImage src={images[5]} alt="ba-6" />
                        </div>
                        <div>
                            <GalleryImage src={images[6]} alt="ba-7" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (projectId === "dowon") {
        return (
            <div className="grid h-full w-full grid-cols-2 grid-rows-3">
                <div className="border-b border-r border-white/10">
                    <GalleryImage src={images[0]} alt="dowon-1" />
                </div>
                <div className="row-span-2 border-b border-white/10">
                    <GalleryImage src={images[1]} alt="dowon-2" />
                </div>
                <div className="border-b border-r border-white/10">
                    <GalleryImage src={images[2]} alt="dowon-3" />
                </div>
                <div className="border-r border-white/10">
                    <div className="grid h-full grid-cols-2 overflow-hidden">
                        <div className="border-r border-white/10">
                            <GalleryImage src={images[3]} alt="dowon-4" />
                        </div>
                        <div>
                            <GalleryImage src={images[4]} alt="dowon-5" />
                        </div>
                    </div>
                </div>
                <div>
                    <div className="grid h-full grid-cols-2 overflow-hidden">
                        <div className="border-r border-white/10">
                            <GalleryImage src={images[5]} alt="dowon-6" />
                        </div>
                        <div>
                            <GalleryImage src={images[6]} alt="dowon-7" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (projectId === "iter") {
        return (
            <div className="grid h-full w-full grid-cols-2 grid-rows-3">
                <div className="border-b border-r border-white/10">
                    <div className="grid h-full grid-cols-2 overflow-hidden">
                        <div className="border-r border-white/10">
                            <GalleryImage src={images[0]} alt="iter-1" />
                        </div>
                        <div>
                            <GalleryImage src={images[1]} alt="iter-2" />
                        </div>
                    </div>
                </div>
                <div className="border-b border-white/10">
                    <GalleryImage src={images[2]} alt="iter-3" />
                </div>
                <div className="border-b border-r border-white/10">
                    <GalleryImage src={images[3]} alt="iter-4" />
                </div>
                <div className="border-b border-white/10">
                    <GalleryImage src={images[4]} alt="iter-5" />
                </div>
                <div className="border-r border-white/10">
                    <GalleryImage src={images[5]} alt="iter-6" />
                </div>
                <div>
                    <div className="grid h-full grid-cols-2 overflow-hidden">
                        <div className="border-r border-white/10">
                            <GalleryImage src={images[6]} alt="iter-7" />
                        </div>
                        <div>
                            <GalleryImage src={images[7]} alt="iter-8" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="grid h-full w-full grid-cols-2 grid-rows-3">
            {images.slice(0, 6).map((img, idx) => (
                <div
                    key={`${projectId}-${idx}`}
                    className={`${idx % 2 === 0 ? "border-r border-white/10" : ""} ${
                        idx < 4 ? "border-b border-white/10" : ""
                    }`}
                >
                    <GalleryImage src={img} alt={`${projectId}-${idx + 1}`} />
                </div>
            ))}
        </div>
    );
}

function MobileGallery({ projectId, images }: { projectId: string; images: string[] }) {
    if (projectId === "gongdabang") {
        return (
            <div className="w-full">
                <div className="border-b border-white/10">
                    <GalleryImage
                        src={images[0]}
                        alt="gongdabang-mobile-1"
                        className="h-auto w-full object-contain bg-[#0f1115]"
                    />
                </div>

                <div className="grid grid-cols-2">
                    <div className="border-r border-white/10">
                        <div className="aspect-[4/3] overflow-hidden">
                            <GalleryImage src={images[1]} alt="gongdabang-mobile-2" className="object-contain bg-[#0f1115]" />
                        </div>
                    </div>
                    <div className="border-white/10">
                        <div className="aspect-[4/3] overflow-hidden">
                            <GalleryImage src={images[2]} alt="gongdabang-mobile-3" className="object-contain bg-[#0f1115]" />
                        </div>
                    </div>
                    <div className="border-r border-t border-white/10">
                        <div className="aspect-[4/3] overflow-hidden">
                            <GalleryImage src={images[3]} alt="gongdabang-mobile-4" className="object-contain bg-[#0f1115]" />
                        </div>
                    </div>
                    <div className="border-t border-white/10">
                        <div className="aspect-[4/3] overflow-hidden">
                            <GalleryImage src={images[4]} alt="gongdabang-mobile-5" className="object-contain bg-[#0f1115]" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (projectId === "ba") {
        return (
            <div className="w-full">
                <div className="grid grid-cols-2 border-b border-white/10">
                    <div className="border-r border-white/10">
                        <div className="aspect-[4/3] overflow-hidden">
                            <GalleryImage src={images[0]} alt="ba-mobile-1" className="object-contain bg-[#0f1115]" />
                        </div>
                    </div>
                    <div>
                        <div className="aspect-[4/3] overflow-hidden">
                            <GalleryImage src={images[1]} alt="ba-mobile-2" className="object-contain bg-[#0f1115]" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 border-b border-white/10">
                    <div className="border-r border-white/10">
                        <div className="aspect-[4/3] overflow-hidden">
                            <GalleryImage src={images[2]} alt="ba-mobile-3" className="object-contain bg-[#0f1115]" />
                        </div>
                    </div>
                    <div>
                        <div className="aspect-[4/3] overflow-hidden">
                            <GalleryImage src={images[3]} alt="ba-mobile-4" className="object-contain bg-[#0f1115]" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2">
                    <div className="border-r border-white/10">
                        <div className="aspect-[4/3] overflow-hidden">
                            <GalleryImage src={images[4]} alt="ba-mobile-5" className="object-contain bg-[#0f1115]" />
                        </div>
                    </div>
                    <div>
                        <div className="grid aspect-[4/3] grid-cols-2 overflow-hidden">
                            <div className="border-r border-white/10">
                                <GalleryImage src={images[5]} alt="ba-mobile-6" className="object-contain bg-[#0f1115]" />
                            </div>
                            <div>
                                <GalleryImage src={images[6]} alt="ba-mobile-7" className="object-contain bg-[#0f1115]" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (projectId === "dowon") {
        return (
            <div className="w-full">
                <div className="grid grid-cols-2 border-b border-white/10">
                    <div className="border-r border-white/10">
                        <div className="border-b border-white/10">
                            <div className="aspect-[4/3] overflow-hidden">
                                <GalleryImage src={images[0]} alt="dowon-mobile-1" className="object-contain bg-[#0f1115]" />
                            </div>
                        </div>
                        <div>
                            <div className="aspect-[4/3] overflow-hidden">
                                <GalleryImage src={images[2]} alt="dowon-mobile-3" className="object-contain bg-[#0f1115]" />
                            </div>
                        </div>
                    </div>
                    <div>
                        <GalleryImage src={images[1]} alt="dowon-mobile-2" className="object-contain bg-[#0f1115]" />
                    </div>
                </div>

                <div className="grid grid-cols-2">
                    <div className="border-r border-white/10">
                        <div className="grid aspect-[4/3] grid-cols-2 overflow-hidden">
                            <div className="border-r border-white/10">
                                <GalleryImage src={images[3]} alt="dowon-mobile-4" className="object-contain bg-[#0f1115]" />
                            </div>
                            <div>
                                <GalleryImage src={images[4]} alt="dowon-mobile-5" className="object-contain bg-[#0f1115]" />
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="grid aspect-[4/3] grid-cols-2 overflow-hidden">
                            <div className="border-r border-white/10">
                                <GalleryImage src={images[5]} alt="dowon-mobile-6" className="object-contain bg-[#0f1115]" />
                            </div>
                            <div>
                                <GalleryImage src={images[6]} alt="dowon-mobile-7" className="object-contain bg-[#0f1115]" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (projectId === "iter") {
        return (
            <div className="w-full">
                <div className="grid grid-cols-2 border-b border-white/10">
                    <div className="border-r border-white/10">
                        <div className="grid aspect-[4/3] grid-cols-2 overflow-hidden">
                            <div className="border-r border-white/10">
                                <GalleryImage src={images[0]} alt="iter-mobile-1" className="object-contain bg-[#0f1115]" />
                            </div>
                            <div>
                                <GalleryImage src={images[1]} alt="iter-mobile-2" className="object-contain bg-[#0f1115]" />
                            </div>
                        </div>
                    </div>
                    <div>
                        <GalleryImage src={images[2]} alt="iter-mobile-3" className="object-contain bg-[#0f1115]" />
                    </div>
                </div>

                <div className="grid grid-cols-2 border-b border-white/10">
                    <div className="border-r border-white/10">
                        <div className="aspect-[4/3] overflow-hidden">
                            <GalleryImage src={images[3]} alt="iter-mobile-4" className="object-contain bg-[#0f1115]" />
                        </div>
                    </div>
                    <div>
                        <div className="aspect-[4/3] overflow-hidden">
                            <GalleryImage src={images[4]} alt="iter-mobile-5" className="object-contain bg-[#0f1115]" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2">
                    <div className="border-r border-white/10">
                        <div className="aspect-[4/3] overflow-hidden">
                            <GalleryImage src={images[5]} alt="iter-mobile-6" className="object-contain bg-[#0f1115]" />
                        </div>
                    </div>
                    <div>
                        <div className="grid aspect-[4/3] grid-cols-2 overflow-hidden">
                            <div className="border-r border-white/10">
                                <GalleryImage src={images[6]} alt="iter-mobile-7" className="object-contain bg-[#0f1115]" />
                            </div>
                            <div>
                                <GalleryImage src={images[7]} alt="iter-mobile-8" className="object-contain bg-[#0f1115]" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="grid w-full grid-cols-2">
            {images.map((img, idx) => (
                <div key={idx} className="aspect-[4/3] overflow-hidden">
                    <GalleryImage src={img} alt={`${projectId}-mobile-${idx + 1}`} />
                </div>
            ))}
        </div>
    );
}

export default function ProjectGallery({ projectId, images, isMobile = false }: ProjectGalleryProps) {
    if (!isMobile) {
        return <PcGallery projectId={projectId} images={images} />;
    }

    return <MobileGallery projectId={projectId} images={images} />;
}
