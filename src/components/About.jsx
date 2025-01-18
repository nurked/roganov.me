import React from 'react';

export const About = () => {
    return (
        <div className="w-full h-auto md:h-screen flex flex-col md:flex-row">
            {/* Left section (Image and Name) */}
            <div className="w-full md:w-1/3 bg-[#F6F1D1] relative flex flex-col items-center justify-center p-4">
                <img
                    src="https://images.pexels.com/photos/1105379/pexels-photo-1105379.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                    alt="Placeholder"
                    className="w-full h-1/2 max-w-[calc(100%-2rem)] rounded-lg object-cover"
                />
                <div className="mt-4 text-center text-black">
                    <p className="font-bold text-lg">Ivan Roganov</p>
                    <p className="text-sm">CEO, XYZ Company</p>
                </div>
            </div>

            {/* Right section (Content) */}
            <div className="w-full md:w-2/3 bg-[#CFD7C7] p-8 flex flex-col items-center justify-center">
                <div className="w-full max-w-3xl">
                    <p className="mb-4 text-lg font-bold">
                    With 25 years of experience in IT, I’ve been programming since 1999, honing my skills and expertise across multiple areas of technology. I graduated from Moscow State University of Informatics in 2008 with a degree in Computer Science, where my foundation in IT was solidified.
                    </p>
                    <p className="mb-4 text-lg font-bold">
                    Since 2004, I’ve gained hands-on programming experience alongside leading teams and managing projects, applying my knowledge to real-world challenges. Over the years, I’ve developed a strong problem-solving approach, believing that every issue can be fixed.
                    </p>
                    <p className="mb-4 text-lg font-bold">
                    I have successfully managed over 20 failing IT projects in the past 15 years, turning them around and making them operational. I am confident in my ability to tackle any project, no matter how challenging.
                    </p>
                    <p className="mb-4 text-lg font-bold">
                    ’ve also recovered and modernized more than 10 databases, projects, and CRMs, bringing them up to contemporary standards by updating them from outdated 1990s systems.
                    </p>
                    <p className="mb-4 text-lg font-bold">
                        There isn’t a program that can’t be fixed, and there isn’t an IT system that can’t be made operational.
                    </p>
                    <p className="mb-4 text-lg font-bold">
                    In my career, I’ve learned that no program is beyond repair, and no IT system is beyond restoration. There’s always a way to fix it and make it better.
                    </p>
                </div>
            </div>
        </div>
    );
};
