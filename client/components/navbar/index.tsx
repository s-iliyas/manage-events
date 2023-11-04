import Link from "next/link";
import DropdownMenu from "./dropdownMenu";

const Navbar = () => {
  return (
    <nav className="h-16 fixed bg-white flex flex-row justify-around items-center w-full border-b-2">
      <Link href={"/"}>
        <strong className="text-2xl">TodoApp</strong>
      </Link>
      <DropdownMenu />
    </nav>
  );
};

export default Navbar;
