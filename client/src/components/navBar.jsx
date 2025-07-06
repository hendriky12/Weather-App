import githubIcon from "./assets/github-icon.png";
import "./navBar.css"; // Assuming you have a CSS file for styling the NavBar

function NavBar() {
  return (
    <nav>
      <img src="./cloud-icon.png" alt="Cloudy Icon" />
      <h1>Hendrik's Weather App</h1>
      <img src={githubIcon} alt="Github Logo" />
    </nav>
  );
}

export default NavBar;
