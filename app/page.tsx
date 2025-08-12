"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Instagram, Facebook } from "lucide-react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

export default function HomePage() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, containScroll: "trimSnaps", align: "start" },
    [Autoplay({ delay: 2000, stopOnInteraction: false, stopOnMouseEnter: true })]
  );

  const techStack = [
    { name: "Python", icon: "/images/technologies/python.svg" },
    { name: "Django", icon: "/images/technologies/django.svg" },
    { name: "Flask", icon: "/images/technologies/flask.svg" },
    { name: "PySide", icon: "/images/technologies/pyside.svg" },
    { name: "HTML5", icon: "/images/technologies/html5.svg" },
    { name: "CSS / SCSS", icon: "/images/technologies/css3.svg" },
    { name: "JavaScript", icon: "/images/technologies/javascript.svg" },
    { name: "React", icon: "/images/technologies/react.svg" },
    { name: "Next.js", icon: "/images/technologies/nextjs.svg" },
    { name: "Node.js", icon: "/images/technologies/nodejs.svg" },
    { name: "MySQL", icon: "/images/technologies/mysql.svg" },
    { name: "MongoDB", icon: "/images/technologies/mongodb.svg" },
    { name: "PostgreSQL", icon: "/images/technologies/postgresql.svg" },
    { name: "Linux", icon: "/images/technologies/linux.svg" },
  ];

  const projects = [
    {
      name: "Portfolio (This Site)",
      description:
        "Portfolio website built using Next.js, Tailwind CSS, and Framer Motion.",
      github: "https://github.com/Abled-Taha/portfolio",
      deployment: "",
    },
    {
      name: "Password Manager (APM)",
      description:
        "Secure password manager with Django backend, MongoDB, and cross-platform web-app. Planned rewrite in Rails, React, PostgreSQL, and Kotlin.",
      github: "https://github.com/Abled-Taha/apm-app-web",
      deployment: "",
    },
    {
      name: "Dynamic Website Project",
      description:
        "Full-stack web app with Django backend, MongoDB database, Flutter mobile app, and Flask API.",
      github: "https://github.com/Abled-Taha/abled-taha-website",
      deployment: "",
    },
  ];

  return (
    <main className="bg-gray-950 text-white min-h-screen flex flex-col overflow-x-hidden">
      <br />
      {/* Hero */}
      <section className="flex flex-col md:flex-row items-center justify-center text-center md:text-left flex-1 px-6 gap-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
            Syed Taha Rizwan
          </h1>
          <p className="mt-2 text-lg text-gray-300">
            Web & Application Developer <strong>|</strong> Backend Master
          </p>
          <p className="mt-2 text-lg text-gray-300">
            Main Focus: Anything & Everything in <strong>Python</strong>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <Image
            src="/images/me/me.jpg"
            alt="Syed Taha Rizwan"
            width={200}
            height={200}
            className="rounded-full border-4 border-pink-500 shadow-lg"
          />
        </motion.div>
      </section>

      {/* About */}
      <section id="about" className="py-16 px-6 max-w-4xl mx-auto space-y-6">
        <h2 className="text-3xl font-bold">About Me</h2>
        <p className="text-gray-400">
          A Computer Science student deeply immersed in programming, passionate
          about transforming ideas into tangible digital solutions. Experienced
          in full-stack web and multi-platform application development.
        </p>
      </section>

      {/* Resume Download */}
      <section
        id="resume"
        className="py-16 px-6 bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 text-center rounded-xl shadow-xl max-w-6xl mx-auto my-12 border border-gray-800"
      >
        <h2 className="text-4xl font-extrabold mb-6 text-white tracking-tight">
          Resume
        </h2>
        <p className="text-gray-300 mb-8 text-base">
          You can view or download my latest resume below.
        </p>
        <a
          href="/files/resume/resume.pdf"
          download
          className="inline-block bg-gradient-to-r from-pink-500 to-purple-600 px-8 py-4 rounded-full shadow-lg text-white font-bold text-lg hover:scale-105 hover:opacity-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
        >
          Download Resume
        </a>
      </section>

      {/* Tech Stack Carousel */}
      <section className="py-16 px-4 bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 text-center rounded-xl shadow-xl max-w-6xl mx-auto my-12 border border-gray-800">
        <h2 className="text-3xl font-bold mb-8 text-center">Technology Stack</h2>

        {/* Embla structure: viewport -> container -> slides */}
        <div className="w-full max-w-full">
          <div className="embla">
            <div
              className="embla__viewport overflow-hidden w-full"
              ref={emblaRef}
            >
              {/* px ensures slides don't touch screen edges on very small devices */}
              <div className="embla__container flex gap-3 px-3">
                {techStack.map((tech, index) => (
                  <div
                    key={index}
                    /* responsive MIN widths prevent a single slide from being huge on phones */
                    className="embla__slide flex-shrink-0 min-w-[88px] sm:min-w-[120px] md:min-w-[160px] p-3 flex flex-col items-center justify-center bg-gray-800 rounded-lg shadow-md"
                  >
                    <Image
                      src={tech.icon}
                      alt={tech.name}
                      width={48}
                      height={48}
                      className="mb-2 object-contain"
                    />
                    <p className="text-gray-300 text-xs sm:text-sm text-center">{tech.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-10 text-center">Projects</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="p-6 rounded-xl shadow-lg bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 transition-all duration-300 transform hover:scale-105 flex flex-col justify-between"
            >
              <h3 className="text-2xl font-extrabold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-3">
                {project.name}
              </h3>
              <p className="text-gray-300 flex-1 mb-4">{project.description}</p>
              <a
                href={project.deployment}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-pink-300 hover:underline"
              >
                Deployed App →
              </a>
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-pink-300 hover:underline"
              >
                View on GitHub →
              </a>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section
        id="contact"
        className="py-16 px-6 text-center max-w-4xl mx-auto"
      >
        <h2 className="text-3xl font-bold mb-4">Contact Me</h2>
        <p className="text-gray-400 mb-6">
          Feel free to reach out via email at{" "}
          <a
            href="mailto:abledtaha@gmail.com"
            className="font-bold text-pink-400"
          >
            abledtaha@gmail.com
          </a>
        </p>
        <div className="flex justify-center gap-6">
          <a href="https://github.com/Abled-Taha" target="_blank">
            <Github className="w-6 h-6 hover:text-pink-500 transition" />
          </a>
          <a href="https://instagram.com/abled_taha" target="_blank">
            <Instagram className="w-6 h-6 hover:text-pink-500 transition" />
          </a>
          <a href="https://www.facebook.com/TahaRizwan03" target="_blank">
            <Facebook className="w-6 h-6 hover:text-pink-500 transition" />
          </a>
          <a href="mailto:abledtaha@gmail.com">
            <Mail className="w-6 h-6 hover:text-pink-500 transition" />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center text-gray-500 text-sm border-t border-gray-800">
        © {new Date().getFullYear()} Syed Taha Rizwan. All rights reserved.
      </footer>
    </main>
  );
}
