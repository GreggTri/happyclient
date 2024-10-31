"use client";

//import Image from "next/image";
import { useState } from 'react';
import Link from "next/link";
import { Icons } from "./icons";
import Image from 'next/image'
import logo from '../../../public/assets/logo.svg'

const NavBar = () => {
const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="flex flex-row w-screen py-2 px-[12%] fixed bg-background justify-between border-b border-WHITE/20 border-opacity-50 z-10">
      <Link href="/" className="flex flex-row justify-center gap-2">
        <Image src={logo} width={100} alt="HappyClient Logo"/>
      </Link>

      {/* Hamburger Menu for Mobile */}
      <button 
        className="lg:hidden flex items-center focus:outline-none"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <Icons.menu className=" absolute right-2 top-2 h-6 w-6 text-text" />
      </button>

      {/* Navigation Links */}
      <div className={`lg:flex ${isMenuOpen ? 'flex' : 'hidden'} flex-col lg:flex-row gap-6 text-text text-base font-normal items-center`}>
        <Link href="/#features" className="hover:opacity-50 transition-opacity ease duration-300" >
          Features
        </Link>
        <Link href="/#contactus" className="hover:opacity-50 transition-opacity ease duration-300" >
          Contact Us
        </Link>
        <Link href="/pricing" className="hover:opacity-50 transition-opacity ease duration-300">
          Pricing
        </Link>
        <Link href="/bookDemo">
          <button className="flex flex-row bg-primary text-background py-1 px-2 rounded-md justify-center items-center hover:-translate-x-1 transition-transform ease duration-500">
            <h2>Book a Demo</h2>
            <Icons.chevronRight className="mx-auto h-6 w-6" />
          </button>
        </Link>
      </div>
    </div>
    )
}

export default NavBar