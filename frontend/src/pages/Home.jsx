import { Link } from "react-router-dom";
import "../styles/home.css";

export default function Home() {
  return (
    <div className="home-cover d-flex text-center text-white bg-dark">
      <div className="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">
        <main className="px-3 my-auto">
          <h1>YelpCamp</h1>
          <p className="lead">
            Welcome to YelpCamp! Jump right in and explore our many campgrounds.
            Feel free to share some of your own and comment on others.
          </p>
          <Link to="/campgrounds" className="btn btn-lg btn-secondary fw-bold border-white bg-white">
            View Campgrounds
          </Link>
        </main>

        <footer className="mt-auto text-white-50">
          <p>&copy; 2020</p>
        </footer>
      </div>
    </div>
  );
}
