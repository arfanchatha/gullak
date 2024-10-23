import { Link } from "react-router-dom";

function Hero() {
  return (
    <section
      id="hero"
      className="container flex flex-col-reverse md:flex-row mx-auto px-6 mt-14"
    >
      <div className="flex flex-col lg:w-1/2 lg:mt-16 mb-44 space-y-10">
        <h1 className="text-5xl font-bold text-center lg:text-left lg:text-6xl lg:max-w-md">
          More than just saving
        </h1>
        <p className="text-2xl text-center text-gray-400 lg:max-w-md lg:text-left">
          Gullak helps you to achieve all your financial goals and lead you to
          path of financial nirvana.
        </p>
        <div className="mx-auto lg:mx-0 lg: max-w-md">
          <Link to="/memberarea" className="btn-home">
            Member Area
          </Link>
        </div>
      </div>
      <div className="lg:w-1/2 mx-auto mb-24 md:w-180 lg:mb-0">
        <img src="./hero-working.svg" alt="hero home" />
      </div>
    </section>
  );
}

export default Hero;
