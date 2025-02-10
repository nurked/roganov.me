import { HeroCard } from "./hero/HeroCard";
import { HeroRow } from "./hero/HeroRow";

export const Superhero = () => {
  const heroImage =
    "https://images.pexels.com/photos/1105379/pexels-photo-1105379.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";

  const heroesData = [
    {
      id: 0,
      title: "Problem Solver",
      subtitle: "You can always fix this",
      image: "./img/hero0.png", // Add your image path here
      description:
        "Veteran IT troubleshooter with over 20 recovered failing projects in 15 years. Specialized in modernizing legacy systems, from 1990s databases to modern architectures, with a perfect track record of making any system operational again. No IT challenge too complex to solve.",
    },
    {
      id: 1,
      title: "Educator",
      subtitle: "Teaching is about understanding",
      image: "./img/hero1.png", // Add your image path here
      description:
        "Dedicated educator with 6 years of global teaching experience and over 5,000 hours of mentoring. From university lectures to one-on-one sessions, successfully guided thousands of students through computer programming and game development, maintaining a remarkable 97.5% success rate.",
    },
    {
      id: 2,
      title: "Writer",
      subtitle: "Every story deserves to be told",
      image: "./img/hero2.png", // Add your image path here
      description:
        "Prolific writer with over 1 million words published and read. Distinguished contributor to habr.com with 100+ articles reaching over 1 million readers. Active writer across multiple platforms including LinkedIn, Medium, and Telegram, crafting content that ranges from technical documentation to personal narratives.",
    },
    {
      id: 3,
      title: "Volunteer",
      subtitle: "Making a difference, one person at a time",
      image: "./img/hero3.png", // Add your image path here
      description:
        "Dedicated volunteer with over 1,000 hours of community service in three years, impacting over 10,000 lives. From pandemic relief efforts to community cleanup projects, committed to hands-on involvement in various humanitarian initiatives that make a real difference in people's lives.",
    },
    {
      id: 4,
      title: "Hobby Enthusiast",
      subtitle: "Life is meant to be enjoyed together",
      image: "./img/hero4.png", // Add your image path here
      description:
        "Versatile enthusiast combining professional paintball experience with passion for bringing people together through games and events. Proven track record of organizing large-scale gatherings, including a 120-person event, and completing ambitious adventures like coast-to-coast drives.",
    },
    {
      id: 5,
      title: "Entrepreneur",
      subtitle: "Building solutions for tomorrow",
      image: "", // Add your image path here
      description:
        "Founder of multiple successful ventures including IFC LLC, providing comprehensive IT solutions with a team of seven professionals, and IGAP LLC, specializing in arts and crafts services. Focused on delivering high-quality, client-centered solutions across diverse industries.",
    },
  ];

  const cardClassName = "h-auto sm:h-[300px] lg:h-[500px]";

  return (
    <div
      id="superhero"
      className="min-h-screen bg-[#e4eef7] text-white flex flex-col"
    >
      <HeroRow layout="split">
        <HeroCard
          heroData={heroesData[0]}
          fallbackImage={heroImage}
          className={cardClassName}
        />
        <HeroCard
          heroData={heroesData[1]}
          fallbackImage={heroImage}
          className={cardClassName}
        />
      </HeroRow>

      <HeroRow layout="full" className="bg-[#d4e2f5]">
        <HeroCard
          heroData={heroesData[3]}
          fallbackImage={heroImage}
          className={cardClassName}
        />
      </HeroRow>

      <HeroRow layout="split">
        <HeroCard
          heroData={heroesData[2]}
          fallbackImage={heroImage}
          className={cardClassName}
        />
        <HeroCard
          heroData={heroesData[4]}
          fallbackImage={heroImage}
          className={cardClassName}
        />
      </HeroRow>

      <HeroRow layout="full">
        <HeroCard
          heroData={heroesData[5]}
          fallbackImage={heroImage}
          className={cardClassName}
        />
      </HeroRow>
    </div>
  );
};
