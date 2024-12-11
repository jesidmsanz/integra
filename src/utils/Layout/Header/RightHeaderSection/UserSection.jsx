"use client";
import React from "react";
import Image from "next/image";
import { Href, ImagePath } from "@/Constant/constant";
import Link from "next/link";
import { LogOut } from "react-feather";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

export const UserSection = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const handleLogout = () => signOut({ callbackUrl: "/auth/login" });
  return (
    <li className="profile-nav onhover-dropdown p-0">
      <div className="d-flex align-items-center profile-media">
        <Image
          priority
          width={40}
          height={40}
          className="b-r-10 img-40 img-fluid"
          src={`${ImagePath}/dashboard/profile.png`}
          alt="user"
        />
        <div className="flex-grow-1">
          <span>{session?.user?.Email}</span>
          <p className="mb-0">
            {session?.user?.Role} <i className="middle fa fa-angle-down" />
          </p>
        </div>
      </div>
      <ul className="profile-dropdown onhover-show-div">
        <li onClick={handleLogout}>
          <Link href={Href}>
            <LogOut />
            <span>Log Out</span>
          </Link>
        </li>
      </ul>
    </li>
  );
};
