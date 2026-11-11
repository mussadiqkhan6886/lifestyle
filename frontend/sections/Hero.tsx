import { aire } from "@/lib/fonts";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="relative h-[90vh] w-full overflow-hidden bg-black text-white flex items-end">
      <div className="absolute inset-0 w-full h-full">
        <video 
          src="/hero.mp4" 
          muted 
          autoPlay 
          loop 
          playsInline
          className="w-full h-full scale-x-105 object-cover object-center"
        />
      </div>
        <div className="absolute inset-0 w-full h-full bg-black/20 block md:hidden" />

      <div className="relative z-10 max-w-3xl p-6 sm:p-12 md:p-14 space-y-6 mb-4">
        <h1 className={`text-[32px] sm:text-5xl md:text-6xl lg:text-7xl text-white leading-10 sm:leading-16 md:leading-20 tracking-widest ${aire.className}`}>
          Future-Ready
          <br />
          <span className=" text-gray-200">Fashion</span>
        </h1>

        <p className="text-white/80 sm:text-white/75 text-[13px] sm:text-[17px] font-light leading-relaxed sm:mr-10">
          Discover a curated collection of watches, clothing, bags, and accessories, imported from the UK to bring timeless style and quality to your everyday look.
        </p>

        <div className="pt-2">
          <Link 
            href="/collections/all" 
            className="inline-flex items-center bg-white text-black font-medium rounded-lg overflow-hidden hover:bg-light-beige transition-colors duration-300 group shadow-lg"
          >
            <span className="px-4 py-0 sm:px-5 sm:py-3 text-[13px] sm:text-sm tracking-wider uppercase font-semibold">
              Shop Now
            </span>
            <div className="bg-black p-3 sm:p-4 mr-1 my-1 rounded-md flex items-center justify-center group-hover:bg-gray-900 transition-colors">
              <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform duration-200" />
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;