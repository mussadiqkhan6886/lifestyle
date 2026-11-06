
const Hero = () => {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-black text-white">
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
    </section>
  );
};

export default Hero;