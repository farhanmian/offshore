import React, { Fragment, useEffect, useState } from "react";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";
import NextLink from "next/link";

import Logo from "../partials/Logo";
import HiringIcon from "../icons/HiringIcon";
import SearchBar, { MobileSearchBar } from "../SearchBar";
import useViewport from "../../hooks/useViewPort";
import { useScrollBlock } from "../../hooks/CanScroll";
import Bell from "../icons/Bell";
import { useAppContext } from "../../store/context/AppContext";
import { getCookie } from "cookies-next";
import { User } from "../../api/apiServices";

type navItem = {
  name: string;
  link: string;
};

const navLinks: navItem[] = [
  { name: "home", link: "/" },
  { name: "candidates", link: "/allCandidates" },
  { name: "apply as developer", link: "/apply" },
  { name: "about us", link: "/aboutUs" },
  { name: "contact us", link: "/contactUs" },
];

let isInitial = true;

export default function Header() {
  const router = useRouter();
  const size = useViewport();
  const [open, setOpen] = useState<any>(false);
  const {
    appliedCandidateCount,
    setAppliedCandidateCount,
    setHiringListCount,
    hiringListCount,
  } = useAppContext();

  useEffect(() => {
    const hiringList = getCookie("hiringList");
    const hiringCount = hiringList ? JSON.parse(`${hiringList}`) : [];

    setHiringListCount(hiringCount.length);
  }, []);

  useEffect(() => {
    if (!isInitial) return;
    const fetchAppliedCandidatesCount = async () => {
      try {
        const res = await User.getAppliedCandidates(8, 1);
        const appliedCount = res.data.count;

        if (res.status !== 200) {
          throw new Error(res);
        }
        if (res) {
          setAppliedCandidateCount(appliedCount ? appliedCount : 0);
        }
        isInitial = false;
      } catch (err) {
        console.log("err", err);
      }
    };
    fetchAppliedCandidatesCount();
  }, []);

  return (
    <Fragment>
      <header className="flex justify-between fixed top-0 left-0 right-0 z-20 items-center px-4 shadow-bottom py-4 bg-white">
        <button onClick={() => setOpen(true)} className="hidden mbTab:block">
          <MenuIcon className="w-8 h-auto" />
        </button>

        <div>
          <Logo className="w-44 h-14" />
        </div>

        {!router.pathname.includes("admin") && (
          <nav className="flex mbTab:hidden ml-auto">
            <ul className="flex">
              {navLinks.map((item, i) => {
                return (
                  <li
                    key={i}
                    className="font-semibold mr-6 last:mr-0 hover:text-black text-gray3"
                  >
                    <NextLink href={item.link}>
                      <a
                        className={`hover:text-black uppercase ${
                          router.pathname === item.link ? "text-black" : ""
                        }`}
                      >
                        {item.name}
                      </a>
                    </NextLink>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}

        <span
          className="cursor-pointer relative notificationIcon w-7 h-7 ml-auto xl:mr-4 mr-8 flex justify-center items-center"
          onClick={() => {
            router.push(
              router.pathname.includes("admin")
                ? "/admin/appliedCandidates"
                : "/enquiry"
            );
          }}
        >
          {router.pathname.includes("admin") ? <Bell /> : <HiringIcon />}
          <p
            className={`text-[10px] font-bold absolute right-0 ${
              router.pathname.includes("admin") ? "-top-1" : "bottom-0"
            } bg-white rounded-full border-[1.5px] w-[19px] h-[19px] flex justify-center items-center ${
              router.pathname.includes("admin") && appliedCandidateCount > 0
                ? "border-red-500 text-red-500"
                : "border-gray3 text-gray3"
            } ${
              !router.pathname.includes("admin") && hiringListCount > 0
                ? "border-red-500 text-red-500"
                : "border-gray3 text-gray3"
            }`}
          >
            {router.pathname.includes("admin") &&
              (appliedCandidateCount > 9
                ? "9+"
                : appliedCandidateCount < 0
                ? 0
                : appliedCandidateCount)}

            {!router.pathname.includes("admin") &&
              (hiringListCount > 9
                ? "9+"
                : hiringListCount < 0
                ? 0
                : hiringListCount)}
          </p>
        </span>

        {size.width >= 767 ? <SearchBar /> : <MobileSearchBar />}
      </header>
      <MobileMenu open={open} setOpen={setOpen} />
    </Fragment>
  );
}

export const MobileMenu = ({ open, setOpen }: any) => {
  const router = useRouter();

  return (
    <div
      className={`${
        open ? "translate-x-0" : "-translate-x-full"
      }   bg-white w-full absolute min-h-full z-50 transition-transform top-0`}
    >
      <button onClick={() => setOpen(false)} className="absolute right-6 top-6">
        <XIcon className="w-8 h-auto" />
      </button>
      <nav className="flex flex-col mt-20 px-6">
        <ul className="flex flex-col">
          {navLinks.map((item, i) => {
            return (
              <li
                key={i}
                className="font-semibold text-2xl mb-6 last:mb-0 hover:text-black text-gray3"
              >
                <NextLink href={item.link}>
                  <a
                    onClick={() => setOpen(false)}
                    className={`hover:text-black uppercase ${
                      router.pathname === item.link ? "text-black" : ""
                    }`}
                  >
                    {item.name}
                  </a>
                </NextLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};
