const featuredProjects = [
  {
    description:
      "A trust-first social discovery app where every connection is explained through real mutual friends!",
    imageAlt: "Grapevine project artwork",
    imageClassName: "project-panel-image-cover",
    imageSrc: "/upscaled.png",
    kicker: "Pow",
    theme: "project-panel-theme-grapevine",
    title: "Grapevine",
    url: "https://www.foafapp.com",
  },
  {
    description:
      "AI Service Booking & Admin Dashboard. Your personal tech repair crew!",
    imageAlt: "Nerdherd project logo",
    imageClassName: "project-panel-image-contain",
    imageSrc: "/NerdHerdNewLogo.svg",
    kicker: "Zap",
    theme: "project-panel-theme-nerdherd",
    title: "Nerdherd",
    url: "https://project-nerd.onrender.com",
  },
  {
    description:
      "An AI Tutoring Platform making education personalized and extremely powerful.",
    imageAlt: "Tutorcraft project artwork",
    imageClassName: "project-panel-image-contain",
    imageSrc: "/tutorcraft.png",
    kicker: "Bam",
    theme: "project-panel-theme-tutorcraft",
    title: "Tutorcraft",
    url: "https://project-cypher-1.onrender.com",
  },
  {
    description:
      "Gamify your existence! A goal tracking and life progression system.",
    imageAlt: "Project Life project artwork",
    imageClassName: "project-panel-image-contain",
    imageSrc: "/pl.png",
    kicker: "Thwip",
    theme: "project-panel-theme-life",
    title: "Project Life",
    url: "https://project-life-1.onrender.com",
  },
];

export default function ProjectsSection() {
  return (
    <section className="blank-comic-section" id="projects">
      <div className="blank-comic-title-strip">
        <h2 className="blank-comic-title">Featured Projects</h2>
        <div className="blank-comic-title-underline" />
      </div>
      <div aria-label="Blank comic layout" className="blank-comic-page">
        {featuredProjects.map((project, index) => (
          <a
            key={project.title}
            aria-label={`Open ${project.title} in a new tab`}
            className={`blank-comic-panel blank-comic-panel-${index + 1} ${project.theme}`}
            href={project.url}
            rel="noopener noreferrer"
            target="_blank"
          >
            <img
              alt={project.imageAlt}
              className={`project-panel-image ${project.imageClassName}`}
              src={project.imageSrc}
            />
            <span className="project-panel-kicker">{project.kicker}</span>
            <div className="project-panel-copy">
              <h3 className="comic-heading project-panel-title">
                {project.title}
              </h3>
              <p>{project.description}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
