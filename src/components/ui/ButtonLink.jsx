import { FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";

export const ButtonLink = ({ link }) => {
  return (
    <Link to={link} className="fixed bottom-3 left-3">
      <FaArrowLeft className="bg-gray-800/50 hover:bg-gray-800 py-2 px-2 rounded-full text-4xl text-white cursor-pointer" />
    </Link>
  );
};
