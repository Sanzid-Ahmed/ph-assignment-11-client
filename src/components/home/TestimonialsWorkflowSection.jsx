import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCoverflow, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import Logo from '../common/Logo';

const testimonials = [
  {
    name: "Alex Rivera",
    role: "Asset Manager",
    content: "Assetverse has completely transformed how we track our digital portfolio. The workflow is seamless.",
    avatar: "https://i.pravatar.cc/150?u=alex",
  },
  {
    name: "Sarah Chen",
    role: "Operations Lead",
    content: "The most intuitive asset tracking interface I've used in a decade. Deployment was a breeze.",
    avatar: "https://i.pravatar.cc/150?u=sarah",
  },
  {
    name: "Marcus Thorne",
    role: "CTO, FinTech Corp",
    content: "Security and scalability were our main concerns; Assetverse delivered on both fronts perfectly.",
    avatar: "https://i.pravatar.cc/150?u=marcus",
  },
  {
    name: "Elena Rodriguez",
    role: "Compliance Officer",
    content: "The audit trails and reporting features save our team dozens of hours every single week.",
    avatar: "https://i.pravatar.cc/150?u=elena",
  }
];

export default function TestimonialsWorkflowSection() {
  return (
    <div className="py-20 px-4 w-10/12 mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold mb-4">Trusted by Asset Experts</h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          See how leading firms are optimizing their asset lifecycle with the Assetverse workflow.
        </p>
      </div>

      <Swiper
        loop={true}
        effect={'coverflow'}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={'auto'} // Use auto for better responsiveness
        speed={1000}
        coverflowEffect={{
          rotate: 0,        // Flatter rotation looks more modern
          stretch: 0,
          depth: 200,
          modifier: 2.5,
          slideShadows: false,
        }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        modules={[EffectCoverflow, Pagination, Autoplay]}
        className="w-full max-w-5xl !pb-14"
      >
        {testimonials.map((item, index) => (
          <SwiperSlide key={index} className="!w-[350px] sm:!w-[450px]">
            <div className="bg-base-200/5 border-slate-700 p-8 rounded-2xl shadow-2xl transition-all duration-300">
              
              
              
              {/* Assetverse Decorative Icon */}
              <div className="mb-6">
                <Logo></Logo>
              </div>
              
              <p className="text-accent italic mb-8 text-lg">
                "{item.content}"
              </p>
              
              
              
              <div className="flex items-center gap-4">
                <img 
                  src={item.avatar} 
                  alt={item.name} 
                  className="w-12 h-12 rounded-full border-3 border-primary"
                />
                <div className="text-left">
                  <h4 className="text-accent text-2xl font-bold">{item.name}</h4>
                  <p className="text-primary">{item.role}</p>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}